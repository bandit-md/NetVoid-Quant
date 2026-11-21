import {
  bigserial,
  boolean,
  date,
  doublePrecision,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

const tstz = (name: string) => timestamp(name, { withTimezone: true });

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkOrgId: text('clerk_org_id').notNull().unique(),
  stripeCustomerId: text('stripe_customer_id').unique(),
  monthlyBurnUsd: doublePrecision('monthly_burn_usd').notNull().default(0),
  createdAt: tstz('created_at').notNull().defaultNow(),
});

export const subscriptions = pgTable(
  'subscriptions',
  {
    id: text('id').primaryKey(), // Stripe subscription id
    orgId: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    status: text('status').notNull(),
    priceId: text('price_id').notNull(),
    plan: text('plan').notNull(),
    interval: text('interval'),
    currentPeriodEnd: tstz('current_period_end'),
    cancelAtPeriodEnd: boolean('cancel_at_period_end').notNull().default(false),
    trialEnd: tstz('trial_end'),
    updatedAt: tstz('updated_at').notNull().defaultNow(),
  },
  (t) => [index('subscriptions_org_idx').on(t.orgId)],
);

export const usageEvents = pgTable(
  'usage_events',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    orgId: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    qty: integer('qty').notNull().default(1),
    ts: tstz('ts').notNull().defaultNow(),
  },
  (t) => [index('usage_events_org_ts_idx').on(t.orgId, t.ts)],
);

export const tokens = pgTable(
  'tokens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    coingeckoId: text('coingecko_id').notNull(),
    symbol: text('symbol').notNull(),
    name: text('name').notNull(),
    chain: text('chain'),
    address: text('address'),
    isOwn: boolean('is_own').notNull().default(false),
    createdAt: tstz('created_at').notNull().defaultNow(),
  },
  (t) => [uniqueIndex('tokens_org_cg_uq').on(t.orgId, t.coingeckoId)],
);

export const wallets = pgTable(
  'wallets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    chain: text('chain').notNull(),
    address: text('address').notNull(),
    label: text('label').notNull(),
    createdAt: tstz('created_at').notNull().defaultNow(),
  },
  (t) => [uniqueIndex('wallets_org_chain_addr_uq').on(t.orgId, t.chain, t.address)],
);

/** Narrow time-series table: price, market_cap, volume_24h, change_24h_pct, treasury_usd, treasury_pct_supply */
export const metricsTimeseries = pgTable(
  'metrics_timeseries',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    entityType: text('entity_type').notNull(), // 'token' | 'org'
    entityId: uuid('entity_id').notNull(),
    metric: text('metric').notNull(),
    value: doublePrecision('value').notNull(),
    ts: tstz('ts').notNull(),
  },
  (t) => [uniqueIndex('metrics_entity_metric_ts_uq').on(t.entityId, t.metric, t.ts)],
);

export const treasurySnapshots = pgTable(
  'treasury_snapshots',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    orgId: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    totalUsd: doublePrecision('total_usd').notNull(),
    stableUsd: doublePrecision('stable_usd').notNull(),
    tokenUsd: doublePrecision('token_usd').notNull(),
    ts: tstz('ts').notNull().defaultNow(),
  },
  (t) => [index('treasury_snapshots_org_ts_idx').on(t.orgId, t.ts)],
);

export const communitySources = pgTable(
  'community_sources',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    type: text('type').notNull(), // 'discord' | 'telegram'
    externalId: text('external_id').notNull(),
    name: text('name').notNull(),
    createdAt: tstz('created_at').notNull().defaultNow(),
  },
  (t) => [uniqueIndex('community_sources_org_type_ext_uq').on(t.orgId, t.type, t.externalId)],
);

export const communityMetrics = pgTable(
  'community_metrics',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    sourceId: uuid('source_id').notNull().references(() => communitySources.id, { onDelete: 'cascade' }),
    members: integer('members').notNull(),
    online: integer('online'),
    ts: tstz('ts').notNull().defaultNow(),
  },
  (t) => [index('community_metrics_source_ts_idx').on(t.sourceId, t.ts)],
);

export const crmContacts = pgTable(
  'crm_contacts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    email: text('email'),
    company: text('company'),
    role: text('role'),
    notes: text('notes'),
    createdAt: tstz('created_at').notNull().defaultNow(),
  },
  (t) => [index('crm_contacts_org_idx').on(t.orgId)],
);

export const crmDeals = pgTable(
  'crm_deals',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    contactId: uuid('contact_id').references(() => crmContacts.id, { onDelete: 'set null' }),
    name: text('name').notNull(),
    stage: text('stage').notNull().default('lead'),
    valueUsd: doublePrecision('value_usd'),
    notes: text('notes'),
    createdAt: tstz('created_at').notNull().defaultNow(),
  },
  (t) => [index('crm_deals_org_idx').on(t.orgId)],
);
