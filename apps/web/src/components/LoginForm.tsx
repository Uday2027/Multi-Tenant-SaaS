'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      // In production, we extract the tenant subdomain to route the API request correctly
      const tenantPrefix = window.location.host.split('.')[0];
      const apiUrl = process.env.NEXT_PUBLIC_API_URL 
        ? `${process.env.NEXT_PUBLIC_API_URL}/auth/login`
        : `http://${tenantPrefix}.localhost:4000/api/v1/auth/login`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to login');
      }

      // Success: Redirect to dashboard (simulate)
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-md flex-col gap-4">
      {error && <div className="rounded bg-red-100 p-3 text-red-700 text-sm" role="alert">{error}</div>}
      
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input
          {...register('email')}
          id="email"
          type="email"
          className="rounded-md border p-2 shadow-sm focus:border-black focus:ring-1 focus:ring-black dark:text-black"
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && <span className="text-xs text-red-500" role="alert">{errors.email.message}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">Password</label>
        <input
          {...register('password')}
          id="password"
          type="password"
          className="rounded-md border p-2 shadow-sm focus:border-black focus:ring-1 focus:ring-black dark:text-black"
          aria-invalid={errors.password ? 'true' : 'false'}
        />
        {errors.password && <span className="text-xs text-red-500" role="alert">{errors.password.message}</span>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 w-full rounded-md bg-black p-2 font-medium text-white transition hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
      >
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
