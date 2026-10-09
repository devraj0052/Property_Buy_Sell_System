'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Search, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dummy data for now
    setAgents([
      { id: '1', firstName: 'Alice', lastName: 'Agent', email: 'alice@propex.com', status: 'PENDING', createdAt: new Date().toISOString() },
      { id: '2', firstName: 'Bob', lastName: 'Broker', email: 'bob@propex.com', status: 'ACTIVE', createdAt: new Date().toISOString() }
    ]);
    setIsLoading(false);
  }, []);

  const handleUpdateStatus = (id: string, status: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status } : a));
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Agent Approvals</h1>
          <p className="text-slate-500 dark:text-slate-400">Review and approve agent applications.</p>
        </div>
      </div>

      <div className="glass dark:glass-dark rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search agents..." 
              className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 text-sm">
                <th className="px-6 py-4 font-medium">Agent</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Applied</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300 text-sm">
              {agents.map((agent, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={agent.id} 
                  className="border-b border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-lg text-slate-900 dark:text-white font-medium uppercase">
                      {agent.firstName?.[0] || 'A'}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">{agent.firstName} {agent.lastName}</div>
                      <div className="text-slate-500 text-xs">{agent.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 w-max
                      ${agent.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 
                        agent.status === 'REJECTED' ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 
                        'bg-yellow-500/10 text-yellow-400'}
                    `}>
                      {agent.status === 'ACTIVE' && <CheckCircle className="w-3.5 h-3.5" />}
                      {agent.status === 'REJECTED' && <XCircle className="w-3.5 h-3.5" />}
                      {agent.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                      {agent.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {new Date(agent.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {agent.status !== 'ACTIVE' && (
                        <button 
                          onClick={() => handleUpdateStatus(agent.id, 'ACTIVE')}
                          className="p-2 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {agent.status !== 'REJECTED' && (
                        <button 
                          onClick={() => handleUpdateStatus(agent.id, 'REJECTED')}
                          className="p-2 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
              
              {agents.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No agents found.
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
