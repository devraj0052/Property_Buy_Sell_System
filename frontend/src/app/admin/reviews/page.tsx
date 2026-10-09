'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, Trash2, CheckCircle, Clock } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setReviews([
      { id: '1', author: 'John Doe', rating: 5, comment: 'Great property!', status: 'PENDING', createdAt: new Date().toISOString() },
      { id: '2', author: 'Jane Smith', rating: 4, comment: 'Nice location.', status: 'APPROVED', createdAt: new Date().toISOString() }
    ]);
    setIsLoading(false);
  }, []);

  const handleUpdateStatus = (id: string, status: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const handleDelete = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Reviews Moderation</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage property reviews.</p>
        </div>
      </div>

      <div className="glass dark:glass-dark rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search reviews..." 
              className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 text-sm">
                <th className="px-6 py-4 font-medium">Author</th>
                <th className="px-6 py-4 font-medium">Rating</th>
                <th className="px-6 py-4 font-medium">Comment</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300 text-sm">
              {reviews.map((review, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={review.id} 
                  className="border-b border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{review.author}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-yellow-400">
                      {review.rating} <Star className="w-4 h-4 ml-1 fill-current" />
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate">{review.comment}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 w-max
                      ${review.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}
                    `}>
                      {review.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {review.status !== 'APPROVED' && (
                        <button 
                          onClick={() => handleUpdateStatus(review.id, 'APPROVED')}
                          className="p-2 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(review.id)}
                        className="p-2 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                      >
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
