'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Building2, Menu, X, User } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'glass dark:glass-dark py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <Building2 className="w-8 h-8 text-primary group-hover:animate-bounce" />
          <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-primary transition-colors">
            PropEx
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/properties/buy" className="text-slate-700 dark:text-slate-200 hover:text-primary transition-colors font-medium">Buy</Link>
          <Link href="/properties/rent" className="text-slate-700 dark:text-slate-200 hover:text-primary transition-colors font-medium">Rent</Link>
          <Link href="/agents" className="text-slate-700 dark:text-slate-200 hover:text-primary transition-colors font-medium">Agents</Link>
          <Link href="/contact" className="text-slate-700 dark:text-slate-200 hover:text-primary transition-colors font-medium">Contact</Link>
          
          {mounted ? (
            isAuthenticated ? (
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Link href="/dashboard" className="text-slate-700 dark:text-slate-200 hover:text-primary flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>{user?.firstName}</span>
                </Link>
                <button onClick={logout} className="px-4 py-2 rounded-lg border border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-800 transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Link href="/login" className="text-slate-700 dark:text-slate-200 hover:text-primary font-medium">Login</Link>
                <Link href="/register" className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-all transform hover:scale-105 shadow-lg shadow-primary/30">
                  Sign Up
                </Link>
              </div>
            )
          ) : (
            <div className="flex items-center gap-4 opacity-0 w-32 h-10"></div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-slate-900 dark:text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden glass dark:glass-dark border-t border-slate-200 dark:border-slate-700/50 mt-4 px-6 py-4 flex flex-col gap-4 absolute w-full"
        >
          <Link href="/properties/buy" className="text-slate-700 dark:text-slate-200">Buy</Link>
          <Link href="/properties/rent" className="text-slate-700 dark:text-slate-200">Rent</Link>
          {mounted && (
            isAuthenticated ? (
              <button onClick={logout} className="text-left text-slate-700 dark:text-slate-200">Logout</button>
            ) : (
              <Link href="/login" className="text-slate-700 dark:text-slate-200">Login</Link>
            )
          )}
        </motion.div>
      )}
    </motion.nav>
  );
}
