'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, X, Search, Shield, User, Clock, CheckCircle, XCircle 
} from 'lucide-react';
import api from '@/lib/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data.users || []);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/admin/users/${id}/status`, { status });
      fetchUsers();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage platform users, agents, and their statuses.</p>
        </div>
      </div>

      <div className="glass dark:glass-dark rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 text-sm">
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300 text-sm">
              {users.map((user, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={user.id} 
                  className="border-b border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-lg text-slate-900 dark:text-white font-medium uppercase">
                      {user.firstName?.[0] || user.email?.[0] || 'U'}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">{user.firstName} {user.lastName}</div>
                      <div className="text-slate-500 text-xs">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {user.role === 'ADMIN' ? <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" /> : <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                      <span>{user.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 w-max
                      ${user.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 
                        user.status === 'SUSPENDED' ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 
                        'bg-slate-500/10 text-slate-500 dark:text-slate-400'}
                    `}>
                      {user.status === 'ACTIVE' && <CheckCircle className="w-3.5 h-3.5" />}
                      {user.status === 'SUSPENDED' && <XCircle className="w-3.5 h-3.5" />}
                      {user.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {user.status !== 'ACTIVE' && (
                        <button 
                          onClick={() => handleUpdateStatus(user.id, 'ACTIVE')}
                          className="p-2 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg transition-colors"
                          title="Activate"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {user.status !== 'SUSPENDED' && (
                        <button 
                          onClick={() => handleUpdateStatus(user.id, 'SUSPENDED')}
                          className="p-2 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                          title="Suspend"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
