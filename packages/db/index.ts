export * from './src/schema.js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Export an init function or pool to be used by apps.
// For RLS, we'll likely need a custom client wrapper or pass connection dynamically.
export function createDbConnection(connectionString: string) {
  const client = postgres(connectionString);
  return drizzle(client);
}
