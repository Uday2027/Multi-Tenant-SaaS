import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getSession, extractTenantFromHost } from '@/lib/session';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Fetch current session & active tenant
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  // 2. Fetch origin request URL Host
  const headersList = await headers();
  const host = headersList.get('host');
  const resolvedTenantId = extractTenantFromHost(host);
  
  // 3. Multi-Tenant Vault Guard
  // Assert the session token's bound tenantId matches the domain being requested.
  // In a local development environment resolving to 'localhost', 'public' might be the fallback 
  // Let's ensure the user is not crossing tenant boundaries.
  if (session.tenantId !== resolvedTenantId && resolvedTenantId !== 'public' && resolvedTenantId !== 'localhost') {
     console.warn(`[Tenant Violation Attempt] User ${session.userId} attempted cross-tenant access to ${resolvedTenantId}`);
     redirect('/login?error=wrong_tenant');
  }
  
  // 4. Onboarding Guard
  if (!session.onboardingComplete && resolvedTenantId !== 'public') {
    // Note: We bypass this check if they are still on public / index setup
    redirect('/onboarding');
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header user={session} />
        <main className="flex-1 p-6 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
