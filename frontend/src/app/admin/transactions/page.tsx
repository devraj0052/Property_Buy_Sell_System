'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CreditCard, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTransactions([
      { id: 'TXN-101', user: 'Alice Brown', amount: 5000, type: 'PAYMENT', status: 'COMPLETED', date: new Date().toISOString() },
      { id: 'TXN-102', user: 'Bob Broker', amount: 250, type: 'REFUND', status: 'PENDING', date: new Date().toISOString() }
    ]);
    setIsLoading(false);
  }, []);

  if (isLoading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Transactions</h1>
          <p className="text-slate-500 dark:text-slate-400">Monitor payments, subscriptions, and refunds.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass dark:glass-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50">
          <div className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Revenue</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">$45,231.00</div>
          <div className="text-emerald-600 dark:text-emerald-400 text-xs mt-2 flex items-center gap-1"><ArrowUpRight className="w-3 h-3"/> +12% this month</div>
        </div>
        <div className="glass dark:glass-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50">
          <div className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Pending Clearance</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">$3,450.00</div>
          <div className="text-yellow-400 text-xs mt-2 flex items-center gap-1"><Clock className="w-3 h-3"/> 15 transactions</div>
        </div>
        <div className="glass dark:glass-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50">
          <div className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Refunds</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">$250.00</div>
          <div className="text-red-600 dark:text-red-400 text-xs mt-2 flex items-center gap-1"><ArrowDownRight className="w-3 h-3"/> 2 transactions</div>
        </div>
      </div>

      <div className="glass dark:glass-dark rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 text-sm">
                <th className="px-6 py-4 font-medium">Transaction ID</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300 text-sm">
              {transactions.map((txn, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={txn.id} 
                  className="border-b border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{txn.id}</td>
                  <td className="px-6 py-4">{txn.user}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <CreditCard className="w-4 h-4" /> {txn.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 font-medium ${txn.type === 'REFUND' ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {txn.type === 'REFUND' ? '-' : '+'}${txn.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold
                      ${txn.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}
                    `}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(txn.date).toLocaleDateString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
