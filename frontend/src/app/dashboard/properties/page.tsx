'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import Link from 'next/link';
import { Building, Plus, MapPin, Edit, Trash2, Eye } from 'lucide-react';

export default function MyPropertiesPage() {
  const { user } = useAuthStore();
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      // In a real app, we'd have a specific endpoint for user's properties
      // or pass a query param. For now, fetch all and filter client side.
      const response = await api.get('/properties');
      const userProps = response.data.data.filter((p: any) => p.userId === user?.id);
      setProperties(userProps);
    } catch (error) {
      console.error('Failed to fetch properties', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading your properties...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Building className="w-8 h-8 text-secondary" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Properties</h2>
        </div>
        
        <Link 
          href="/dashboard/properties/new" 
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2 font-medium"
        >
          <Plus className="w-4 h-4" /> Add New Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="glass dark:glass-dark rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700/50">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-slate-500" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 mb-6 text-lg">You haven't listed any properties yet.</p>
          <Link href="/dashboard/properties/new" className="bg-secondary hover:bg-secondary-dark text-slate-900 dark:text-white px-6 py-3 rounded-xl transition-colors inline-flex items-center gap-2">
            <Plus className="w-5 h-5" /> List a Property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {properties.map((property) => (
            <motion.div 
              key={property.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass dark:glass-dark rounded-2xl p-4 border border-slate-200 dark:border-slate-700/50 flex flex-col md:flex-row gap-6 items-center"
            >
              <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 shrink-0">
                <img 
                  src={property.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&q=80'} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${property.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                        {property.status}
                      </span>
                      <span className="text-xs font-bold px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {property.purpose === 'BUY' ? 'SALE' : 'RENT'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{property.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1 mb-2">
                      <MapPin className="w-4 h-4 text-primary" /> {property.address}
                    </p>
                    <div className="text-lg font-bold text-primary">${Number(property.price).toLocaleString()}</div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link href={`/properties/${property.slug}`} className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors" title="View Public">
                      <Eye className="w-5 h-5" />
                    </Link>
                    <button className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-blue-600/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg text-slate-600 dark:text-slate-300 transition-colors" title="Edit">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-red-600/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg text-slate-600 dark:text-slate-300 transition-colors" title="Delete">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
