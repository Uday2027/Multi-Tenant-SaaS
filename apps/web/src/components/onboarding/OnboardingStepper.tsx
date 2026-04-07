'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Building, Users, CheckCircle2 } from 'lucide-react';

export function OnboardingStepper() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Default to step 1
  const currentStep = parseInt(searchParams.get('step') || '1', 10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async (nextStep: number) => {
    setIsSubmitting(true);
    
    // Simulate API save state per step
    await new Promise(resolve => setTimeout(resolve, 600));
    
    setIsSubmitting(false);
    
    if (nextStep > 3) {
      // Finished Onboarding
      router.push('/dashboard');
      router.refresh();
    } else {
      router.push(`/onboarding?step=${nextStep}`);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Stepper Header */}
      <div className="mb-8 flex items-center justify-between">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex flex-col items-center gap-2">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${
                currentStep === step 
                  ? 'border-primary bg-primary text-primary-foreground' 
                  : currentStep > step 
                    ? 'border-primary bg-primary/10 text-primary' 
                    : 'border-muted bg-background text-muted-foreground'
              }`}
            >
              {currentStep > step ? <CheckCircle2 className="w-5 h-5" /> : step}
            </div>
            <span className="text-xs font-medium text-muted-foreground hidden sm:block">
              {step === 1 ? 'Company' : step === 2 ? 'Team' : 'Complete'}
            </span>
          </div>
        ))}
      </div>

      <Card className="shadow-md">
        {currentStep === 1 && (
          <>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Building className="w-6 h-6 text-primary" />
                Setup Workspace
              </CardTitle>
              <CardDescription>
                Let&apos;s start by setting up your organization profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" placeholder="Acme Inc." autoFocus />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subdomain">Subdomain</Label>
                <div className="flex items-center">
                  <Input id="subdomain" placeholder="acme" className="rounded-r-none focus-visible:z-10" />
                  <div className="bg-muted border border-l-0 rounded-r-md px-3 py-2 text-sm text-muted-foreground h-10 flex items-center">
                    .saasapp.com
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => handleNext(2)} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Continue to Team
              </Button>
            </CardFooter>
          </>
        )}

        {currentStep === 2 && (
          <>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                Invite Team
              </CardTitle>
              <CardDescription>
                Collaboration brings the best results. Invite your core team.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inviteEmail1">Email address</Label>
                <Input id="inviteEmail1" type="email" placeholder="colleague@acme.com" autoFocus />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inviteEmail2">Email address (Optional)</Label>
                <Input id="inviteEmail2" type="email" placeholder="developer@acme.com" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push('/onboarding?step=1')} disabled={isSubmitting}>
                Back
              </Button>
              <Button onClick={() => handleNext(3)} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Send Invites
              </Button>
            </CardFooter>
          </>
        )}

        {currentStep === 3 && (
          <>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                You&apos;re all set!
              </CardTitle>
              <CardDescription>
                Your tenant workspace has been initialized successfully.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-8 flex justify-center">
              <div className="p-6 bg-green-500/10 rounded-full">
                <Building className="w-16 h-16 text-green-600" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push('/onboarding?step=2')} disabled={isSubmitting}>
                Back
              </Button>
              <Button onClick={() => handleNext(4)} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Go to Dashboard
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
