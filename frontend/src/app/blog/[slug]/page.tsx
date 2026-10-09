'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function BlogPostPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${slug}`);
        setBlog(res.data?.blog || res.data);
      } catch (err) {
        console.error('Failed to fetch blog post', err);
        setError('Blog post not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg pt-32 pb-12 flex items-center justify-center">
        <div className="text-slate-500 dark:text-slate-400">Loading article...</div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-dark-bg pt-32 pb-12 flex flex-col items-center justify-center gap-4">
        <div className="text-rose-500 font-semibold">{error || 'Blog post not found.'}</div>
        <Link href="/blog" className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to all articles
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6 flex gap-4 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 uppercase text-secondary font-bold">
              {blog.category || 'Insights'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-primary" /> 
              {new Date(blog.createdAt || Date.now()).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            {blog.title}
          </h1>

          <div className="flex items-center gap-3 mb-10 pb-10 border-b border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-slate-900 dark:text-white font-medium">{blog.author || 'PropEx Admin'}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Real Estate Expert</div>
            </div>
          </div>

          {blog.image && (
            <div className="w-full h-auto md:h-96 rounded-3xl overflow-hidden mb-12 shadow-2xl border border-slate-200 dark:border-slate-800">
              <img 
                src={blog.image} 
                alt={blog.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div 
            className="prose prose-invert prose-lg max-w-none prose-headings:text-slate-900 dark:text-white prose-a:text-primary hover:prose-a:text-primary-dark prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: blog.content?.replace(/\n/g, '<br/>') || '' }}
          />
        </motion.div>
      </div>
    </div>
  );
}
