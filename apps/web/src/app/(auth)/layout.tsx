export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4 md:p-8">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center justify-center space-y-2 text-center">
          <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
            {/* Minimal default logo placeholder */}
            <span className="text-primary-foreground font-bold text-xl">S</span>
          </div>
          <h1 className="text-2xl font-bold">Multi-Tenant SaaS</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
