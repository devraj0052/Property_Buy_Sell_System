'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  LayoutDashboard, Building, Users, Calendar, BarChart3, CreditCard, Star,
  LogOut, Menu, X, ShieldCheck
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/agent/dashboard', icon: LayoutDashboard },
  { label: 'Property Management', href: '/agent/dashboard/properties', icon: Building },
  { label: 'Lead Management', href: '/agent/dashboard/leads', icon: Users },
  { label: 'Appointments', href: '/agent/dashboard/appointments', icon: Calendar },
  { label: 'Analytics', href: '/agent/dashboard/analytics', icon: BarChart3 },
  { label: 'Subscription', href: '/agent/dashboard/subscription', icon: CreditCard },
  { label: 'Reviews', href: '/agent/dashboard/reviews', icon: Star },
];

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router, mounted]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'AGENT') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="glass dark:glass-dark rounded-2xl p-8 border border-red-500/30 text-center max-w-md">
          <ShieldCheck className="w-16 h-16 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">You do not have permission to access the agent portal.</p>
          <Link href="/" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-medium transition-colors inline-block">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pt-16">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        className="fixed top-20 left-4 z-50 md:hidden bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white p-2 rounded-xl"
      >
        {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-700/50 z-40 transition-all duration-300 overflow-y-auto
        ${sidebarOpen ? 'w-64' : 'w-20'}
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
              <Building className="w-5 h-5 text-primary" />
            </div>
            {sidebarOpen && (
              <div>
                <h3 className="text-slate-900 dark:text-white font-bold text-sm">Agent Portal</h3>
                <p className="text-slate-500 text-xs">{user?.firstName} {user?.lastName}</p>
              </div>
            )}
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group
                    ${isActive ? 'bg-primary/20 text-primary' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}
                  `}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium flex-1">{item.label}</span>}
                </Link>
              );
            })}

            <div className="border-t border-slate-200 dark:border-slate-700/50 my-4" />
            <button
              onClick={() => { logout(); router.push('/'); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
            </button>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className={`transition-all duration-300 min-h-[calc(100vh-4rem)] ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'} p-6`}>
        {children}
      </main>

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-white dark:bg-black/50 z-30 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
    </div>
  );
}
