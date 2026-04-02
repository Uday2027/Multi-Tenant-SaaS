'use client';
import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
      <h2 className="text-3xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md">
        An unexpected error occurred. We've been notified and are looking into it.
      </p>
      <button
        onClick={() => reset()}
        className="rounded-lg bg-black px-6 py-2 text-white dark:bg-white dark:text-black font-medium transition hover:opacity-80"
      >
        Try again
      </button>
    </div>
  );
}
