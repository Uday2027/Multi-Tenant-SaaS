import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In | SaaS App',
  description: 'Sign into your account',
};

export default function LoginPage() {
  return <LoginForm />;
}
