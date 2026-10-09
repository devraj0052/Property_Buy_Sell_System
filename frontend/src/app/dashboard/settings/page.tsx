'use client';

import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Bell, Shield, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToastStore } from '@/store/toastStore';

export default function SettingsPage() {
  const { user, updateProfile, changePassword } = useAuthStore();
  const { addToast } = useToastStore();
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileData, setProfileData] = useState({ firstName: '', lastName: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({ firstName: user.firstName, lastName: user.lastName });
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile(profileData);
      addToast('Profile updated successfully!', 'success');
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast('New passwords do not match', 'error');
      return;
    }
    
    setIsLoading(true);
    try {
      await changePassword({ 
        currentPassword: passwordData.currentPassword, 
        newPassword: passwordData.newPassword 
      });
      addToast('Password updated successfully!', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Account Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your profile, security, and preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Settings Navigation */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="glass dark:glass-dark rounded-2xl border border-slate-200 dark:border-slate-700/50 p-2 flex flex-col gap-1">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-left ${activeTab === 'profile' ? 'bg-primary text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <User className="w-5 h-5" /> Profile Information
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-left ${activeTab === 'security' ? 'bg-primary text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <Shield className="w-5 h-5" /> Password & Security
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-left ${activeTab === 'notifications' ? 'bg-primary text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <Bell className="w-5 h-5" /> Notifications
            </button>
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="glass dark:glass-dark rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 md:p-8"
          >
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Profile Information</h2>
                <form className="flex flex-col gap-6" onSubmit={handleUpdateProfile}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">First Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input type="text" value={profileData.firstName} onChange={(e) => setProfileData({...profileData, firstName: e.target.value})} required className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Last Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input type="text" value={profileData.lastName} onChange={(e) => setProfileData({...profileData, lastName: e.target.value})} required className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input type="email" defaultValue={user?.email} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-500 dark:text-slate-400 cursor-not-allowed" disabled />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Email address cannot be changed. Contact support if needed.</p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700/50 flex justify-end">
                    <button type="submit" disabled={isLoading} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50">
                      <Save className="w-5 h-5" /> {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Password & Security</h2>
                <form className="flex flex-col gap-6" onSubmit={handleChangePassword}>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} required placeholder="••••••••" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} required minLength={6} placeholder="••••••••" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Confirm New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} required minLength={6} placeholder="••••••••" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700/50 flex justify-end">
                    <button type="submit" disabled={isLoading} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50">
                      <Save className="w-5 h-5" /> {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Notification Preferences</h2>
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-medium">Email Alerts</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Receive updates about new properties matching your search.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-medium">Marketing Communications</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Receive occasional promotional emails and newsletters.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
