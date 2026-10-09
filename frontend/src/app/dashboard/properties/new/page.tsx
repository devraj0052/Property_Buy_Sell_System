'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { Building, UploadCloud, Save } from 'lucide-react';

export default function AddPropertyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    purpose: 'BUY',
    address: '',
    categoryId: '1',
    typeId: '1',
    locationId: '1',
    areaSize: '',
    bedrooms: '',
    bathrooms: '',
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/properties', {
        ...formData,
        price: Number(formData.price),
        categoryId: Number(formData.categoryId),
        typeId: Number(formData.typeId),
        locationId: Number(formData.locationId),
        areaSize: Number(formData.areaSize),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
      });
      router.push('/dashboard/properties');
    } catch (error) {
      console.error('Failed to create property', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <Building className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Add New Property</h2>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit} 
        className="space-y-8"
      >
        
        {/* Basic Info */}
        <div className="glass dark:glass-dark rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700/50 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/50 pb-4">Basic Information</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Property Title</label>
            <input required name="title" value={formData.title} onChange={handleChange} type="text" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-primary outline-none" placeholder="e.g. Modern Glass Villa" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Price (USD)</label>
              <input required name="price" value={formData.price} onChange={handleChange} type="number" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-primary outline-none" placeholder="1250000" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Purpose</label>
              <select required name="purpose" value={formData.purpose} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-primary outline-none">
                <option value="BUY">For Sale</option>
                <option value="RENT">For Rent</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Description</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-primary outline-none resize-none" placeholder="Describe the property..."></textarea>
          </div>
        </div>

        {/* Details */}
        <div className="glass dark:glass-dark rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700/50 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/50 pb-4">Property Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Area Size (sqft)</label>
              <input required name="areaSize" value={formData.areaSize} onChange={handleChange} type="number" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-primary outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Bedrooms</label>
              <input required name="bedrooms" value={formData.bedrooms} onChange={handleChange} type="number" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-primary outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Bathrooms</label>
              <input required name="bathrooms" value={formData.bathrooms} onChange={handleChange} type="number" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-primary outline-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Full Address</label>
            <input required name="address" value={formData.address} onChange={handleChange} type="text" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-primary outline-none" placeholder="123 Main St, City, State" />
          </div>
        </div>

        {/* Media */}
        <div className="glass dark:glass-dark rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700/50 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/50 pb-4">Media</h3>
          
          <div className="border-2 border-dashed border-slate-600 rounded-2xl p-12 text-center hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
            <UploadCloud className="w-12 h-12 text-slate-500 dark:text-slate-400 mx-auto mb-4" />
            <p className="text-slate-900 dark:text-white font-medium mb-1">Click to upload images</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">PNG, JPG up to 5MB</p>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl transition-colors flex items-center gap-2 font-medium disabled:opacity-50 shadow-lg shadow-primary/20">
            <Save className="w-5 h-5" /> {isLoading ? 'Saving...' : 'Submit Property'}
          </button>
        </div>

      </motion.form>
    </div>
  );
}
