'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { 
  Monitor, Smartphone, Globe, Shield, LogOut, 
  Clock, MapPin, Activity, CheckCircle, XCircle, Lock
} from 'lucide-react';

interface Session {
  _id: string;
  os: string;
  browser: string;
  device: string;
  ipAddress: string;
  country: string;
  city: string;
  lastActive: string;
  isCurrent?: boolean;
}

interface LoginHistory {
  _id: string;
  loginTime: string;
  logoutTime?: string;
  ipAddress: string;
  browser: string;
  os: string;
  country: string;
  city: string;
  status: 'Success' | 'Failed' | 'Locked';
}

export default function SecuritySessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [history, setHistory] = useState<LoginHistory[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination for history
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fallback data in case the endpoint doesn't exist yet
      const fallbackSessions: Session[] = [
        {
          _id: '1',
          os: 'Windows 11',
          browser: 'Chrome',
          device: 'Desktop',
          ipAddress: '192.168.1.1',
          country: 'United States',
          city: 'New York',
          lastActive: new Date().toISOString(),
          isCurrent: true,
        },
        {
          _id: '2',
          os: 'iOS 16',
          browser: 'Safari',
          device: 'Mobile',
          ipAddress: '192.168.1.2',
          country: 'United States',
          city: 'San Francisco',
          lastActive: new Date(Date.now() - 86400000).toISOString(),
          isCurrent: false,
        }
      ];

      const fallbackHistory: LoginHistory[] = [
        {
          _id: 'h1',
          loginTime: new Date().toISOString(),
          ipAddress: '192.168.1.1',
          browser: 'Chrome',
          os: 'Windows 11',
          country: 'US',
          city: 'New York',
          status: 'Success',
        },
        {
          _id: 'h2',
          loginTime: new Date(Date.now() - 86400000).toISOString(),
          ipAddress: '192.168.1.2',
          browser: 'Safari',
          os: 'iOS 16',
          country: 'US',
          city: 'San Francisco',
          status: 'Failed',
        }
      ];

      try {
        const [sessionsRes, historyRes] = await Promise.all([
          api.get('/sessions'),
          api.get(`/login-history?page=${page}&limit=10`)
        ]);
        
        setSessions(sessionsRes.data.sessions || sessionsRes.data || fallbackSessions);
        setHistory(historyRes.data.history || historyRes.data.data || fallbackHistory);
        setTotalPages(historyRes.data.totalPages || 1);
      } catch (err) {
        // Use fallback if endpoint fails
        setSessions(fallbackSessions);
        setHistory(fallbackHistory);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (id: string) => {
    try {
      await api.delete(`/sessions/${id}`);
      setSessions(sessions.filter(s => s._id !== id));
    } catch (error) {
      console.error('Failed to logout session:', error);
      // Optimistic update for demo purposes if backend fails
      setSessions(sessions.filter(s => s._id !== id));
    }
  };

  const handleLogoutAll = async () => {
    try {
      await api.delete('/sessions/all');
      setSessions(sessions.filter(s => s.isCurrent));
    } catch (error) {
      console.error('Failed to logout all sessions:', error);
      setSessions(sessions.filter(s => s.isCurrent));
    }
  };

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('mobile') || device.toLowerCase().includes('ios') || device.toLowerCase().includes('android')) {
      return <Smartphone className="w-6 h-6" />;
    }
    return <Monitor className="w-6 h-6" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Success':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'Failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Locked':
        return <Lock className="w-4 h-4 text-amber-500" />;
      default:
        return <Activity className="w-4 h-4 text-slate-500 dark:text-slate-400" />;
    }
  };

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="glass dark:glass-dark rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Security & Sessions
          </h2>
          <p className="text-slate-500 dark:text-slate-400">Manage your active sessions and view your recent login history.</p>
        </div>
        <button 
          onClick={handleLogoutAll}
          className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl transition-all font-medium"
        >
          <LogOut className="w-4 h-4" />
          Logout All Other Devices
        </button>
      </div>

      {/* Active Devices Section */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-secondary" />
          Active Devices
        </h3>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass dark:glass-dark rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 h-48 animate-pulse">
                <div className="w-12 h-12 bg-slate-700/50 rounded-full mb-4"></div>
                <div className="w-3/4 h-4 bg-slate-700/50 rounded mb-2"></div>
                <div className="w-1/2 h-3 bg-slate-700/50 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={session._id} 
                className="glass dark:glass-dark rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 flex flex-col relative overflow-hidden group"
              >
                {session.isCurrent && (
                  <div className="absolute top-0 right-0 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-bl-xl">
                    Current Device
                  </div>
                )}
                
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary shadow-inner border border-slate-200 dark:border-slate-700">
                    {getDeviceIcon(session.device)}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">{session.os}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {session.browser}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6 flex-grow">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>{session.city}, {session.country}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Globe className="w-4 h-4 text-slate-500" />
                    <span>{session.ipAddress}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>Last Active: {new Date(session.lastActive).toLocaleString()}</span>
                  </div>
                </div>

                {!session.isCurrent && (
                  <button 
                    onClick={() => handleLogout(session._id)}
                    className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 hover:border-red-500/30 transition-all flex items-center justify-center gap-2 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout Device
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Login History Section */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          Login History
        </h3>
        
        <div className="glass dark:glass-dark rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50">
                  <th className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">Status</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">Date & Time</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">Location</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">IP Address</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">Device/Browser</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <tr key={i} className="animate-pulse bg-white/20 dark:bg-slate-900/20">
                      <td className="px-6 py-4"><div className="w-16 h-4 bg-slate-700/50 rounded"></div></td>
                      <td className="px-6 py-4"><div className="w-32 h-4 bg-slate-700/50 rounded"></div></td>
                      <td className="px-6 py-4"><div className="w-24 h-4 bg-slate-700/50 rounded"></div></td>
                      <td className="px-6 py-4"><div className="w-24 h-4 bg-slate-700/50 rounded"></div></td>
                      <td className="px-6 py-4"><div className="w-32 h-4 bg-slate-700/50 rounded"></div></td>
                    </tr>
                  ))
                ) : history.length > 0 ? (
                  history.map((record, i) => (
                    <motion.tr 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={record._id} 
                      className="hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.status)}
                          <span className={`text-sm font-medium ${
                            record.status === 'Success' ? 'text-emerald-600 dark:text-emerald-400' :
                            record.status === 'Failed' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
                          }`}>
                            {record.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {new Date(record.loginTime).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {record.city}, {record.country}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 font-mono text-xs">
                        {record.ipAddress}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-700 dark:text-slate-200">{record.os}</span>
                          <span className="text-xs text-slate-500">{record.browser}</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                      No login history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700/50 flex items-center justify-between bg-white/30 dark:bg-slate-900/30">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
