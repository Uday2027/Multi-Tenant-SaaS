import { createDbConnection } from '@saas/db';

const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/saas';

export const db = createDbConnection(databaseUrl);
