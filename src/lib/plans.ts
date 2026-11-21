export type PlanId = 'free' | 'starter' | 'pro' | 'team';
export type Interval = 'monthly' | 'annual';
export type Limits = { tokens: number; wallets: number; communitySources: number; crmContacts: number };

/** -1 means unlimited. Display prices are informational; real prices live in Stripe. */
export const PLANS: Record<PlanId, { name: string; limits: Limits; monthly: number; annual: number }> = {
  free: { name: 'Free', monthly: 0, annual: 0, limits: { tokens: 1, wallets: 1, communitySources: 1, crmContacts: 25 } },
  starter: { name: 'Starter', monthly: 99, annual: 990, limits: { tokens: 3, wallets: 5, communitySources: 2, crmContacts: 100 } },
  pro: { name: 'Pro', monthly: 299, annual: 2990, limits: { tokens: 10, wallets: 25, communitySources: 6, crmContacts: 1000 } },
  team: { name: 'Team', monthly: 799, annual: 7990, limits: { tokens: 25, wallets: 100, communitySources: 20, crmContacts: -1 } },
};

export const PAID_PLANS = ['starter', 'pro', 'team'] as const;
export type PaidPlan = (typeof PAID_PLANS)[number];

export function priceIdFor(plan: PaidPlan, interval: Interval): string | undefined {
  return process.env[`STRIPE_PRICE_${plan.toUpperCase()}_${interval.toUpperCase()}`] || undefined;
}

export function planFromPriceId(priceId: string): { plan: PlanId; interval: Interval | null } {
  for (const plan of PAID_PLANS) {
    for (const interval of ['monthly', 'annual'] as const) {
      if (priceIdFor(plan, interval) === priceId) return { plan, interval };
    }
  }
  return { plan: 'free', interval: null };
}
