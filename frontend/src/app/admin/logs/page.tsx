'use client';

import { motion } from 'framer-motion';
import { ScrollText, Search, Filter } from 'lucide-react';

export default function AdminLogsPage() {
  const logs = [
    { id: '1', action: 'USER_LOGIN', user: 'admin@propex.com', ip: '192.168.1.1', time: new Date().toISOString() },
    { id: '2', action: 'PROPERTY_DELETED', user: 'agent@propex.com', ip: '10.0.0.45', time: new Date(Date.now() - 3600000).toISOString() },
    { id: '3', action: 'SETTINGS_UPDATED', user: 'admin@propex.com', ip: '192.168.1.1', time: new Date(Date.now() - 7200000).toISOString() },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Activity Logs</h1>
          <p className="text-slate-500 dark:text-slate-400">Track system actions and audit trails.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-4 py-2.5 rounded-xl font-medium transition-colors border border-slate-200 dark:border-slate-700">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      <div className="glass dark:glass-dark rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 text-sm">
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">IP Address</th>
                <th className="px-6 py-4 font-medium text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300 text-sm">
              {logs.map((log, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={log.id} 
                  className="border-b border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors font-mono"
                >
                  <td className="px-6 py-4">
                    <span className="bg-slate-50 dark:bg-slate-800 text-primary px-2 py-1 rounded text-xs">{log.action}</span>
                  </td>
                  <td className="px-6 py-4">{log.user}</td>
                  <td className="px-6 py-4 text-slate-500">{log.ip}</td>
                  <td className="px-6 py-4 text-right text-slate-500">{new Date(log.time).toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
