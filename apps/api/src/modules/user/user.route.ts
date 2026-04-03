import { FastifyInstance } from 'fastify';
import { getMeHandler, listUsersHandler, updateUserHandler } from './user.controller.js';
import { tenantMiddleware } from '../../mw/tenant.middleware.js';
import { authMiddleware } from '../../mw/auth.middleware.js';
import { requireRole } from '../../mw/rbac.middleware.js';

export async function userRoutes(app: FastifyInstance) {
  // Routes requiring both Auth and Tenant context
  // GET /api/v1/users/me
  app.get('/me', { preHandler: [authMiddleware, tenantMiddleware] }, getMeHandler);
  
  // List all users in a tenant - Admin only
  // GET /api/v1/users
  app.get('/', { preHandler: [authMiddleware, tenantMiddleware, requireRole(['admin'])] }, listUsersHandler);

  // Update a user - Self or Admin
  // PATCH /api/v1/users/:id
  app.patch('/:id', { preHandler: [authMiddleware, tenantMiddleware] }, updateUserHandler);
}
