'use client';

import { motion } from 'framer-motion';
import { Download, BarChart3, TrendingUp, Users } from 'lucide-react';

export default function AdminReportsPage() {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Reports & Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400">Generate and export system reports.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[
          { title: 'User Growth Report', desc: 'Monthly user signups and retention.', icon: Users },
          { title: 'Revenue Analytics', desc: 'Transaction volume and platform fees.', icon: TrendingUp },
          { title: 'Property Insights', desc: 'Most viewed and highest rated properties.', icon: BarChart3 }
        ].map((report, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx}
            className="glass dark:glass-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex flex-col h-full"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary mb-4">
              <report.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{report.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm flex-1 mb-6">{report.desc}</p>
            <button className="w-full py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-medium flex items-center justify-center gap-2 transition-colors">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </motion.div>
        ))}
      </div>

      <div className="glass dark:glass-dark p-8 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex flex-col items-center justify-center min-h-[300px] text-center">
        <BarChart3 className="w-16 h-16 text-slate-600 mb-4" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Interactive Dashboards Coming Soon</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">Detailed graphical representations of your platform's metrics will be available in the next update.</p>
      </div>
    </div>
  );
}
