import { db } from '../../db.js';
import { users } from '@saas/db';
import { eq, and } from 'drizzle-orm';
import { AppError } from '../../shared/custom-error.js';
import { UpdateUserBody } from './user.schema.js';
import { withTenant } from '../../shared/db-ctx.js';

export async function getUserById(id: string, tenantId: string) {
  return await withTenant(tenantId, async (tx) => {
    const [user] = await tx
      .select({
        id: users.id,
        tenantId: users.tenantId,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(and(eq(users.id, id), eq(users.tenantId, tenantId)))
      .limit(1);

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return user;
  });
}

export async function listTenantUsers(tenantId: string) {
  return await withTenant(tenantId, async (tx) => {
    return await tx
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.tenantId, tenantId));
  });
}

export async function updateUser(id: string, tenantId: string, data: UpdateUserBody) {
  return await withTenant(tenantId, async (tx) => {
    const [updatedUser] = await tx
      .update(users)
      .set(data)
      .where(and(eq(users.id, id), eq(users.tenantId, tenantId)))
      .returning({
        id: users.id,
        email: users.email,
        role: users.role,
      });

    if (!updatedUser) {
      throw new AppError(404, 'User not found');
    }

    return updatedUser;
  });
}
