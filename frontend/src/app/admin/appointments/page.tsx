'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Trash2, CheckCircle, Clock } from 'lucide-react';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setAppointments([
      { id: '1', clientName: 'Tom Harris', agentName: 'Alice Agent', property: 'Villa Nova', status: 'UPCOMING', date: new Date(Date.now() + 86400000).toISOString() },
      { id: '2', clientName: 'Sarah Lee', agentName: 'Bob Broker', property: 'City Apartment', status: 'COMPLETED', date: new Date(Date.now() - 86400000).toISOString() }
    ]);
    setIsLoading(false);
  }, []);

  const handleUpdateStatus = (id: string, status: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const handleDelete = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Appointments</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage property viewings and meetings.</p>
        </div>
      </div>

      <div className="glass dark:glass-dark rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search appointments..." 
              className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 text-sm">
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Agent</th>
                <th className="px-6 py-4 font-medium">Property</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300 text-sm">
              {appointments.map((appt, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={appt.id} 
                  className="border-b border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{appt.clientName}</td>
                  <td className="px-6 py-4">{appt.agentName}</td>
                  <td className="px-6 py-4">{appt.property}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold
                      ${appt.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 
                        appt.status === 'UPCOMING' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-yellow-500/10 text-yellow-400'}
                    `}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {new Date(appt.date).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {appt.status !== 'COMPLETED' && (
                        <button onClick={() => handleUpdateStatus(appt.id, 'COMPLETED')} className="p-2 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg transition-colors" title="Mark Completed">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(appt.id)} className="p-2 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
