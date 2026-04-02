import { FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../shared/custom-error';
import { db } from '../db'; // Need to create a db instance export
import { tenants } from '@saas/db';
import { eq } from 'drizzle-orm';

declare module 'fastify' {
  interface FastifyRequest {
    tenantId?: string;
  }
}

export async function tenantMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const host = request.headers.host || '';
  const subdomain = host.split('.')[0];

  if (!subdomain || subdomain === 'www' || subdomain === 'api') {
    throw new AppError(400, 'Tenant subdomain is required');
  }

  // Look up tenant by domain
  const [tenant] = await db.select().from(tenants).where(eq(tenants.domain, subdomain)).limit(1);

  if (!tenant) {
    throw new AppError(404, 'Tenant not found');
  }

  request.tenantId = tenant.id;
}
