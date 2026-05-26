'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ShieldCheck, LogIn } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] font-technical font-bold uppercase tracking-widest text-primary">
              ParaCompanion
            </p>
            <h1 className="text-xl font-headline font-extrabold text-on-surface">Admin Portal</h1>
          </div>
        </div>

        {sent ? (
          <div className="p-6 rounded-lg bg-brand-green/5 border border-brand-green/20 text-center">
            <ShieldCheck size={32} className="text-brand-green mx-auto mb-3" />
            <p className="font-headline font-bold text-on-surface mb-1">Check your email</p>
            <p className="text-sm text-on-surface-variant">
              A secure sign-in link has been sent to <strong>{email}</strong>
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-technical font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@nhs.net"
                className="w-full px-4 py-3 bg-surface-container-low border-none rounded-md font-medium focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            {error && (
              <p className="text-xs text-emergency font-bold p-3 bg-emergency/5 rounded-md">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-md font-bold font-technical uppercase tracking-wide text-xs hover:bg-primary/90 transition disabled:opacity-50"
            >
              {loading ? 'Sending…' : 'Send Admin Sign-in Link'}
              <LogIn size={16} />
            </button>
            <p className="text-center text-[10px] text-on-surface-variant font-technical uppercase tracking-widest">
              Access restricted to provisioned admin accounts only.
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
