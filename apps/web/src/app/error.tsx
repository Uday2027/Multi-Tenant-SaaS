'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error('Unhandled runtime error captured in boundary:', error);
  }, [error]);

  return (
    <div className="flex h-screen w-full items-center justify-center p-4 bg-background">
      <div className="flex w-full max-w-md flex-col items-center justify-center space-y-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Something went wrong</h2>
          <p className="text-muted-foreground">
            We encountered an unexpected error while processing your request. 
            Our team has been notified.
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => window.location.href = '/' } variant="outline">
            Go Home
          </Button>
          <Button onClick={() => reset()}>
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
