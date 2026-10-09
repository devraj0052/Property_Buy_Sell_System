'use client';

import { motion } from 'framer-motion';
import { Search, MapPin, Home, DollarSign } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image / Video Simulation */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000)' }}
        />
        <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 z-10" />

        <div className="container relative z-20 mx-auto px-6 flex flex-col items-center text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight drop-shadow-lg">
              Find Your <span className="text-primary">Dream</span> Property
            </h1>
            <p className="text-xl text-slate-700 dark:text-slate-200 mb-12 drop-shadow">
              Discover premium estates, modern apartments, and luxurious villas tailored to your lifestyle.
            </p>
          </motion.div>

          {/* Search Bar Glassmorphism */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-5xl glass dark:glass-dark rounded-2xl p-4 md:p-6 shadow-2xl"
          >
            <div className="flex flex-col md:flex-row gap-4">
              
              {/* Location */}
              <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl px-4 py-3 flex items-center gap-3 border border-slate-200 dark:border-slate-700/50 hover:border-primary/50 transition-colors">
                <MapPin className="text-primary w-6 h-6" />
                <div className="flex flex-col text-left w-full">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Location</span>
                  <input suppressHydrationWarning type="text" placeholder="City, Neighborhood..." className="bg-transparent text-slate-900 dark:text-white outline-none w-full placeholder:text-slate-500" />
                </div>
              </div>

              {/* Property Type */}
              <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl px-4 py-3 flex items-center gap-3 border border-slate-200 dark:border-slate-700/50 hover:border-primary/50 transition-colors">
                <Home className="text-primary w-6 h-6" />
                <div className="flex flex-col text-left w-full">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Property Type</span>
                  <select suppressHydrationWarning className="bg-transparent text-slate-900 dark:text-white outline-none w-full appearance-none cursor-pointer">
                    <option value="" className="bg-slate-50 dark:bg-slate-800">All Types</option>
                    <option value="apartment" className="bg-slate-50 dark:bg-slate-800">Apartment</option>
                    <option value="villa" className="bg-slate-50 dark:bg-slate-800">Villa</option>
                    <option value="commercial" className="bg-slate-50 dark:bg-slate-800">Commercial</option>
                  </select>
                </div>
              </div>

              {/* Price Range */}
              <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl px-4 py-3 flex items-center gap-3 border border-slate-200 dark:border-slate-700/50 hover:border-primary/50 transition-colors">
                <DollarSign className="text-primary w-6 h-6" />
                <div className="flex flex-col text-left w-full">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Price Range</span>
                  <select suppressHydrationWarning className="bg-transparent text-slate-900 dark:text-white outline-none w-full appearance-none cursor-pointer">
                    <option value="" className="bg-slate-50 dark:bg-slate-800">Any Price</option>
                    <option value="1" className="bg-slate-50 dark:bg-slate-800">Under $500k</option>
                    <option value="2" className="bg-slate-50 dark:bg-slate-800">$500k - $1M</option>
                    <option value="3" className="bg-slate-50 dark:bg-slate-800">Above $1M</option>
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <button suppressHydrationWarning className="bg-primary hover:bg-primary-dark text-white rounded-xl px-8 py-4 flex items-center justify-center gap-2 font-semibold transition-all transform hover:scale-105 shadow-lg shadow-primary/30 h-full self-stretch md:self-auto">
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-dark-bg to-transparent z-10" />
      </section>

      {/* Featured Properties Section */}
      <section className="py-24 bg-dark-bg relative">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Featured Properties</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl">Explore our handpicked selection of premium properties offering the best in luxury, comfort, and location.</p>
            </div>
            <button suppressHydrationWarning className="hidden md:block text-primary hover:text-slate-900 dark:hover:text-white font-medium transition-colors">
              View All Properties &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Property Card Mock */}
            {[1, 2, 3].map((item) => (
              <motion.div 
                key={item}
                whileHover={{ y: -10 }}
                className="glass dark:glass-dark rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800&sig=${item}`} 
                    alt="Property" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    FOR SALE
                  </div>
                  <div className="absolute top-4 right-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur text-slate-900 dark:text-white text-xs font-bold px-3 py-1 rounded-full">
                    $1,250,000
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">Modern Glass Villa</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1 mb-4">
                    <MapPin className="w-4 h-4 text-primary" /> Beverly Hills, CA 90210
                  </p>
                  <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700/50 pt-4 mt-4">
                    <div className="text-slate-600 dark:text-slate-300 text-sm"><span className="font-bold text-slate-900 dark:text-white">4</span> Beds</div>
                    <div className="text-slate-600 dark:text-slate-300 text-sm"><span className="font-bold text-slate-900 dark:text-white">3</span> Baths</div>
                    <div className="text-slate-600 dark:text-slate-300 text-sm"><span className="font-bold text-slate-900 dark:text-white">3,500</span> sqft</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
