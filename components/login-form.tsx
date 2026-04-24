'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, LogIn, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  adminMode?: boolean;
}

export default function LoginForm({ adminMode = false }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
    } else {
      router.push('/admin');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-700 to-cyan-600">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-400/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-float-slow" />
      </div>

      <Card className="w-full max-w-md relative bg-white/95 dark:bg-gray-900/95 backdrop-blur border-0 shadow-2xl rounded-3xl animate-fade-in-up">
        <CardHeader className="text-center pb-4">
          <Link href="/" className="mx-auto mb-4 group">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all">
              <Rocket className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
          </Link>
          {adminMode && (
            <div className="inline-flex items-center gap-1.5 mx-auto bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-medium mb-2 w-fit">
              <ShieldCheck className="w-3 h-3" /> Admin Portal
            </div>
          )}
          <CardTitle className="text-2xl font-extrabold tracking-tight">
            {adminMode ? 'Admin Sign In' : 'Welcome back'}
          </CardTitle>
          <CardDescription>
            {adminMode
              ? 'Restricted access. Authorized personnel only.'
              : 'Sign in to manage your shipments and dashboard.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="rounded-xl h-11"
                required
                data-testid="input-email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl h-11"
                required
                data-testid="input-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-6 font-semibold shadow-lg shadow-indigo-500/30 hover:scale-[1.01] transition-all"
              disabled={loading}
              data-testid="button-submit"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>
          {!adminMode && (
            <p className="text-center text-sm text-muted-foreground mt-5">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline">
                Register
              </Link>
            </p>
          )}
          <p className="text-center text-xs text-muted-foreground mt-4">
            <Link href="/" className="hover:text-indigo-600 transition-colors">← Back to homepage</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
