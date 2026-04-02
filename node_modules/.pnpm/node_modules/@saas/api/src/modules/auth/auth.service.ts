import bcrypt from 'bcryptjs';
import { db } from '../../db';
import { users, tenants } from '@saas/db';
import { eq } from 'drizzle-orm';
import { AppError } from '../../shared/custom-error';
import { LoginBody, RegisterBody } from './auth.schema';

export async function loginUser(body: LoginBody, tenantId: string) {
  // Query within the specific tenant's context is implicitly 
  // safer, but since login may not have context set via RLS,
  // we do the explicit tenant check. Or we use withTenant
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, body.email))
    .limit(1);

  if (!user || user.tenantId !== tenantId) {
    throw new AppError(401, 'Invalid credentials');
  }

  const isValid = await bcrypt.compare(body.password, user.passwordHash);
  if (!isValid) {
    throw new AppError(401, 'Invalid credentials');
  }

  return {
    id: user.id,
    email: user.email,
    tenantId: user.tenantId,
    role: user.role
  };
}

export async function registerTenant(body: RegisterBody) {
  const existingTenant = await db
    .select()
    .from(tenants)
    .where(eq(tenants.domain, body.subdomain))
    .limit(1);

  if (existingTenant.length > 0) {
    throw new AppError(400, 'Subdomain already exists');
  }

  const passHash = await bcrypt.hash(body.password, 12);

  // Wrap in global transaction (outside of RLS isolation for the global tenant insert)
  return await db.transaction(async (tx) => {
    const [newTenant] = await tx
      .insert(tenants)
      .values({ name: body.tenantName, domain: body.subdomain })
      .returning();

    const [newUser] = await tx
      .insert(users)
      .values({
        tenantId: newTenant.id,
        email: body.email,
        passwordHash: passHash,
        role: 'admin'
      })
      .returning();

    return { tenant: newTenant, user: newUser };
  });
}
