import { FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../shared/custom-error.js';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: string; tenantId: string; role: string };
    user: { id: string; tenantId: string; role: string };
  }
}

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
    // Strict assertion: The request must have been resolved to a tenant matching the JWT
    if (!request.tenantId || request.user.tenantId !== request.tenantId) {
       throw new AppError(403, 'Cross-tenant request forbidden');
    }
  } catch (err: any) {
    if (err instanceof AppError) throw err;
    throw new AppError(401, 'Unauthorized');
  }
}
