import { FastifyInstance } from 'fastify';
import { getMeHandler, listUsersHandler, updateUserHandler } from './user.controller.js';
import { tenantMiddleware } from '../../mw/tenant.middleware.js';
import { authMiddleware } from '../../mw/auth.middleware.js';
import { requireRole } from '../../mw/rbac.middleware.js';

export async function userRoutes(app: FastifyInstance) {
  // tenantMiddleware MUST run before authMiddleware — it sets request.tenantId
  // which authMiddleware validates against the JWT payload.

  // GET /api/v1/users/me
  app.get('/me', { preHandler: [tenantMiddleware, authMiddleware] }, getMeHandler);

  // List all users in a tenant - Admin only
  // GET /api/v1/users
  app.get('/', { preHandler: [tenantMiddleware, authMiddleware, requireRole(['admin'])] }, listUsersHandler);

  // Update a user - Self or Admin
  // PATCH /api/v1/users/:id
  app.patch('/:id', { preHandler: [tenantMiddleware, authMiddleware] }, updateUserHandler);
}
