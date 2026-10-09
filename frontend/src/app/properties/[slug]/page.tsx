'use client';

import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square, Calendar, Heart, Share2, Phone, Mail, CheckCircle2 } from 'lucide-react';
import Map from '@/components/ui/Map';

export default function PropertyDetailPage() {
  return (
    <div className="min-h-screen bg-dark-bg pt-20">
      
      {/* Image Gallery Header */}
      <div className="relative h-[60vh] w-full bg-white dark:bg-slate-900 group">
        <img 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80" 
          alt="Property Main" 
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent"></div>
        <div className="absolute bottom-8 right-8 flex gap-4">
          <button className="bg-white/80 dark:bg-slate-900/80 backdrop-blur text-slate-900 dark:text-white px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:bg-slate-800 transition-colors flex items-center gap-2">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button className="bg-white/80 dark:bg-slate-900/80 backdrop-blur text-slate-900 dark:text-white px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:text-red-600 dark:hover:text-red-400 hover:border-red-400/50 transition-colors flex items-center gap-2">
            <Heart className="w-4 h-4" /> Save
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Info */}
          <div className="flex-1">
            <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-3">FOR SALE</div>
                  <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">Modern Glass Villa</h1>
                  <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2 text-lg">
                    <MapPin className="text-primary w-5 h-5" /> Beverly Hills, California 90210
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">$1,250,000</div>
                  <div className="text-slate-500 dark:text-slate-400 text-sm">Est. $5,240/mo</div>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="glass dark:glass-dark rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 text-sm font-medium uppercase tracking-wider flex items-center gap-2"><Bed className="w-4 h-4 text-primary"/> Bedrooms</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">4</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 text-sm font-medium uppercase tracking-wider flex items-center gap-2"><Bath className="w-4 h-4 text-primary"/> Bathrooms</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">3.5</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 text-sm font-medium uppercase tracking-wider flex items-center gap-2"><Square className="w-4 h-4 text-primary"/> Area</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">3,500 <span className="text-sm font-normal text-slate-500 dark:text-slate-400">sqft</span></span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 text-sm font-medium uppercase tracking-wider flex items-center gap-2"><Calendar className="w-4 h-4 text-primary"/> Built In</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">2023</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Property Description</h2>
              <div className="text-slate-600 dark:text-slate-300 leading-relaxed space-y-4">
                <p>Welcome to this stunning modern masterpiece located in the heart of Beverly Hills. This architectural gem offers unparalleled luxury and sophistication, featuring seamless indoor-outdoor living spaces and breathtaking panoramic views.</p>
                <p>The open-concept main level boasts soaring ceilings, walls of glass, and a state-of-the-art chef's kitchen equipped with top-of-the-line appliances and custom cabinetry.</p>
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Amenities & Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                {['Swimming Pool', 'Smart Home System', 'Home Theater', 'Wine Cellar', 'Fitness Center', 'Outdoor Kitchen', '3-Car Garage', 'Security System', 'Spa/Hot Tub'].map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-secondary" /> {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Location Map */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Location</h2>
              <div className="h-[400px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700/50 relative">
                <Map center={{ lat: 34.0736, lng: -118.4004 }} zoom={15} />
              </div>
            </div>

          </div>

          {/* Sidebar / Contact */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="glass dark:glass-dark rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50 sticky top-28">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Contact Agent</h3>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&q=80" alt="Agent" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">Michael Roberts</div>
                  <div className="text-primary text-sm font-medium">Senior Agent @ PropEx</div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <button className="w-full glass bg-white/5 hover:bg-white/10 text-slate-900 dark:text-white rounded-xl py-3 px-4 flex items-center justify-center gap-3 transition-colors border border-slate-200 dark:border-slate-700">
                  <Phone className="w-5 h-5 text-primary" /> +1 (310) 555-0123
                </button>
                <button className="w-full glass bg-white/5 hover:bg-white/10 text-slate-900 dark:text-white rounded-xl py-3 px-4 flex items-center justify-center gap-3 transition-colors border border-slate-200 dark:border-slate-700">
                  <Mail className="w-5 h-5 text-primary" /> Email Agent
                </button>
                <button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-slate-900 dark:text-white rounded-xl py-3 px-4 flex items-center justify-center gap-3 transition-colors font-medium">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  WhatsApp
                </button>
              </div>

              <form className="space-y-4">
                <input type="text" placeholder="Your Name" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" />
                <input type="email" placeholder="Your Email" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" />
                <textarea placeholder="I am interested in this property..." rows={4} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors resize-none"></textarea>
                <button type="button" className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl py-3 font-semibold transition-colors">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
