import { getSession } from '@/lib/session';

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <header className="h-16 border-b bg-background flex items-center px-6 justify-between">
        <div className="font-bold text-xl flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center">
            S
          </div>
          Multi-Tenant SaaS
        </div>
        <div className="text-sm text-muted-foreground mr-4">
          Logged in as <span className="font-medium text-foreground">{session?.userId || 'User'}</span>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center py-16 px-4 md:px-8">
        {children}
      </main>
    </div>
  );
}
