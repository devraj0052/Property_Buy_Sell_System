'use client';


import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/blogs');
        setBlogs(res.data?.blogs || res.data || []);
      } catch (err) {
        console.error('Failed to fetch blogs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const featuredBlog = blogs.length > 0 ? blogs[0] : null;
  const regularBlogs = blogs.length > 1 ? blogs.slice(1) : [];

  return (
    <div className="min-h-screen bg-dark-bg pt-24 pb-12">
      <div className="container mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6"
          >
            Real Estate <span className="text-primary">Insights</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 dark:text-slate-400 text-lg"
          >
            Latest news, tips, and trends in the property market.
          </motion.p>
        </div>

        {loading ? (
          <div className="text-center text-slate-500 dark:text-slate-400 py-12">Loading articles...</div>
        ) : (
          <>
            {/* Featured Blog */}
            {featuredBlog && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-16 glass dark:glass-dark rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700/50 flex flex-col lg:flex-row group"
              >
                <div className="lg:w-1/2 relative overflow-hidden h-64 lg:h-auto">
                  <img 
                    src={featuredBlog.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1000&q=80"} 
                    alt={featuredBlog.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                </div>
                <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex gap-4 mb-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-primary" /> {new Date(featuredBlog.createdAt || Date.now()).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><User className="w-4 h-4 text-primary" /> {featuredBlog.author || 'Admin'}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors">{featuredBlog.title}</h2>
                  <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed line-clamp-3">
                    {featuredBlog.excerpt || featuredBlog.content}
                  </p>
                  <Link href={`/blog/${featuredBlog.slug || featuredBlog._id || featuredBlog.id}`} className="inline-flex items-center gap-2 text-primary hover:text-slate-900 dark:hover:text-white font-medium transition-colors">
                    Read Full Article <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularBlogs.map((item: any, i: number) => (
                <motion.div 
                  key={item._id || item.id || i}
                  whileHover={{ y: -10 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass dark:glass-dark rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={item.image || `https://images.unsplash.com/photo-[id]?auto=format&fit=crop&q=80&w=600&sig=${i + 20}`} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80' }}
                    />
                    <div className="absolute top-4 left-4 bg-secondary text-slate-900 dark:text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg uppercase">
                      {item.category || 'INSIGHTS'}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex gap-4 mb-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-primary" /> {new Date(item.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                      {item.excerpt || item.content}
                    </p>
                    <Link href={`/blog/${item.slug || item._id || item.id}`} className="inline-flex items-center gap-2 text-primary hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors">
                      Read More <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {regularBlogs.length === 0 && !featuredBlog && (
              <div className="text-center text-slate-500 dark:text-slate-400 py-12">No articles found.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
