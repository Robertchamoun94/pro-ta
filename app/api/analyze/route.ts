// app/api/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import OpenAI from 'openai';
import { buildPrompt, type TAJson } from '@/lib/prompt';
import { renderPdfStructured } from '@/lib/pdf';

import { requireBillingAccess } from '@/lib/billing';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const maxDuration = 60;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function extractJson(s: string): string {
  const fenced = s.match(/```json([\s\S]*?)```/i);
  if (fenced) return fenced[1].trim();
  const fencedAny = s.match(/```([\s\S]*?)```/);
  if (fencedAny) return fencedAny[1].trim();
  return s.trim();
}

function getFirst(form: FormData, ...names: string[]): FormDataEntryValue | null {
  for (const n of names) {
    const v = form.get(n);
    if (v !== null && v !== undefined) return v;
  }
  return null;
}

async function toBufAndDataUrl(f?: File | null) {
  if (!f) return { buf: undefined as Buffer | undefined, url: undefined as string | undefined };
  const ab = await f.arrayBuffer();
  const buf = Buffer.from(ab);
  const mime = f.type && f.type.startsWith('image/') ? f.type : 'image/jpeg';
  const url = `data:${mime};base64,${buf.toString('base64')}`;
  return { buf, url };
}

export async function POST(req: NextRequest) {
  try {
    // 1) Auth
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // Vill du också auto-redirecta till login?
      // return NextResponse.redirect(new URL('/signin?redirect=/dashboard', req.url));
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const userId = session.user.id;

    // 2) Paywall: aktiv sub ELLER dra 1 kredit
    const gate = await requireBillingAccess(userId);
    if (!gate.ok) {
      // ➜ Direkt till pricing om ingen plan/kredit
      const url = new URL('/pricing?upgrade=1', req.url);
      return NextResponse.redirect(url); // 307 by default
    }

    // 3) Läs form
    const form = await req.formData();
    const asset = String(getFirst(form, 'asset') ?? '').trim();
    const price = String(getFirst(form, 'price') ?? '').trim();
    if (!asset || !price) {
      // rollback 1 kredit om vi nyss drog en
      if (gate.usedCredit) {
        try {
          await supabaseAdmin.rpc('grant_credits', { p_user_id: userId, p_n: 1 });
        } catch {}
      }
      return new NextResponse('Asset and price are required', { status: 400 });
    }

    const f1d = getFirst(form, 'chart1d', 'img1d') as File | null;
    const f1w = getFirst(form, 'chart1w', 'img1w') as File | null;
    const f1m = getFirst(form, 'chart1m', 'img1m') as File | null;

    const [{ buf: buf1d, url: url1d }, { buf: buf1w, url: url1w }, { buf: buf1m, url: url1m }] =
      await Promise.all([toBufAndDataUrl(f1d), toBufAndDataUrl(f1w), toBufAndDataUrl(f1m)]);

    // 4) OpenAI
    const prompt = buildPrompt(asset, price);
    const userContent: Array<any> = [{ type: 'text', text: prompt }];
    [url1d, url1w, url1m].forEach((u) => u && userContent.push({ type: 'image_url', image_url: { url: u } }));

    const chat = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.1,
      messages: [
        { role: 'system', content: 'You return ONLY raw JSON in English that matches the user schema. No markdown.' },
        // @ts-ignore – multimodal
        { role: 'user', content: userContent },
      ],
    });

    const raw = chat.choices?.[0]?.message?.content || '';
    const jsonText = extractJson(raw);

    let data: TAJson;
    try {
      data = JSON.parse(jsonText) as TAJson;
    } catch {
      data = {
        meta: { asset, price, timestamp: new Date().toISOString(), language: 'en' },
        overview: { thesis: 'Could not parse structured output.', trend_d1: '-', trend_w1: '-', trend_m1: '-' },
        levels: { supports: [], resistances: [] },
        indicators: {},
        structures: {},
        scenarios: {
          long: { bias: 'neutral', entry: '-', stop: '-', tps: [], rr: undefined, notes: '-' },
          short: { bias: 'neutral', entry: '-', stop: '-', tps: [], rr: undefined, notes: '-' },
        },
        risks: { invalidation: '-', risk_factors: [], volatility: '-' },
        summary: 'The analysis could not be structured from the model output.',
        disclaimer:
          'Important: This document is not financial advice. It is a technical analysis for informational purposes only.',
      };
    }

    // 5) PDF
    let pdf: Buffer;
    try {
      pdf = await renderPdfStructured({
        data,
        images: { img1d: buf1d, img1w: buf1w, img1m: buf1m },
      });
    } catch (e) {
      // rollback kredit om generering faller
      if (gate.usedCredit) {
        try {
          await supabaseAdmin.rpc('grant_credits', { p_user_id: userId, p_n: 1 });
        } catch {}
      }
      throw e;
    }

    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${asset.replace(/[^a-z0-9_-]/gi, '_')}_analysis.pdf"`,
      },
    });
  } catch (err: any) {
    const msg =
      err?.response?.data?.error?.message ||
      err?.message ||
      'Internal error generating analysis.';
    return new NextResponse(msg, { status: 500 });
  }
}
