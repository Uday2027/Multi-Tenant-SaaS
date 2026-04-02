export * from './src/schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Export an init function or pool to be used by apps.
// For RLS, we'll likely need a custom client wrapper or pass connection dynamically.
export function createDbConnection(connectionString: string) {
  const pool = new Pool({
    connectionString,
  });
  return drizzle(pool);
}
