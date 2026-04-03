import { FastifyReply, FastifyRequest } from 'fastify';
import { userIdParamsSchema, updateUserSchema } from './user.schema.js';
import { getUserById, listTenantUsers, updateUser } from './user.service.js';
import { AppError } from '../../shared/custom-error.js';

export async function getMeHandler(request: FastifyRequest, reply: FastifyReply) {
  if (!request.user || !request.user.id || !request.tenantId) {
    throw new AppError(401, 'Unauthorized');
  }

  const user = await getUserById(request.user.id, request.tenantId);
  return user;
}

export async function listUsersHandler(request: FastifyRequest, reply: FastifyReply) {
  if (!request.tenantId) {
    throw new AppError(400, 'Tenant context missing');
  }

  const usersList = await listTenantUsers(request.tenantId);
  return { users: usersList };
}

export async function updateUserHandler(request: FastifyRequest, reply: FastifyReply) {
  const paramsResult = userIdParamsSchema.safeParse(request.params);
  if (!paramsResult.success) {
    throw new AppError(400, 'Invalid user ID');
  }

  const bodyResult = updateUserSchema.safeParse(request.body);
  if (!bodyResult.success) {
    throw new AppError(400, 'Invalid request body');
  }

  if (!request.tenantId) {
    throw new AppError(400, 'Tenant context missing');
  }

  // Security Logic: Only admin can change roles or update others.
  // Standard members/viewers can only update themselves (and not their role).
  const isTargetSelf = request.user.id === paramsResult.data.id;
  const isAdmin = request.user.role === 'admin';

  if (!isAdmin && !isTargetSelf) {
    throw new AppError(403, 'Forbidden: Cannot update other users');
  }

  // Prevent non-admins from promoting themselves
  if (!isAdmin && bodyResult.data.role) {
    throw new AppError(403, 'Forbidden: Only admins can modify roles');
  }

  const updatedUser = await updateUser(paramsResult.data.id, request.tenantId, bodyResult.data);
  return updatedUser;
}
