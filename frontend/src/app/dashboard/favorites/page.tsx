'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import Link from 'next/link';
import { MapPin, Heart, Trash2 } from 'lucide-react';

export default function FavoritesPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/favorites');
      setFavorites(response.data.data);
    } catch (error) {
      console.error('Failed to fetch favorites', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavorite = async (propertyId: number) => {
    try {
      await api.post('/favorites/toggle', { propertyId });
      setFavorites(favorites.filter(fav => fav.propertyId !== propertyId));
    } catch (error) {
      console.error('Failed to remove favorite', error);
    }
  };

  if (authLoading || isLoading) {
    return <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading your favorites...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Saved Properties</h2>
      </div>

      {favorites.length === 0 ? (
        <div className="glass dark:glass-dark rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700/50">
          <p className="text-slate-500 dark:text-slate-400 mb-6">You haven't saved any properties yet.</p>
          <Link href="/properties/buy" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl transition-colors inline-block">
            Explore Properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <motion.div 
              key={fav.id}
              whileHover={{ y: -5 }}
              className="glass dark:glass-dark rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 group relative"
            >
              <button 
                onClick={() => removeFavorite(fav.propertyId)}
                className="absolute top-4 right-4 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur p-2 rounded-full text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Remove from favorites"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <Link href={`/properties/${fav.property.slug}`}>
                <div className="relative h-48 overflow-hidden bg-slate-50 dark:bg-slate-800">
                  <img 
                    src={fav.property.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80'} 
                    alt={fav.property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    {fav.property.purpose === 'BUY' ? 'FOR SALE' : 'FOR RENT'}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">{fav.property.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1 mb-3">
                    <MapPin className="w-4 h-4 text-primary" /> {fav.property.location?.name || fav.property.address}
                  </p>
                  <div className="text-xl font-bold text-slate-900 dark:text-white mb-2">${Number(fav.property.price).toLocaleString()}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
