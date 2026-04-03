import { FastifyInstance } from 'fastify';
import { loginHandler, registerHandler, meHandler } from './auth.controller.js';
import { tenantMiddleware } from '../../mw/tenant.middleware.js';
import { authMiddleware } from '../../mw/auth.middleware.js';

export async function authRoutes(app: FastifyInstance) {
  // Routes without auth logic but WITH tenant resolution (e.g. login)
  app.post('/login', { preHandler: [tenantMiddleware] }, loginHandler);

  // Global register (for new tenants, might not need specific tenant resolution preHandler)
  app.post('/register', registerHandler);

  // Routes requiring JWT Auth AND Tenant Context
  app.get('/me', { preHandler: [tenantMiddleware, authMiddleware] }, meHandler);
}
