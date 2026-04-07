import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { OnboardingStepper } from '@/components/onboarding/OnboardingStepper';

export const metadata = {
  title: 'Setup Workspace | SaaS App',
  description: 'Complete your tenant onboarding',
};

export default async function OnboardingPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  // Explicit completion guard - ensures users cannot modify historical configurations via UI
  if (session.onboardingComplete) {
    redirect('/dashboard');
  }

  return <OnboardingStepper />;
}
