import { FastifyReply, FastifyRequest } from 'fastify';
import { loginSchema, registerSchema } from './auth.schema';
import { loginUser, registerTenant } from './auth.service';
import { AppError } from '../../shared/custom-error';

export async function loginHandler(request: FastifyRequest, reply: FastifyReply) {
  const result = loginSchema.safeParse(request.body);
  if (!result.success) {
    throw new AppError(400, 'Invalid request body');
  }

  if (!request.tenantId) {
     throw new AppError(400, 'Tenant context missing');
  }

  const user = await loginUser(result.data, request.tenantId);

  // Generate tokens
  const payload = { id: user.id, tenantId: user.tenantId, role: user.role };
  const accessToken = await reply.jwtSign(payload, { expiresIn: '15m' });
  const refreshToken = await reply.jwtSign(payload, { expiresIn: '7d' });

  reply.setCookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return { accessToken, user };
}

export async function registerHandler(request: FastifyRequest, reply: FastifyReply) {
  const result = registerSchema.safeParse(request.body);
  if (!result.success) {
    throw new AppError(400, 'Invalid request body');
  }

  const { tenant, user } = await registerTenant(result.data);

  return reply.status(201).send({ tenant, user: { id: user.id, email: user.email } });
}

export async function meHandler(request: FastifyRequest, reply: FastifyReply) {
  return request.user;
}
