import LoginForm from '@/components/login-form';

export const metadata = {
  title: 'Admin Login — Shipnix Express Shipment',
  description: 'Restricted access. Admin login portal.',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return <LoginForm adminMode />;
}
