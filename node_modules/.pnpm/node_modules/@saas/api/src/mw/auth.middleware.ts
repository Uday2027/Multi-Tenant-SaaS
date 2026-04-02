import { FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../shared/custom-error';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: string; tenantId: string; role: string };
    user: { id: string; tenantId: string; role: string };
  }
}

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
    // After verify, request.user contains the decoded token
    if (request.tenantId && request.user.tenantId !== request.tenantId) {
       throw new AppError(403, 'Tenant mismatch in token');
    }
  } catch (err) {
    throw new AppError(401, 'Unauthorized');
  }
}
