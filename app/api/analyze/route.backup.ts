import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { buildPrompt, type TAJson } from '@/lib/prompt';
import { renderPdfStructured } from '@/lib/pdf';
import { getUser, requireAccess } from '@/lib/auth';

export const runtime = 'nodejs';
export const maxDuration = 60;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function extractJson(s: string): string {
  // Strip ```json ... ``` or ``` ... ```
  const fenced = s.match(/```json([\s\S]*?)```/i);
  if (fenced) return fenced[1].trim();
  const fencedAny = s.match(/```([\s\S]*?)```/);
  if (fencedAny) return fencedAny[1].trim();
  return s.trim();
}

export async function POST(req: NextRequest) {
  try {
    // 🔒 kräver inloggning (Supabase)
    const user = await getUser();
    if (!requireAccess(user)) {
      return new NextResponse('Login required', { status: 401 });
    }

    // Formdata
    const form = await req.formData();
    const asset = String(form.get('asset') || '').trim();
    const price = String(form.get('price') || '').trim();
    if (!asset || !price) {
      return new NextResponse('Asset and price are required', { status: 400 });
    }

    const img1d = form.get('img1d') as File | null;
    const img1w = form.get('img1w') as File | null;
    const img1m = form.get('img1m') as File | null;

    // Läs filer -> Buffer (för PDF) + data-URL (för OpenAI)
    async function toBufAndDataUrl(f?: File | null) {
      if (!f) return { buf: undefined as Buffer | undefined, url: undefined as string | undefined };
      const ab = await f.arrayBuffer();
      const buf = Buffer.from(ab);
      const mime = f.type && f.type.startsWith('image/') ? f.type : 'image/jpeg';
      const url = `data:${mime};base64,${buf.toString('base64')}`;
      return { buf, url };
    }

    const [{ buf: buf1d, url: url1d }, { buf: buf1w, url: url1w }, { buf: buf1m, url: url1m }] =
      await Promise.all([toBufAndDataUrl(img1d), toBufAndDataUrl(img1w), toBufAndDataUrl(img1m)]);

    // Prompt + multimodalt innehåll
    const prompt = buildPrompt(asset, price);
    const userContent: Array<any> = [{ type: 'text', text: prompt }];
    [url1d, url1w, url1m].forEach((u) => u && userContent.push({ type: 'image_url', image_url: { url: u } }));

    // Modellanrop (returnera ENDAST JSON)
    const chat = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.1,
      messages: [
        { role: 'system', content: 'You return ONLY raw JSON in English that matches the user schema. No markdown.' },
        // @ts-ignore — multimodal content array
        { role: 'user', content: userContent }
      ]
    });

    const raw = chat.choices?.[0]?.message?.content || '';
    const jsonText = extractJson(raw);

    // Tolkning av JSON (fallback om det skulle fallera)
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
          short: { bias: 'neutral', entry: '-', stop: '-', tps: [], rr: undefined, notes: '-' }
        },
        risks: { invalidation: '-', risk_factors: [], volatility: '-' },
        summary: 'The analysis could not be structured from the model output.',
        disclaimer:
          'Important: This document is not financial advice. It is a technical analysis for informational purposes only.'
      };
    }

    // Rendera PDF
    const pdf = await renderPdfStructured({
      data,
      images: { img1d: buf1d, img1w: buf1w, img1m: buf1m }
    });

    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${asset.replace(/[^a-z0-9_-]/gi, '_')}_analysis.pdf"`
      }
    });
  } catch (err: any) {
    const msg =
      err?.response?.data?.error?.message ||
      err?.message ||
      'Internal error generating analysis.';
    return new NextResponse(msg, { status: 500 });
  }
}
