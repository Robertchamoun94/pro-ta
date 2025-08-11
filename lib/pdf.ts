// lib/pdf.ts — flowing layout + footer + color-coded scenarios (EN)
// Uses BRAND.name for title/footer
import { PDFDocument, StandardFonts, rgb, PageSizes } from 'pdf-lib';
import type { TAJson } from './prompt';
import { BRAND } from '@/lib/config';

type Images = { img1d?: Buffer; img1w?: Buffer; img1m?: Buffer };

const C = {
  bg: '#0B0F17',
  panel: '#111827',
  panel2: '#0F172A',
  text: '#E5E7EB',
  sub: '#9CA3AF',
  badge: '#94A3B8',
  // scenarios
  longBg: '#0E2E1A',
  longText: '#34D399',
  shortBg: '#3A0E12',
  shortText: '#F87171'
};

function hexToRgb(hex: string) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)!;
  return rgb(parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255);
}

async function embedImage(pdf: PDFDocument, buf?: Buffer) {
  if (!buf) return null;
  const isPng = buf[0] === 0x89 && buf[1] === 0x50;
  try {
    return isPng ? await pdf.embedPng(buf) : await pdf.embedJpg(buf);
  } catch {
    return null;
  }
}

export async function renderPdfStructured({
  data,
  images
}: {
  data: TAJson;
  images: Images;
}): Promise<Buffer> {
  const pdf = await PDFDocument.create();
  const [W, H] = PageSizes.A4 as [number, number];
  const M = 28;

  // state
  let page = pdf.addPage(PageSizes.A4);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  let cursorY = H - M;
  const dateStr = new Date().toLocaleDateString('en-GB'); // yyyy-mm-dd style

  const drawBackground = (p = page) => {
    p.drawRectangle({ x: 0, y: 0, width: W, height: H, color: hexToRgb(C.bg) });
  };
  drawBackground();

  const newPage = () => {
    page = pdf.addPage(PageSizes.A4);
    drawBackground(page);
    cursorY = H - M;
  };

  const ensureSpace = (needed: number) => {
    if (cursorY - needed < M) newPage();
  };

  const drawTitle = (title: string, subtitle?: string) => {
    ensureSpace(44);
    page.drawText(title, { x: M, y: cursorY - 20, size: 20, font, color: hexToRgb(C.text) });
    if (subtitle) {
      page.drawText(subtitle, { x: M, y: cursorY - 38, size: 10, font, color: hexToRgb(C.sub) });
    }
    cursorY -= 44;
  };

  const drawLabel = (text: string, color = C.badge) => {
    ensureSpace(18);
    page.drawText(text, { x: M, y: cursorY - 12, size: 9, font, color: hexToRgb(color) });
    cursorY -= 18;
  };

  const wrapText = (text: string, size: number, maxWidth: number) => {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let line = '';
    for (const w of words) {
      const test = line ? line + ' ' + w : w;
      const width = font.widthOfTextAtSize(test, size);
      if (width > maxWidth) {
        if (line) lines.push(line);
        if (font.widthOfTextAtSize(w, size) > maxWidth) {
          let cur = '';
          for (const ch of w.split('')) {
            const t = cur + ch;
            if (font.widthOfTextAtSize(t, size) > maxWidth) {
              lines.push(cur);
              cur = ch;
            } else cur = t;
          }
          line = cur;
        } else {
          line = w;
        }
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  };

  const drawParagraph = (text: string, size = 12, color = C.text, maxWidth = W - M * 2) => {
    const lineH = size * 1.35;
    const paras = text.split(/\n{2,}/);
    for (const para of paras) {
      const lines = wrapText(para, size, maxWidth);
      for (const ln of lines) {
        ensureSpace(lineH);
        page.drawText(ln, { x: M, y: cursorY - size, size, font, color: hexToRgb(color) });
        cursorY -= lineH;
      }
      cursorY -= lineH * 0.35;
    }
  };

  const drawBullets = (items: string[], size = 12, maxWidth = W - M * 2, color = C.text) => {
    const lineH = size * 1.35;
    for (const it of items) {
      const pre = '• ';
      const lines = wrapText(it, size, maxWidth - font.widthOfTextAtSize(pre, size));
      for (let i = 0; i < lines.length; i++) {
        ensureSpace(lineH);
        if (i === 0) {
          page.drawText(pre, { x: M, y: cursorY - size, size, font, color: hexToRgb(color) });
          page.drawText(lines[i], {
            x: M + font.widthOfTextAtSize(pre, size),
            y: cursorY - size,
            size,
            font,
            color: hexToRgb(color)
          });
        } else {
          page.drawText(lines[i], {
            x: M + font.widthOfTextAtSize(pre, size),
            y: cursorY - size,
            size,
            font,
            color: hexToRgb(color)
          });
        }
        cursorY -= lineH;
      }
    }
  };

  /**
   * Color-coded scenario panel. Keeps heading + at least 3 lines together.
   * Continues on next page with “(cont.)” if needed.
   */
  const drawScenario = (
    title: string,
    items: string[],
    panelBg: string,
    textColor: string
  ) => {
    const size = 12;
    const lineH = size * 1.35;
    const padding = 12;
    const bullet = '• ';
    const bulletW = font.widthOfTextAtSize(bullet, size);
    const contentW = W - M * 2 - padding * 2 - bulletW;

    const rows: Array<{ first: boolean; text: string }> = [];
    for (const it of items) {
      const wrapped = wrapText(it, size, contentW);
      wrapped.forEach((ln, idx) => rows.push({ first: idx === 0, text: ln }));
    }

    let i = 0;
    let firstChunk = true;

    while (i < rows.length) {
      const minBlock = 18 + padding * 2 + lineH * Math.min(3, rows.length - i);
      if (cursorY - minBlock < M) newPage();

      // heading
      drawLabel(firstChunk ? title : `${title} (cont.)`, textColor);

      const avail = cursorY - M;
      const linesFit = Math.max(1, Math.floor((avail - padding * 2) / lineH));
      const take = Math.min(linesFit, rows.length - i);

      const boxH = padding * 2 + take * lineH;
      page.drawRectangle({
        x: M, y: cursorY - boxH, width: W - M * 2, height: boxH, color: hexToRgb(panelBg)
      });

      let y = cursorY - padding;
      for (let k = 0; k < take; k++) {
        const row = rows[i + k];
        if (row.first) {
          page.drawText(bullet, { x: M + padding, y: y - size, size, font, color: hexToRgb(textColor) });
          page.drawText(row.text, {
            x: M + padding + bulletW, y: y - size, size, font, color: hexToRgb(textColor)
          });
        } else {
          page.drawText(row.text, {
            x: M + padding + bulletW, y: y - size, size, font, color: hexToRgb(textColor)
          });
        }
        y -= lineH;
      }

      cursorY -= boxH + 10;
      i += take;
      firstChunk = false;

      if (i < rows.length && cursorY - (18 + padding * 2 + lineH * 3) < M) newPage();
    }
  };

  // — Header + meta —
  drawTitle(`${BRAND.name} — Technical Analysis`, new Date().toLocaleString('en-GB'));
  const metaH = 70;
  ensureSpace(metaH);
  page.drawRectangle({ x: M, y: cursorY - metaH, width: W - M * 2, height: metaH, color: hexToRgb(C.panel) });
  page.drawText(`${data.meta.asset}`, { x: M + 12, y: cursorY - 26, size: 16, font, color: hexToRgb(C.text) });
  page.drawText(`Current price: ${data.meta.price}`, { x: M + 12, y: cursorY - 46, size: 12, font, color: hexToRgb(C.sub) });
  cursorY -= metaH + 10;

  // — Charts 1D/1W/1M —
  const imgH = 120;
  const gap = 10;
  const colW = (W - M * 2 - gap * 2);
  const colWEach = colW / 3;
  ensureSpace(imgH + 24);
  for (let i = 0; i < 3; i++) {
    const x = M + i * (colWEach + gap);
    page.drawRectangle({ x, y: cursorY - imgH, width: colWEach, height: imgH, color: hexToRgb(C.panel2) });
    const label = i === 0 ? '1D' : i === 1 ? '1W' : '1M';
    page.drawText(label, { x: x + 8, y: cursorY - 14, size: 9, font, color: hexToRgb(C.badge) });
  }
  const frames = [images.img1d, images.img1w, images.img1m];
  for (let i = 0; i < 3; i++) {
    const x = M + i * (colWEach + gap);
    const emb = await embedImage(pdf, frames[i]);
    if (emb) {
      const scale = Math.min((colWEach - 12) / emb.width, (imgH - 24) / emb.height);
      page.drawImage(emb, { x: x + 6, y: cursorY - imgH + 12, width: emb.width * scale, height: emb.height * scale });
    }
  }
  cursorY -= imgH + 20;

  // — Overview —
  drawLabel('Overview');
  drawParagraph(data.overview.thesis || '-');

  // — Trend —
  drawLabel('Trend (1D / 1W / 1M)');
  drawBullets([
    `1D: ${data.overview.trend_d1 || '-'}`,
    `1W: ${data.overview.trend_w1 || '-'}`,
    `1M: ${data.overview.trend_m1 || '-'}`
  ]);

  // — Support & Resistance —
  drawLabel('Support & Resistance');
  const levelLines: string[] = [];
  (data.levels.supports || []).forEach(s => levelLines.push(`Support: ${s.level}${s.notes ? ` — ${s.notes}` : ''}`));
  (data.levels.resistances || []).forEach(r => levelLines.push(`Resistance: ${r.level}${r.notes ? ` — ${r.notes}` : ''}`));
  drawBullets(levelLines.length ? levelLines : ['-']);

  // — Indicators —
  drawLabel('Indicators');
  const ind: string[] = [];
  if (data.indicators.rsi) ind.push(`RSI: ${data.indicators.rsi.value ?? '-'} (${data.indicators.rsi.signal})`);
  if (data.indicators.macd) ind.push(`MACD: ${data.indicators.macd.signal}`);
  if (data.indicators.ma) ind.push(`MAs: ${data.indicators.ma.ma50 ?? '-'} / ${data.indicators.ma.ma200 ?? '-'}`);
  if (data.indicators.volume) ind.push(`Volume: ${data.indicators.volume}`);
  drawBullets(ind.length ? ind : ['-']);

  // — Volatility —
  drawLabel('Volatility');
  drawParagraph(data.risks.volatility || 'No data.');

  // — Volume Profile —
  drawLabel('Volume Profile');
  const volProfileLines: string[] = Array.isArray(data.indicators.volume_profile) && data.indicators.volume_profile.length
    ? data.indicators.volume_profile
    : ['No data.'];
  drawBullets(volProfileLines);

  // — Market Structure —
  drawLabel('Market Structure');
  const structs: string[] = [];
  data.structures?.bos?.forEach(x => structs.push(`BOS: ${x}`));
  data.structures?.choch?.forEach(x => structs.push(`CHoCH: ${x}`));
  data.structures?.fvg?.forEach(x => structs.push(`FVG: ${x}`));
  data.structures?.order_blocks?.forEach(x => structs.push(`Order block: ${x}`));
  data.structures?.patterns?.forEach(x => structs.push(`Pattern: ${x}`));
  data.structures?.fibonacci?.forEach(x => structs.push(`Fibonacci ${x.level}${x.price ? ` @ ${x.price}` : ''}`));
  drawBullets(structs.length ? structs : ['-']);

  // — Scenarios (color coded) —
  const longLines = [
    `Bias: ${data.scenarios.long.bias}`,
    `Entry: ${data.scenarios.long.entry}`,
    `Stop: ${data.scenarios.long.stop}`,
    `TPs: ${data.scenarios.long.tps?.join(', ') || '-'}`,
    `R/R: ${data.scenarios.long.rr ?? '-'}`,
    data.scenarios.long.notes ? `Notes: ${data.scenarios.long.notes}` : undefined
  ].filter(Boolean) as string[];
  drawScenario('LONG Scenario', longLines, C.longBg, C.longText);

  const shortLines = [
    `Bias: ${data.scenarios.short.bias}`,
    `Entry: ${data.scenarios.short.entry}`,
    `Stop: ${data.scenarios.short.stop}`,
    `TPs: ${data.scenarios.short.tps?.join(', ') || '-'}`,
    `R/R: ${data.scenarios.short.rr ?? '-'}`,
    data.scenarios.short.notes ? `Notes: ${data.scenarios.short.notes}` : undefined
  ].filter(Boolean) as string[];
  drawScenario('SHORT Scenario', shortLines, C.shortBg, C.shortText);

  // — Risks & Invalidation —
  drawLabel('Risks & Invalidation');
  drawBullets([
    `Invalidation: ${data.risks.invalidation}`,
    ...(data.risks.risk_factors?.length ? data.risks.risk_factors : ['-'])
  ]);

  // — Summary —
  drawLabel('Summary');
  drawParagraph(data.summary || '-');

  // — Disclaimer —
  drawLabel('IMPORTANT DISCLAIMER');
  const disclaimer =
    data.disclaimer ||
    'Important: This document is not financial advice. It is a technical analysis for informational purposes only and should not be interpreted as a solicitation or recommendation to buy or sell any financial instrument. Trading involves risk, and past performance is not indicative of future results. You are solely responsible for your investment decisions.';
  drawParagraph(disclaimer, 10, C.sub);

  // — Footer on all pages —
  const pages = pdf.getPages();
  const total = pages.length;
  const footerSize = 9;
  const footerColor = hexToRgb(C.sub);
  for (let i = 0; i < total; i++) {
    const p = pages[i];
    const text = `${BRAND.name} • ${dateStr} • Page ${i + 1} of ${total}`;
    const width = font.widthOfTextAtSize(text, footerSize);
    p.drawText(text, {
      x: (W - width) / 2,
      y: 16,
      size: footerSize,
      font,
      color: footerColor
    });
  }

  const bytes = await pdf.save();
  return Buffer.from(bytes);
}
