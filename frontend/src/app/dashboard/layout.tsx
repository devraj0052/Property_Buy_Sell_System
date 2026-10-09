'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { LayoutDashboard, Heart, Building, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router, mounted]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'USER') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="glass dark:glass-dark rounded-2xl p-8 border border-red-500/30 text-center max-w-md">
          <div className="w-16 h-16 text-red-600 dark:text-red-400 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-500/10">
            <Settings className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">You do not have permission to access the customer dashboard.</p>
          <Link href="/" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-medium transition-colors inline-block">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg pt-24 pb-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-64 shrink-0"
        >
          <div className="glass dark:glass-dark rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 sticky top-28">
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 border-2 border-primary mb-4 flex items-center justify-center text-3xl font-bold text-slate-900 dark:text-white uppercase">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user?.firstName} {user?.lastName}</h3>
              <span className="text-xs text-primary font-semibold uppercase tracking-wider bg-primary/10 px-2 py-1 rounded-full mt-2">
                {user?.role}
              </span>
            </div>

            <nav className="flex flex-col gap-2">
              <Link href="/dashboard/favorites" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800 hover:text-slate-900 dark:hover:text-white rounded-xl font-medium transition-colors">
                <Heart className="w-5 h-5" /> Favorites
              </Link>
              <Link href="/dashboard/appointments" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800 hover:text-slate-900 dark:hover:text-white rounded-xl font-medium transition-colors">
                <Building className="w-5 h-5" /> Appointments
              </Link>
              <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800 hover:text-slate-900 dark:hover:text-white rounded-xl font-medium transition-colors">
                <LayoutDashboard className="w-5 h-5" /> Profile
              </Link>
              <Link href="/dashboard/payments" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800 hover:text-slate-900 dark:hover:text-white rounded-xl font-medium transition-colors">
                <Settings className="w-5 h-5" /> Payments
              </Link>
              <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-xl font-medium transition-colors text-left w-full mt-4 border-t border-slate-200 dark:border-slate-700/50 pt-6">
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </nav>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
