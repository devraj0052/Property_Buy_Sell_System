'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  LayoutDashboard, Users, Building, Star, MapPin, FileText, MessageSquare,
  Calendar, CreditCard, Bell, BarChart3, Settings, ShieldCheck, ScrollText,
  LogOut, ChevronDown, ChevronRight, Menu, X, UserCheck, Tags, Image,
  HelpCircle, Quote, Flag, Megaphone, Database, Activity
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/super-admin', icon: LayoutDashboard },
  {
    label: 'Users', href: '/super-admin/users', icon: Users,
    children: [
      { label: 'All Users', href: '/super-admin/users' },
      { label: 'Agents', href: '/super-admin/agents' },
    ]
  },
  {
    label: 'Properties', href: '/super-admin/properties', icon: Building,
    children: [
      { label: 'All Properties', href: '/super-admin/properties' },
    ]
  },
  { label: 'Categories', href: '/super-admin/categories', icon: Tags },
  { label: 'Locations', href: '/super-admin/locations', icon: MapPin },
  { label: 'Reviews', href: '/super-admin/reviews', icon: Star },
  { label: 'Blogs', href: '/super-admin/blogs', icon: FileText },
  { label: 'Messages', href: '/super-admin/contact', icon: MessageSquare },
  { label: 'Appointments', href: '/super-admin/appointments', icon: Calendar },
  { label: 'Transactions', href: '/super-admin/transactions', icon: CreditCard },
  { label: 'Notifications', href: '/super-admin/notifications', icon: Bell },
  {
    label: 'Content', href: '/super-admin/content', icon: Quote,
    children: [
      { label: 'FAQs', href: '/super-admin/content?tab=faqs' },
      { label: 'Testimonials', href: '/super-admin/content?tab=testimonials' },
      { label: 'Banners', href: '/super-admin/content?tab=banners' },
    ]
  },
  { label: 'Reports', href: '/super-admin/reports', icon: BarChart3 },
  { label: 'Admin Management', href: '/super-admin/admins', icon: UserCheck },
  { label: 'Role Management', href: '/super-admin/roles', icon: ShieldCheck },
  { label: 'Permission Management', href: '/super-admin/permissions', icon: ShieldCheck },
  { label: 'Audit Logs', href: '/super-admin/logs', icon: ScrollText },
  { label: 'Database Health', href: '/super-admin/database', icon: Database },
  { label: 'System Monitoring', href: '/super-admin/monitoring', icon: Activity },
  { label: 'Settings', href: '/super-admin/settings', icon: Settings },
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && !isLoading && !pathname.includes('/login')) {
      if (!isAuthenticated) {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router, mounted, pathname]);

  const toggleExpand = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    );
  };

  if (pathname.includes('/login')) {
    return <>{children}</>;
  }

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="glass dark:glass-dark rounded-2xl p-8 border border-red-500/30 text-center max-w-md">
          <ShieldCheck className="w-16 h-16 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">You do not have permission to access the super admin panel.</p>
          <Link href="/" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-medium transition-colors">
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
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-purple-500" />
            </div>
            {sidebarOpen && (
              <div>
                <h3 className="text-slate-900 dark:text-white font-bold text-sm">Super Admin</h3>
                <p className="text-slate-500 text-xs">{user?.firstName} {user?.lastName}</p>
              </div>
            )}
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              const isExpanded = expandedItems.includes(item.label);
              const hasChildren = item.children && item.children.length > 0;

              return (
                <div key={item.label}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group
                      ${isActive ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}
                    `}
                    onClick={() => {
                      if (hasChildren) {
                        toggleExpand(item.label);
                      } else {
                        router.push(item.href);
                        setMobileSidebarOpen(false);
                      }
                    }}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {sidebarOpen && (
                      <>
                        <span className="text-sm font-medium flex-1">{item.label}</span>
                        {hasChildren && (
                          isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                        )}
                      </>
                    )}
                  </div>
                  {sidebarOpen && isExpanded && item.children && (
                    <div className="ml-8 mt-1 flex flex-col gap-1">
                      {item.children.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileSidebarOpen(false)}
                          className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                            pathname === child.href ? 'text-purple-600 dark:text-purple-400 bg-purple-500/10' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:bg-slate-800'
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
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
