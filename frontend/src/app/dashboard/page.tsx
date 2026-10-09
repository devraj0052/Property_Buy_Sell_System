'use client';

import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Heart, Building, LayoutDashboard } from 'lucide-react';

export default function DashboardOverviewPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8">
      <div className="glass dark:glass-dark rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome back, {user?.firstName}!</h2>
        <p className="text-slate-500 dark:text-slate-400">Here is an overview of your account activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass dark:glass-dark rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
            <Heart className="w-6 h-6" />
          </div>
          <h4 className="text-slate-500 dark:text-slate-400 font-medium mb-1">Saved Properties</h4>
          <span className="text-3xl font-bold text-slate-900 dark:text-white">0</span>
        </div>
        
        <div className="glass dark:glass-dark rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary mb-4">
            <Building className="w-6 h-6" />
          </div>
          <h4 className="text-slate-500 dark:text-slate-400 font-medium mb-1">My Listings</h4>
          <span className="text-3xl font-bold text-slate-900 dark:text-white">0</span>
        </div>

        <div className="glass dark:glass-dark rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <h4 className="text-slate-500 dark:text-slate-400 font-medium mb-1">Total Visits</h4>
          <span className="text-3xl font-bold text-slate-900 dark:text-white">0</span>
        </div>
      </div>
    </div>
  );
}
