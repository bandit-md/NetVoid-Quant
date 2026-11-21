import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { PAID_PLANS, PLANS } from '@/lib/plans';

export default async function Landing() {
  const { userId } = await auth();
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <nav className="mb-24 flex items-center justify-between">
        <span className="text-lg font-semibold tracking-tight">
          NetVoid<span className="text-accent"> Quant</span>
        </span>
        <div className="flex gap-3">
          {userId ? (
            <Link href="/app" className="btn btn-primary">Open dashboard</Link>
          ) : (
            <>
              <Link href="/sign-in" className="btn">Sign in</Link>
              <Link href="/sign-up" className="btn btn-primary">Start free</Link>
            </>
          )}
        </div>
      </nav>

      <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight">
        Quantitative intelligence for <span className="text-accent">web3 teams</span>.
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">
        Track token and market metrics, treasury runway, community growth and investor relationships in one dark, data-dense workspace.
      </p>

      <div className="mt-16 grid gap-4 md:grid-cols-2">
        {[
          ['Quant dashboard', 'Price, market cap and volume across your tracked tokens, with history from day one.'],
          ['Token & treasury intelligence', 'Multi-chain balances, stablecoin share, runway and your token’s supply held in treasury.'],
          ['Community metrics', 'Discord and Telegram membership, activity and net growth, snapshotted automatically.'],
          ['Investor & partner CRM', 'Contacts and a deal pipeline that lives next to the numbers.'],
        ].map(([t, d]) => (
          <div key={t} className="card card-pad">
            <div className="font-medium">{t}</div>
            <p className="mt-1 text-sm text-muted">{d}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-4 mt-20 text-2xl font-semibold">Pricing</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {PAID_PLANS.map((p) => (
          <div key={p} className="card card-pad">
            <div className="label">{PLANS[p].name}</div>
            <div className="num mt-2 text-3xl">${PLANS[p].monthly}<span className="text-sm text-muted">/mo</span></div>
            <div className="mt-1 text-xs text-muted">or ${PLANS[p].annual}/yr</div>
          </div>
        ))}
      </div>
    </main>
  );
}
