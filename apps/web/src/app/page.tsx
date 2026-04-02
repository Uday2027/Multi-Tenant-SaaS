import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
      <h1 className="text-6xl font-bold mb-6">Multi-Tenant SaaS</h1>
      <p className="text-xl mb-12 max-w-2xl text-gray-600 dark:text-gray-300">
        Enterprise-grade, multi-tenant boilerplate featuring Next.js App Router, Fastify, Drizzle ORM, and PostgreSQL Row-Level Security.
      </p>
      
      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="rounded-full bg-black text-white dark:bg-white dark:text-black px-8 py-3 font-semibold transition-transform hover:scale-105"
        >
          Sign In
        </Link>
        <Link 
          href="/register" 
          className="rounded-full border-2 border-black dark:border-white px-8 py-3 font-semibold transition-transform hover:scale-105"
        >
          Create Workspace
        </Link>
      </div>
    </main>
  );
}
