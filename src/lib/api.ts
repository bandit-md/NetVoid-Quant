import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { organizations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ApiError } from './errors';

export type OrgCtx = { orgId: string; clerkOrgId: string; userId: string };

export async function withOrg(handler: (ctx: OrgCtx, req: Request) => Promise<Response>): Promise<Response> {
  try {
    const { userId, orgId: clerkOrgId } = await auth();
    if (!userId || !clerkOrgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let [org] = await db.select().from(organizations).where(eq(organizations.clerkOrgId, clerkOrgId));
    if (!org) {
      [org] = await db.insert(organizations).values({ clerkOrgId }).returning();
    }

    return await handler({ orgId: org.id, clerkOrgId, userId }, new Request('http://local'));
  } catch (e) {
    if (e instanceof ApiError) return NextResponse.json({ error: e.message }, { status: e.status });
    console.error(e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
