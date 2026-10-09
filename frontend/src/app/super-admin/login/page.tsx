'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Crown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';

export default function SuperAdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const login = useAuthStore(state => state.login);
  const { addToast } = useToastStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login({ email, password }, '/auth/super-admin/login');
      addToast('Logged in successfully!', 'success');
      router.push('/super-admin');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to login';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-600/20 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 shadow-2xl shadow-purple-900/20">
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Crown className="w-10 h-10 text-purple-500" />
              <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">PropEx</span>
            </Link>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Super Admin Portal</h2>
            <p className="text-purple-700 dark:text-purple-200/60 text-center text-sm">Restricted System Access. Owner / CEO Access Only.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-300 px-4 py-3 rounded-xl mb-6 text-sm text-center font-medium">
            Restricted Access • All Activities are Logged
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400/50" />
                </div>
                <input suppressHydrationWarning
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full pl-11 pr-4 py-3 transition-colors outline-none placeholder-purple-200/30"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Password</label>
                <Link href="/forgot-password" className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-purple-600 dark:text-purple-400/50" />
                </div>
                <input suppressHydrationWarning
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full pl-11 pr-4 py-3 transition-colors outline-none placeholder-purple-200/30"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" id="remember" className="rounded border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950/50 text-purple-500 focus:ring-purple-500 focus:ring-offset-slate-900" />
              <label htmlFor="remember" className="text-sm text-slate-500 dark:text-slate-400">Remember me</label>
            </div>

            <button suppressHydrationWarning
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-500 text-slate-900 dark:text-white rounded-xl px-4 py-3 font-semibold transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
