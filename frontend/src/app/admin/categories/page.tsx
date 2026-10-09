'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tags, Plus, Search, Edit2, Trash2 
} from 'lucide-react';
import api from '@/lib/api';

const TABS = [
  { label: 'Categories', endpoint: 'categories' },
  { label: 'Property Types', endpoint: 'categories/types' },
  { label: 'Amenities', endpoint: 'categories/amenities' },
];

export default function AdminCategoriesPage() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const activeTab = TABS[activeTabIndex];

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', icon: '' });

  const fetchData = async () => {
    setIsLoading(true);
    setData([]);
    try {
      const res = await api.get(`/api/${activeTab.endpoint}`);
      // Usually API returns { data: [...] } or { categories: [...] }
      const key = activeTab.endpoint.split('/').pop() || 'categories';
      setData(res.data?.data?.[key] || res.data?.[key] || res.data?.data || []);
    } catch (err) {
      console.error(`Failed to fetch ${activeTab.label}`, err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTabIndex]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/api/${activeTab.endpoint}`, formData);
      setFormData({ name: '', icon: '' });
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(`Failed to create ${activeTab.label}`, err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this item?`)) return;
    try {
      await api.delete(`/api/${activeTab.endpoint}/${id}`);
      fetchData();
    } catch (err) {
      console.error(`Failed to delete`, err);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Category Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage property categories, types, and amenities.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Add New
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl w-max border border-slate-200 dark:border-slate-700/50">
        {TABS.map((tab, idx) => (
          <button
            key={tab.label}
            onClick={() => setActiveTabIndex(idx)}
            className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTabIndex === idx 
                ? 'bg-primary text-white shadow-lg' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="glass dark:glass-dark rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700/50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{activeTab.label} List</h2>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder={`Search...`}
              className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 text-sm">
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Icon (Class)</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 dark:text-slate-300 text-sm">
                <AnimatePresence>
                  {data.map((item, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ delay: idx * 0.05 }}
                      key={item.id} 
                      className="border-b border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center">
                          <Tags className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">{item.name}</span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">
                        {item.icon || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 hover:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                
                {data.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                      No items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white dark:bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Add New Item</h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Name</label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors"
                    placeholder="Enter name..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Icon Class (Optional)</label>
                  <input 
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors"
                    placeholder="e.g., flaticon-bed..."
                  />
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-xl transition-colors font-medium"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
