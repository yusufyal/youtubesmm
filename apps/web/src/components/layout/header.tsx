'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Play, ArrowRight, Zap, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/theme-context';

const navigation = [
  { name: 'Buy YouTube Views', href: '/services/youtube-views' title: 'Buy YouTube Views'},
  { name: 'Buy YouTube Subscribers', href: '/services/youtube-subscribers' title: 'Buy YouTube Subscribers'},
  { name: 'Buy YouTube Watch Time', href: '/services/youtube-watch-time' title: 'Buy YouTube Watch Time'},
  { name: 'Buy YouTube Likes', href: '/services/youtube-likes' title: 'Buy YouTube Likes'},
  { name: 'Buy YouTube Comments', href: '/services/youtube-comments' title: 'Buy YouTube Comments'},
  { name: 'FAQ', href: '/faq' title: 'FAQ'},
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? theme === 'dark'
            ? 'bg-[#0a0a0f]/90 backdrop-blur-lg border-b border-white/5 shadow-lg'
            : 'bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm'
          : theme === 'dark'
            ? 'bg-[#0a0a0f]/50 backdrop-blur-sm'
            : 'bg-white/50 backdrop-blur-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="container flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-neon-pink to-neon-purple shadow-glow-sm"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <Play className="h-5 w-5 text-white fill-white" />
          </motion.div>
          <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            AYN<span className="text-gradient">YouTube</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-1">
          {navigation.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors group whitespace-nowrap ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.name}
                {/* Hover indicator */}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-neon-pink to-neon-purple group-hover:w-1/2 transition-all duration-300" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex md:items-center md:gap-3">
          {/* Theme Toggle */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <motion.button
              onClick={toggleTheme}
              className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                theme === 'dark'
                  ? 'bg-white/10 hover:bg-white/20'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-5 w-5 text-yellow-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-5 w-5 text-gray-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/dashboard">
              <motion.button
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <User className="h-4 w-4" />
                Account
              </motion.button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/services">
              <motion.button
                className="relative overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-glow-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Button gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-pink to-neon-purple" />
                {/* Content */}
                <span className="relative z-10 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Get Started
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Mobile Actions */}
        <div className="lg:hidden flex items-center gap-2">
          {/* Mobile Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              theme === 'dark'
                ? 'bg-white/10 hover:bg-white/20'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="h-5 w-5 text-yellow-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="h-5 w-5 text-gray-600" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Mobile Menu Button */}
          <motion.button
            className={`relative w-10 h-10 rounded-xl flex items-center justify-center ${
              theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className={`h-5 w-5 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className={`h-5 w-5 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className={`lg:hidden absolute top-full left-0 right-0 backdrop-blur-lg border-b shadow-lg ${
              theme === 'dark'
                ? 'bg-[#0a0a0f]/95 border-white/5'
                : 'bg-white/95 border-gray-200'
            }`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container px-4 py-6 space-y-2">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      theme === 'dark'
                        ? 'text-gray-300 hover:text-white hover:bg-white/5'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                className={`pt-4 mt-4 border-t space-y-3 ${
                  theme === 'dark' ? 'border-white/10' : 'border-gray-200'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <button className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border font-medium transition-colors ${
                    theme === 'dark'
                      ? 'border-white/10 text-gray-300 hover:bg-white/5'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}>
                    <User className="h-4 w-4" />
                    Account
                  </button>
                </Link>
                <Link
                  href="/services"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-neon-pink to-neon-purple text-white font-semibold shadow-glow-md">
                    <Zap className="h-4 w-4" />
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
