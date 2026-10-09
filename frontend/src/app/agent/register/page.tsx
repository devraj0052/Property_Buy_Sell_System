'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Building2, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';

export default function AgentRegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const register = useAuthStore(state => state.register);
  const { addToast } = useToastStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await register({ firstName, lastName, email, password }, '/auth/agent/register');
      addToast('Registered successfully!', 'success');
      router.push('/agent/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to register';
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
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-600/20 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-emerald-500/20 shadow-2xl shadow-emerald-900/20">
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Building2 className="w-10 h-10 text-emerald-500" />
              <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">PropEx</span>
            </Link>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Agent Application</h2>
            <p className="text-emerald-700 dark:text-emerald-200/60 text-center text-sm">Join our platform and manage premium properties</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400/50" />
                  </div>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-11 pr-4 py-3 transition-colors outline-none placeholder-emerald-200/30"
                    placeholder="John"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400/50" />
                  </div>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-11 pr-4 py-3 transition-colors outline-none placeholder-emerald-200/30"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400/50" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-11 pr-4 py-3 transition-colors outline-none placeholder-emerald-200/30"
                  placeholder="agent@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-emerald-600 dark:text-emerald-400/50" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-11 pr-4 py-3 transition-colors outline-none placeholder-emerald-200/30"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-900 dark:text-white rounded-xl px-4 py-3 font-semibold transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Apply as Agent'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an agent account?{' '}
            <Link href="/agent/login" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 font-medium transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
