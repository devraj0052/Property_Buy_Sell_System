'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Building2, CheckCircle, XCircle } from 'lucide-react';
import api from '@/lib/api';

// ... existing code in file ...
import { Suspense } from 'react';
// ...
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4 relative overflow-hidden bg-dark-bg"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
// ... rest of original component logic ...
  const [message, setMessage] = useState('Verifying your email address...');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing verification token.');
      return;
    }

    const verify = async () => {
      try {
        await api.get(`/auth/verify-email?token=${token}`);
        setStatus('success');
        setMessage('Your email has been verified successfully!');
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Failed to verify email. Token may be invalid or expired.');
      }
    };

    verify();
  }, [token]);

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
        <div className="glass dark:glass-dark rounded-3xl p-8 border border-slate-200 dark:border-slate-700/50 shadow-2xl text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <Building2 className="w-10 h-10 text-primary" />
            <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">PropEx</span>
          </Link>

          {status === 'loading' && (
            <div className="py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{message}</h2>
            </div>
          )}

          {status === 'success' && (
            <div className="py-4">
              <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{message}</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">You can now access all features of your account.</p>
              <Link href="/login" className="bg-primary hover:bg-primary-dark text-white rounded-xl px-8 py-3 font-semibold transition-all shadow-lg shadow-primary/25 inline-block">
                Continue to Login
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="py-4">
              <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Verification Failed</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">{message}</p>
              <Link href="/login" className="bg-slate-50 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl px-8 py-3 font-semibold transition-all inline-block">
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
