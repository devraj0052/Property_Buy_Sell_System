'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Building2, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4 relative overflow-hidden bg-dark-bg">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass dark:glass-dark rounded-3xl p-8 border border-slate-200 dark:border-slate-700/50 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Building2 className="w-10 h-10 text-primary" />
              <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">PropEx</span>
            </Link>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Reset Password</h2>
            <p className="text-slate-500 dark:text-slate-400 text-center">Enter your email and we'll send you a reset link.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Check your email</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">If an account exists for {email}, we have sent a password reset link.</p>
              <Link href="/login" className="text-primary hover:text-primary-dark font-medium inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-primary block w-full pl-11 pr-4 py-3 transition-colors outline-none"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl px-4 py-3 font-semibold transition-all shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          {!success && (
            <div className="mt-8 text-center text-sm">
              <Link href="/login" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-2 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to login
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
