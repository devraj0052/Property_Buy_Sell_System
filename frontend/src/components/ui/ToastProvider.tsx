'use client';

import { useToastStore } from '@/store/toastStore';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function ToastProvider() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center justify-between gap-4 px-5 py-4 rounded-xl shadow-2xl font-medium text-sm text-slate-900 dark:text-white min-w-[300px] border border-white/10 backdrop-blur-md ${
              toast.type === 'success' ? 'bg-emerald-600/90' : toast.type === 'error' ? 'bg-rose-600/90' : 'bg-blue-600/90'
            }`}
          >
            <span>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="hover:opacity-75 transition-opacity bg-white dark:bg-black/20 p-1 rounded-md">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
