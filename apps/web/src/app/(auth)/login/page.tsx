import type { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In - Multi-Tenant SaaS',
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md rounded-xl bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 p-8 shadow-sm">
        <h1 className="mb-6 text-center text-3xl font-bold">Welcome Back</h1>
        <LoginForm />
      </div>
    </main>
  );
}
