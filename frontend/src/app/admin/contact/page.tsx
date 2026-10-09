'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, Trash2, CheckCircle } from 'lucide-react';

export default function AdminContactPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMessages([
      { id: '1', name: 'Alice Brown', email: 'alice@example.com', subject: 'Property Inquiry', status: 'UNREAD', date: new Date().toISOString() },
      { id: '2', name: 'Bob White', email: 'bob@example.com', subject: 'Support Request', status: 'READ', date: new Date().toISOString() }
    ]);
    setIsLoading(false);
  }, []);

  const handleMarkAsRead = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'READ' } : m));
  };

  const handleDelete = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Contact Messages</h1>
          <p className="text-slate-500 dark:text-slate-400">View and respond to inquiries.</p>
        </div>
      </div>

      <div className="glass dark:glass-dark rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 text-sm">
                <th className="px-6 py-4 font-medium">Sender</th>
                <th className="px-6 py-4 font-medium">Subject</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300 text-sm">
              {messages.map((msg, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={msg.id} 
                  className={`border-b border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors ${msg.status === 'UNREAD' ? 'font-medium text-slate-900 dark:text-white' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div>{msg.name}</div>
                    <div className="text-xs text-slate-500">{msg.email}</div>
                  </td>
                  <td className="px-6 py-4">{msg.subject}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold
                      ${msg.status === 'UNREAD' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-slate-500/10 text-slate-500 dark:text-slate-400'}
                    `}>
                      {msg.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(msg.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {msg.status === 'UNREAD' && (
                        <button onClick={() => handleMarkAsRead(msg.id)} className="p-2 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg transition-colors">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-2 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(msg.id)} className="p-2 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg transition-colors">
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
