'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Edit, Trash2, Plus } from 'lucide-react';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setBlogs([
      { id: '1', title: 'Top 10 Real Estate Trends', author: 'Admin', status: 'PUBLISHED', date: new Date().toISOString() },
      { id: '2', title: 'Buying Your First Home', author: 'Admin', status: 'DRAFT', date: new Date().toISOString() }
    ]);
    setIsLoading(false);
  }, []);

  const handleDelete = (id: string) => {
    setBlogs(prev => prev.filter(b => b.id !== id));
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Blog Posts</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your blog articles.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl font-medium transition-colors">
          <Plus className="w-5 h-5" />
          Add Post
        </button>
      </div>

      <div className="glass dark:glass-dark rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search posts..." 
              className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 text-sm">
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Author</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300 text-sm">
              {blogs.map((blog, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={blog.id} 
                  className="border-b border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{blog.title}</td>
                  <td className="px-6 py-4">{blog.author}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold
                      ${blog.status === 'PUBLISHED' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-slate-500/10 text-slate-500 dark:text-slate-400'}
                    `}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(blog.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(blog.id)} className="p-2 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg transition-colors">
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
