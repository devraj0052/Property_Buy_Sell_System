'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Building, DollarSign, Activity, Flag 
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: '0',
    totalProperties: '0',
    totalRevenue: '$0',
    platformVisits: '0'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats({
          totalUsers: res.data.data.totalUsers?.toString() || '0',
          totalProperties: res.data.data.totalProperties?.toString() || '0',
          totalRevenue: '$' + (res.data.data.totalRevenue || 0).toLocaleString(),
          platformVisits: '1.2M' // Placeholder until analytics API implemented
        });
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">System Overview</h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome to the PropEx Admin Panel.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin/reports" className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2 hover:bg-slate-700 transition-colors">
            Generate Report
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Active Properties', value: stats.totalProperties, icon: Building, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Total Revenue', value: stats.totalRevenue, icon: DollarSign, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Platform Visits', value: stats.platformVisits, icon: Activity, color: 'text-orange-400', bg: 'bg-orange-500/10' },
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass dark:glass-dark rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 flex flex-col relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <h4 className="text-slate-500 dark:text-slate-400 font-medium mb-1">{stat.label}</h4>
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity Table (Placeholder for Phase 3) */}
      <div className="glass dark:glass-dark rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700/50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activities</h2>
          <Link href="/admin/logs" className="text-primary hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 text-sm">
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300 text-sm">
              {[1, 2, 3].map((row) => (
                <tr key={row} className="border-b border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">U{row}</div>
                    <span>System User {row}</span>
                  </td>
                  <td className="px-6 py-4">System Initialized</td>
                  <td className="px-6 py-4 text-slate-500">Just now</td>
                  <td className="px-6 py-4">
                    <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-lg text-xs font-semibold">Success</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
