'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Plus, Edit } from 'lucide-react';

export default function AdminRolesPage() {
  const roles = [
    { name: 'ADMIN', users: 3, description: 'Full access to all system features.' },
    { name: 'AGENT', users: 24, description: 'Can manage own properties and view appointments.' },
    { name: 'USER', users: 156, description: 'Can view properties, save favorites, and contact agents.' }
  ];

  return (
    <div className="w-full max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Roles & Permissions</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage user roles and access levels.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl font-medium transition-colors">
          <Plus className="w-5 h-5" />
          Create Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={role.name}
            className="glass dark:glass-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{role.name}</h3>
            <p className="text-sm text-primary font-medium mb-3">{role.users} Users</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm flex-1">{role.description}</p>
            
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700/50 text-sm font-medium text-slate-600 dark:text-slate-300">
              <button className="w-full py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                View Permissions
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
