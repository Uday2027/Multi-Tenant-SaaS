import { sql } from 'drizzle-orm';
import { db } from '../db.js';

type DbTx = Parameters<Parameters<typeof db.transaction>[0]>[0];

export async function withTenant<T>(
  tenantId: string,
  callback: (tx: DbTx) => Promise<T>
): Promise<T> {
  if (!tenantId) {
    throw new Error('FATAL: withTenant called without a tenantId. Aborting to prevent silent RLS failure.');
  }

  return await db.transaction(async (tx) => {
    await tx.execute(sql`SET LOCAL app.current_tenant = ${tenantId}`);
    return await callback(tx);
  });
}
