import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

function make() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  return drizzle(neon(url), { schema });
}

let instance: ReturnType<typeof make> | null = null;

/** Lazy so `next build` doesn't need a database connection. */
export const db = new Proxy({} as ReturnType<typeof make>, {
  get(_t, prop) {
    instance ??= make();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (instance as any)[prop];
  },
});

export * from './schema';
