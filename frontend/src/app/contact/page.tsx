'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Map from '@/components/ui/Map';

import { useState } from 'react';
import api from '@/lib/api';
import { useToastStore } from '@/store/toastStore';

export default function ContactPage() {
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact/messages', formData);
      addToast('Message sent successfully!', 'success');
      setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to send message', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg pt-24 pb-12">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6"
          >
            Get in <span className="text-primary">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 dark:text-slate-400 text-lg"
          >
            Have a question about a property, or want to list yours? Our team of experts is here to help you every step of the way.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
          
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 space-y-8"
          >
            <div className="glass dark:glass-dark rounded-3xl p-8 border border-slate-200 dark:border-slate-700/50">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-1">Our Headquarters</h3>
                    <p className="text-slate-500 dark:text-slate-400">123 Real Estate Blvd, Suite 500<br/>Beverly Hills, CA 90210</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-1">Phone Number</h3>
                    <p className="text-slate-500 dark:text-slate-400">Toll-Free: +1 (800) 555-0199<br/>Direct: +1 (310) 555-0123</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-1">Email Address</h3>
                    <p className="text-slate-500 dark:text-slate-400">support@propex.com<br/>sales@propex.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Map Placeholder */}
            <div className="h-64 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700/50 relative">
              <Map center={{ lat: 34.0736, lng: -118.4004 }} zoom={13} />
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1"
          >
            <div className="glass dark:glass-dark rounded-3xl p-8 md:p-10 border border-slate-200 dark:border-slate-700/50 shadow-2xl">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Send us a Message</h2>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">First Name</label>
                    <input name="firstName" value={formData.firstName} onChange={handleChange} required type="text" placeholder="John" className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-primary block w-full px-4 py-3 transition-colors outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">Last Name</label>
                    <input name="lastName" value={formData.lastName} onChange={handleChange} required type="text" placeholder="Doe" className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-primary block w-full px-4 py-3 transition-colors outline-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">Email Address</label>
                  <input name="email" value={formData.email} onChange={handleChange} required type="email" placeholder="name@example.com" className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-primary block w-full px-4 py-3 transition-colors outline-none" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">Subject</label>
                  <input name="subject" value={formData.subject} onChange={handleChange} required type="text" placeholder="How can we help?" className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-primary block w-full px-4 py-3 transition-colors outline-none" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">Message</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="Write your message here..." className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-primary block w-full px-4 py-3 transition-colors outline-none resize-none"></textarea>
                </div>

                <button disabled={loading} type="submit" className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 text-white rounded-xl px-4 py-4 font-semibold transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 text-lg">
                  <Send className="w-5 h-5" /> {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
