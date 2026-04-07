import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

// Define the shape of our JWT payload as expected by the frontend
export interface SessionPayload {
  userId: string;
  tenantId: string;
  role: string;
  onboardingComplete: boolean;
  iat: number;
  exp: number;
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get('accessToken')?.value;

  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-for-dev');
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
}

export function extractTenantFromHost(host: string | null): string {
  if (!host) return 'public';
  // Strip port if exists
  const hostname = host.split(':')[0];
  
  // Extract subdomain assuming [tenant].domain.com
  const parts = hostname.split('.');
  if (parts.length >= 3) {
    return parts[0];
  }
  
  return 'public';
}
