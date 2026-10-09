'use client';

import { motion } from 'framer-motion';
import { Save, Settings } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="w-full max-w-3xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">System Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">Configure platform preferences and defaults.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass dark:glass-dark rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden"
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700/50 bg-slate-100 dark:bg-slate-800/30 flex items-center gap-3">
          <Settings className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">General Information</h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Platform Name</label>
            <input type="text" defaultValue="PropEx" className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Support Email</label>
            <input type="email" defaultValue="support@propex.com" className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors" />
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700/50">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-primary focus:ring-primary focus:ring-offset-slate-900" />
              <div>
                <div className="text-slate-900 dark:text-white font-medium">Enable User Registration</div>
                <div className="text-sm text-slate-500">Allow new users to sign up for accounts.</div>
              </div>
            </label>
          </div>
          
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700/50">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-primary focus:ring-primary focus:ring-offset-slate-900" />
              <div>
                <div className="text-slate-900 dark:text-white font-medium">Maintenance Mode</div>
                <div className="text-sm text-slate-500">Display a maintenance page to non-admin users.</div>
              </div>
            </label>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
