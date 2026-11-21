# NetVoid Quant

B2B SaaS for web3 projects: quantitative dashboard, token & treasury intelligence, community metrics, a basic investor/partner CRM, and Stripe billing.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind · Clerk Organizations · Neon Postgres + Drizzle · Inngest (scheduled ingestion) · Alchemy · CoinGecko · Stripe · Sentry.

## How it works

```
Browser ─► Next.js on Vercel ─► Postgres (Neon)  ◄── Inngest cron jobs ◄── Alchemy / CoinGecko / Discord / Telegram
              │  ▲                                    (market 15m · treasury 1h · community 6h)
              │  └── Stripe webhooks (/api/stripe/webhook) ─► subscriptions table ─► plan gating
              └── Clerk (auth + organizations)
```

Ingest → store → serve: pages and API routes only read Postgres, never external providers, so the UI stays fast and provider rate limits are protected. Every table carries `org_id` and every query is scoped by it (`withOrg` in `src/lib/api.ts` supplies `ctx.orgId`).

## Setup

1. `npm install`
2. `cp .env.example .env.local` and fill it in.
3. **Clerk:** create an app, enable **Organizations**, copy the keys.
4. **Neon:** create a project, put the pooled connection string in `DATABASE_URL`, then `npm run db:push`.
5. **Stripe:** `npm run stripe:setup` creates the 3 products and 6 prices and prints the `STRIPE_PRICE_*` lines. Enable the Customer Portal in the Stripe dashboard. Locally run `stripe listen --forward-to localhost:3000/api/stripe/webhook` and put the printed secret in `STRIPE_WEBHOOK_SECRET`.
6. **Inngest (local):** `npm run inngest:dev` in a second terminal, then `npm run dev`. Cron functions appear in the Inngest dev UI and can be triggered manually.
7. Add `ALCHEMY_API_KEY`, `COINGECKO_API_KEY` (demo keys work; set `COINGECKO_PLAN=pro` for a pro key), and optionally `DISCORD_BOT_TOKEN` / `TELEGRAM_BOT_TOKEN`.

### Deploy
- Vercel for the app; set all env vars. Register `https://<your-domain>/api/inngest` in Inngest Cloud (set `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY`).
- Stripe webhook endpoint: `https://<your-domain>/api/stripe/webhook` with events `checkout.session.completed`, `customer.subscription.created|updated|deleted`, `invoice.payment_failed`.

## Plans and limits
Defined in `src/lib/plans.ts` (Free, Starter, Pro, Team). Limits (tokens, wallets, community sources, CRM contacts) are enforced in the API via `assertCanAdd`. Usage is counted from the tables and logged to `usage_events`. Access comes from the `subscriptions` table (`active`, `trialing`, `past_due` keep the paid plan). New orgs get a 14-day trial on first checkout. Update the prices in `scripts/stripe-setup.ts` before running it if you want different amounts.

## API
| Area | Endpoints |
|---|---|
| Dashboard | `GET /api/dashboard/overview`, `GET /api/metrics` |
| Tokens | `GET/POST /api/tokens`, `DELETE /api/tokens/:id`, `GET /api/tokens/search` |
| Treasury | `GET/POST /api/wallets`, `DELETE /api/wallets/:id`, `GET /api/treasury/summary`, `GET /api/treasury/history`, `POST /api/treasury/refresh`, `PATCH /api/org/settings` |
| Community | `GET/POST /api/community/sources`, `DELETE /api/community/sources/:id`, `GET /api/community/metrics` |
| CRM | `GET/POST /api/crm/contacts`, `PATCH/DELETE /api/crm/contacts/:id`, `GET/POST /api/crm/deals`, `PATCH/DELETE /api/crm/deals/:id` |
| Billing | `POST /api/billing/checkout`, `POST /api/billing/portal`, `GET /api/billing/status`, `POST /api/stripe/webhook` |
| Jobs | `/api/inngest` |

## Scope notes (v1)
- EVM chains only (Ethereum, Base, Arbitrum, Optimism, Polygon). Solana is the first v1.1 item.
- Treasury wallets are user-supplied. Only tokens CoinGecko can price (and worth at least $1) are counted, which also filters airdrop spam.
- "Holder concentration" for arbitrary ERC-20s needs an indexer and is not in v1. Instead the app tracks your own token's **share of total supply held in your treasury wallets**.
- Community: Discord (total + online members) and Telegram (total members) via bots. Message-level activity needs a gateway bot and is deferred. X/Twitter is deferred.
- Seats are managed by Clerk; plan limits do not cap seat count.
