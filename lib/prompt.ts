// lib/prompt.ts
export type TAJson = {
  meta: {
    asset: string;
    price: string;
    timestamp: string;
    language: 'en';
  };
  overview: {
    thesis: string;
    trend_d1: string;
    trend_w1: string;
    trend_m1: string;
  };
  levels: {
    supports: Array<{ level: number; notes?: string }>;
    resistances: Array<{ level: number; notes?: string }>;
    key_liquidity?: string[];
  };
  indicators: {
    rsi?: { value?: number; signal: string };
    macd?: { signal: string };
    ma?: { ma50?: string; ma200?: string };
    volume?: string;
    // optional extension for Step 3 (volume profile section in PDF)
    volume_profile?: string[];
  };
  structures?: {
    bos?: string[];
    choch?: string[];
    fvg?: string[];
    order_blocks?: string[];
    patterns?: string[];
    fibonacci?: Array<{ level: string; price?: number }>;
  };
  scenarios: {
    long: {
      bias: 'bullish' | 'neutral' | 'mixed';
      entry: string;
      stop: string;
      tps: string[];
      rr?: string;
      notes?: string;
    };
    short: {
      bias: 'bearish' | 'neutral' | 'mixed';
      entry: string;
      stop: string;
      tps: string[];
      rr?: string;
      notes?: string;
    };
  };
  risks: {
    invalidation: string;
    risk_factors: string[];
    volatility?: string;
  };
  summary: string;
  disclaimer: string;
};

export function buildPrompt(asset: string, price: string) {
  return `
You are an extremely rigorous professional technical analyst. Respond in **English** and OUTPUT ONLY RAW JSON matching the schema below. No markdown, no code fences, no explanations.

Asset: "${asset}"
Current price: "${price}"
Attached images: 1D, 1W, 1M (use them if present).

Requirements:
- Describe trends for 1D / 1W / 1M.
- List 3–6 support and resistance levels with brief rationale when relevant.
- Summarize indicators (RSI, MACD, MA50/MA200, volume).
- Mention structures like BOS/CHoCH/FVG/order blocks/Fibonacci if visible.
- Provide two actionable scenarios:
  * LONG: entry, stop, at least 2 targets (TPs), approximate R/R.
  * SHORT: entry, stop, at least 2 targets (TPs), approximate R/R.
- State an invalidation level and key risks.
- Conclude with a concise bullet-style "summary".
- Include a clear legal disclaimer that this is not financial advice.

Schema (exact field names and structure):
{
  "meta": { "asset": string, "price": string, "timestamp": string, "language": "en" },
  "overview": { "thesis": string, "trend_d1": string, "trend_w1": string, "trend_m1": string },
  "levels": {
    "supports": [{"level": number, "notes": string?}],
    "resistances": [{"level": number, "notes": string?}],
    "key_liquidity": string[]?
  },
  "indicators": {
    "rsi": {"value": number?, "signal": string}?,
    "macd": {"signal": string}?,
    "ma": {"ma50": string?, "ma200": string?}?,
    "volume": string?,
    "volume_profile": string[]?
  },
  "structures": {
    "bos": string[]?,
    "choch": string[]?,
    "fvg": string[]?,
    "order_blocks": string[]?,
    "patterns": string[]?,
    "fibonacci": [{"level": string, "price": number?}]?
  },
  "scenarios": {
    "long": {"bias": "bullish"|"neutral"|"mixed", "entry": string, "stop": string, "tps": string[], "rr": string?, "notes": string?},
    "short": {"bias": "bearish"|"neutral"|"mixed", "entry": string, "stop": string, "tps": string[], "rr": string?, "notes": string?}
  },
  "risks": { "invalidation": string, "risk_factors": string[], "volatility": string? },
  "summary": string,
  "disclaimer": string
}

Important:
- Return ONLY valid JSON that matches the schema. No stars, no backticks, no code fences.
`.trim();
}
