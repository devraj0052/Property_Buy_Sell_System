'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, Check, X, Search, Clock, CheckCircle, XCircle 
} from 'lucide-react';
import api from '@/lib/api';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      // First fetch pending properties, then maybe general properties.
      // We will merge or just fetch pending for the approval workflow as requested.
      const res = await api.get('/api/admin/properties/pending');
      // Fallback if the endpoint does not exist yet or returns something else
      setProperties(res.data?.data?.properties || res.data?.properties || []);
    } catch (err) {
      console.error('Failed to fetch pending properties', err);
      // Fallback to all properties if pending fails
      try {
        const fallbackRes = await api.get('/api/properties');
        setProperties(fallbackRes.data?.data?.properties || fallbackRes.data?.properties || []);
      } catch (err2) {
        console.error('Failed to fetch fallback properties', err2);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleStatusUpdate = async (id: string, action: 'approve' | 'reject') => {
    try {
      await api.patch(`/api/admin/properties/${id}/${action}`);
      fetchProperties();
    } catch (err) {
      console.error(`Failed to ${action} property`, err);
    }
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Properties Approval</h1>
          <p className="text-slate-500 dark:text-slate-400">Review and approve property listings before they go live.</p>
        </div>
      </div>

      <div className="glass dark:glass-dark rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search properties..." 
              className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 text-sm">
                <th className="px-6 py-4 font-medium">Property</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date Submitted</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300 text-sm">
              {properties.map((property, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={property.id} 
                  className="border-b border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center">
                      <Building className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">{property.title || 'Untitled Property'}</div>
                      <div className="text-slate-500 text-xs truncate max-w-xs">{property.location?.city || property.address || 'No location'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    ${property.price?.toLocaleString() || '0'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 w-max
                      ${property.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 
                        property.status === 'REJECTED' ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 
                        'bg-orange-500/10 text-orange-400'}
                    `}>
                      {property.status === 'APPROVED' && <CheckCircle className="w-3.5 h-3.5" />}
                      {property.status === 'REJECTED' && <XCircle className="w-3.5 h-3.5" />}
                      {property.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                      {property.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(property.createdAt || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleStatusUpdate(property.id, 'approve')}
                        className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg transition-colors"
                        title="Approve"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(property.id, 'reject')}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              
              {properties.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No properties pending approval.
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
