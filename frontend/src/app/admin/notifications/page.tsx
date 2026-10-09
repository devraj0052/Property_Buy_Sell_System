'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, Trash2 } from 'lucide-react';

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setNotifications([
      { id: '1', title: 'System Update', message: 'Server maintenance scheduled for 3 AM.', isRead: false, date: new Date().toISOString() },
      { id: '2', title: 'New User Registered', message: 'Alice created a new account.', isRead: true, date: new Date(Date.now() - 3600000).toISOString() }
    ]);
    setIsLoading(false);
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">System Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400">View and manage alerts.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {notifications.map((notification, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={notification.id} 
            className={`glass dark:glass-dark p-6 rounded-2xl border flex items-start gap-4 ${notification.isRead ? 'border-slate-200 dark:border-slate-700/50 opacity-70' : 'border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]'}`}
          >
            <div className={`p-3 rounded-xl ${notification.isRead ? 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400' : 'bg-primary/20 text-primary'}`}>
              <Bell className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-semibold ${notification.isRead ? 'text-slate-600 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>{notification.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1">{notification.message}</p>
              <div className="text-xs text-slate-500 mt-3">{new Date(notification.date).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-2">
              {!notification.isRead && (
                <button onClick={() => handleMarkAsRead(notification.id)} className="p-2 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg transition-colors" title="Mark as Read">
                  <CheckCircle className="w-5 h-5" />
                </button>
              )}
              <button onClick={() => handleDelete(notification.id)} className="p-2 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg transition-colors" title="Delete">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
        {notifications.length === 0 && (
          <div className="text-center py-12 text-slate-500 glass dark:glass-dark rounded-2xl border border-slate-200 dark:border-slate-700/50">
            No notifications available.
          </div>
        )}
      </div>
    </div>
  );
}
