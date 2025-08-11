# Pro TA — MVP

AI-driven teknisk analys som PDF. TradingView-liknande mörkt UI. Stripe-stub och mock-auth.

## Snabbstart

1. **Krav**: Node 20+, pnpm/yarn/npm
2. `cp .env.example .env` och fyll **OPENAI_API_KEY** + **APP_URL**. (Stripe är valfritt för MVP.)
3. `npm i`
4. `npm run dev`
5. Öppna http://localhost:3000

## Flöde

- Formulär: asset + nupris + 3 grafer (1D/1W/1M)
- API /api/analyze: skickar prompt + bilder till OpenAI (gpt-4o-mini)
- PDF genereras server-side med pdfkit (mörk layout), returneras som nedladdning

## Stripe (valfritt initialt)

- Skapa två priser i Stripe: 199 kr/mån (subscription) och 49 kr (one-off)
- Lägg deras **price_*** i `.env` som `STRIPE_PRICE_SUB_199` och `STRIPE_PRICE_ONEOFF_49`
- Sätt `STRIPE_SECRET_KEY` och `STRIPE_WEBHOOK_SECRET` om du aktiverar betalning
- I produktion: koppla webhook-event till din databas och ställ `requireAccess()` att kräva aktiv sub eller saldo

## Auth

- `lib/auth.ts` är mock. Byt till Clerk/NextAuth/Supabase.

## Design

- Tailwind + mörkt tema, kort med glans, TradingView-känsla

## Vidareutveckling

- Lagra analyser i DB + dashboard
- Automatisk prisinhämtning via börs-API (med fallback till användarens pris)
- Internationalisering

## Juridik/ansvar

- Tydlig disclaimer i PDF och UI: ej finansiell rådgivning.
