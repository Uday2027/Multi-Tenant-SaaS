import { FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../shared/custom-error.js';

type Role = 'admin' | 'member' | 'viewer';

export function requireRole(allowedRoles: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // We assume authMiddleware already ran, populating request.user
    if (!request.user || !request.user.role) {
      throw new AppError(401, 'Unauthorized: Missing user context');
    }

    if (!allowedRoles.includes(request.user.role as Role)) {
      throw new AppError(403, 'Forbidden: Insufficient permissions');
    }
  };
}
