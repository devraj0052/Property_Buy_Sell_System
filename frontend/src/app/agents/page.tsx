'use client';

import { motion } from 'framer-motion';
import { Star, MapPin, Phone, Mail, Award, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const mockAgents = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Senior Real Estate Broker",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviews: 124,
    propertiesSold: 86,
    experience: "8 Years",
    location: "Beverly Hills, CA",
    specialties: ["Luxury Homes", "Commercial"],
  },
  {
    id: 2,
    name: "David Chen",
    role: "Property Consultant",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviews: 92,
    propertiesSold: 64,
    experience: "5 Years",
    location: "Downtown LA, CA",
    specialties: ["Condos", "Apartments"],
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Investment Specialist",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    reviews: 156,
    propertiesSold: 112,
    experience: "12 Years",
    location: "Malibu, CA",
    specialties: ["Waterfront", "Vacation Homes"],
  }
];

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-dark-bg pt-32 pb-20">
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Meet Our Expert <span className="text-primary">Agents</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Our team of certified professionals brings decades of combined experience to help you find your perfect property.
            </p>
          </motion.div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockAgents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass dark:glass-dark rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden hover:border-primary/50 transition-all duration-300 group"
            >
              {/* Agent Image Header */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={agent.image} 
                  alt={agent.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-dark-bg/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-600 flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-slate-900 dark:text-white font-medium text-sm">{agent.rating}</span>
                </div>
              </div>

              {/* Agent Details */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{agent.name}</h3>
                  <p className="text-primary font-medium text-sm mb-3">{agent.role}</p>
                  
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-4">
                    <MapPin className="w-4 h-4" />
                    {agent.location}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-slate-200 dark:border-slate-700/50">
                  <div>
                    <p className="text-slate-500 text-xs uppercase font-semibold mb-1">Experience</p>
                    <p className="text-slate-900 dark:text-white font-medium flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" /> {agent.experience}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase font-semibold mb-1">Properties Sold</p>
                    <p className="text-slate-900 dark:text-white font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" /> {agent.propertiesSold}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-slate-500 text-xs uppercase font-semibold mb-2">Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {agent.specialties.map(spec => (
                      <span key={spec} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-full text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-auto">
                  <Link href="/contact" className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" /> Message
                  </Link>
                  <button suppressHydrationWarning className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
