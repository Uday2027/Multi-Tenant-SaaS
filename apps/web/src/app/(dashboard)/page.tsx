import { getSession } from '@/lib/session';

export default async function DashboardPage() {
  const session = await getSession();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back to your workspace. Here&apos;s an overview of your organization.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Placeholder cards for MVP */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">Metric {i}</span>
              <span className="text-2xl font-bold">12,34{i}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
