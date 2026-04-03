import { z } from 'zod';

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  role: z.enum(['admin', 'member', 'viewer']).optional(),
});

export const userIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export type UpdateUserBody = z.infer<typeof updateUserSchema>;
export type UserIdParams = z.infer<typeof userIdParamsSchema>;
