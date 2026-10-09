'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';

interface PropertiesListProps {
  initialTab?: 'ALL' | 'BUY' | 'RENT';
  title?: string;
}

const PropertySkeleton = () => (
  <div className="glass dark:glass-dark rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50">
    <Skeleton className="h-64 w-full rounded-none" />
    <div className="p-6">
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-4 w-1/2 mb-6" />
      <div className="flex justify-between border-t border-slate-200 dark:border-slate-700/50 pt-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  </div>
);

export default function PropertiesList({ initialTab = 'ALL', title = 'Explore Properties' }: PropertiesListProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const query = activeTab !== 'ALL' ? `?type=${activeTab.toLowerCase()}` : '';
        const res = await api.get(`/properties${query}`);
        const data = res.data?.data?.properties || res.data?.data || res.data?.properties || res.data;
        setProperties(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch properties', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-dark-bg pt-24 pb-12">
      <div className="container mx-auto px-6">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{title}</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl">Browse our extensive catalog of premium real estate options.</p>
          </div>
          
          <div className="w-full md:w-auto flex gap-4">
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-2 flex items-center">
              <Link href="/properties" onClick={() => setActiveTab('ALL')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'ALL' ? 'bg-primary text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                All
              </Link>
              <Link href="/properties/buy" onClick={() => setActiveTab('BUY')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'BUY' ? 'bg-primary text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                For Sale
              </Link>
              <Link href="/properties/rent" onClick={() => setActiveTab('RENT')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'RENT' ? 'bg-primary text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                For Rent
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="glass dark:glass-dark rounded-2xl p-4 md:p-6 mb-12 border border-slate-200 dark:border-slate-700/50 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input type="text" placeholder="Search by name or location..." className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white focus:border-primary outline-none transition-colors" />
          </div>
          <div className="flex gap-4">
            <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none cursor-pointer">
              <option value="">Property Type</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
            </select>
            <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none cursor-pointer">
              <option value="">Price Range</option>
              <option value="1">Under $500k</option>
              <option value="2">$500k - $1M</option>
            </select>
            <button className="bg-slate-50 dark:bg-slate-800 hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3 transition-colors flex items-center justify-center">
              <SlidersHorizontal className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <PropertySkeleton key={i} />)
          ) : properties.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">No properties found.</div>
          ) : (
            properties.map((item, index) => (
              <motion.div 
                key={item._id || item.id || index}
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass dark:glass-dark rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 group block"
              >
                <Link href={`/properties/${item.slug || item._id || item.id}`}>
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={item.images?.[0] || item.image || `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80`} 
                      alt={item.title || "Property"} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80' }}
                    />
                    <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg uppercase">
                      {item.type === 'rent' ? 'FOR RENT' : 'FOR SALE'}
                    </div>
                    <div className="absolute top-4 right-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur text-slate-900 dark:text-white text-xs font-bold px-3 py-1 rounded-full">
                      ${(item.price || 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors truncate">{item.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1 mb-4 truncate">
                      <MapPin className="w-4 h-4 text-primary shrink-0" /> {item.location?.address || item.location?.city || item.address || 'Unknown Location'}
                    </p>
                    <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700/50 pt-4 mt-4">
                      <div className="text-slate-600 dark:text-slate-300 text-sm"><span className="font-bold text-slate-900 dark:text-white">{item.features?.bedrooms || 0}</span> Beds</div>
                      <div className="text-slate-600 dark:text-slate-300 text-sm"><span className="font-bold text-slate-900 dark:text-white">{item.features?.bathrooms || 0}</span> Baths</div>
                      <div className="text-slate-600 dark:text-slate-300 text-sm"><span className="font-bold text-slate-900 dark:text-white">{item.features?.area || 0}</span> sqft</div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>

        {properties.length > 0 && !loading && (
          <div className="flex justify-center mt-12">
            <button className="px-8 py-3 rounded-xl border border-primary text-primary hover:bg-primary hover:text-slate-900 dark:hover:text-white transition-colors font-medium">
              Load More
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
