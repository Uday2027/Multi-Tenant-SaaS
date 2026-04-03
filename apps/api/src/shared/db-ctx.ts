import { sql } from 'drizzle-orm';
import { db } from '../db.js';
import { ExtractTablesWithRelations } from 'drizzle-orm';
import { PgTransaction } from 'drizzle-orm/pg-core';

type Tx = PgTransaction<any, any, any>;

export async function withTenant<T>(
  tenantId: string,
  callback: (tx: Tx) => Promise<T>
): Promise<T> {
  if (!tenantId) {
    throw new Error('FATAL: withTenant called without a tenantId. Aborting to prevent silent RLS failure.');
  }

  return await db.transaction(async (tx) => {
    await tx.execute(sql`SET LOCAL app.current_tenant = ${tenantId}`);
    return await callback(tx);
  });
}
