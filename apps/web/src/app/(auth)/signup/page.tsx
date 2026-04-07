import { Metadata } from 'next';
import { SignupForm } from '@/components/auth/SignupForm';

export const metadata: Metadata = {
  title: 'Sign Up | SaaS App',
  description: 'Create a new account',
};

export default function SignupPage() {
  return <SignupForm />;
}
