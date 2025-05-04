// src/components/layout/StartupNavbar.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Link as LinkIcon, Menu, X, Plus } from 'lucide-react';
import { motion, AnimatePresence, MotionStyle } from 'framer-motion';

const StartupNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const progress = Math.min(window.scrollY / 50, 1);
      setScrollProgress(progress);
      setIsScrolled(progress > 0.8);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true);
    }, 100);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navVariants = {
    hidden: { y: -10, opacity: 0, scale: 0.98 },
    visible: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      } 
    }
  };

  const linkVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.05, 
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      } 
    },
    tap: { scale: 0.95 }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.05, 
        duration: 0.2,
        ease: "easeOut"
      }
    }),
  };

  const topSpacing = {
    paddingTop: `${Math.max(0, ((1 - scrollProgress) * 35))}px`,
  };

  const navbarStyle: MotionStyle = {
    padding: `${0.2 + ((1 - scrollProgress) * 0.2)}rem ${1 + ((1 - scrollProgress) * 0.5)}rem`,
    borderRadius: `${(1 - scrollProgress) * 1}rem`,
    width: `${scrollProgress * 100 + (1 - scrollProgress) * 70}%`,
    maxWidth: scrollProgress > 0.9 ? '100%' : `${(1 - scrollProgress) * 48 + 36}rem`,
    backgroundColor: `rgba(255, 255, 255, ${0.70 + scrollProgress * 0.15})`,
    backdropFilter: `blur(${8 + scrollProgress * 4}px)`,
    WebkitBackdropFilter: `blur(${8 + scrollProgress * 4}px)`,
    boxShadow: isScrolled 
      ? '0 1px 3px rgba(0, 0, 0, 0.05)' 
      : '0 4px 12px rgba(0, 0, 0, 0.07), 0 2px 6px rgba(0, 0, 0, 0.04)',
    transformOrigin: 'top center',
    transform: `scale(${1 - ((1 - scrollProgress) * 0.02)})`,
    position: 'relative' as const,
  };

  const mobileMenuStyle: MotionStyle = {
    borderRadius: '0.8rem',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    maxHeight: 'calc(80vh)',
    overflowY: 'auto' as const,
    maxWidth: '90vw',
    width: '350px',
  };

  const overlayStyle: MotionStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(3px)',
    WebkitBackdropFilter: 'blur(3px)',
    zIndex: 40,
  };

  return (
    <div 
      className={`fixed top-0 left-0 right-0 flex justify-center z-50 transition-all duration-500 ease-in-out`} 
      style={topSpacing}
    >
      <motion.nav
        className={`
          transition-all 
          duration-500
          ease-in-out
          flex items-center
          ${isMounted ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'}
          ${isScrolled ? 'border-b border-gray-200/50 dark:border-gray-800/50' : 'border border-gray-200/30 dark:border-gray-800/30'}
        `}
        initial="hidden"
        animate="visible"
        variants={navVariants}
        style={navbarStyle}
      >
        <div 
          className="container mx-auto transition-all duration-500 ease-in-out"
          style={{
            padding: `0 ${(scrollProgress * 0.5) + 0.25}rem`,
          }}
        >
          <div className="flex items-center justify-between h-full w-full py-1">
            <motion.div 
              className="flex-shrink-0"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/" className="flex items-center space-x-1.5">
                <Image
                  src="/images/juju-logo.webp"
                  alt="La Grotte de Juju Logo"
                  width={30}
                  height={30}
                  className="rounded-full transition-all hover:shadow-md"
                />
                <span className="font-bold text-sm text-gray-900 dark:text-white">
                  La Grotte de Juju
                </span>
              </Link>
            </motion.div>

            <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center z-10">
              <div className="flex items-center space-x-4">
                <motion.div
                  variants={linkVariants}
                  initial="idle"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link 
                    href="/communaute" 
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-2 py-1.5 rounded-md text-sm font-medium transition-all hover:bg-gray-100/40 dark:hover:bg-gray-800/40"
                  >
                    Communauté
                  </Link>
                </motion.div>
                
                <motion.div
                  variants={linkVariants}
                  initial="idle"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link 
                    href="/bibliotheque" 
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-2 py-1.5 rounded-md text-sm font-medium transition-all hover:bg-gray-100/40 dark:hover:bg-gray-800/40"
                  >
                    Bibliothèque
                  </Link>
                </motion.div>
              </div>
            </div>

            <div className="flex-shrink-0 flex items-center ml-auto">
              <motion.div
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMenu}
                  className="md:hidden text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-1 h-6 w-6 transition-all"
                  aria-label="Menu"
                >
                  <motion.div
                    animate={{ rotate: isMenuOpen ? 135 : 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    {isMenuOpen ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </motion.div>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="hidden md:block"
              >
                <Button
                  variant="default"
                  size="sm"
                  className="hidden md:flex bg-purple-600 hover:bg-purple-700 text-white text-xs h-6 px-1.5 transition-all duration-300 hover:shadow-md hover:shadow-purple-500/20"
                  asChild
                >
                  <Link href="/liens">
                    <LinkIcon className="mr-1 h-3 w-3" />
                    Liens
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <>
              <div 
                style={overlayStyle as React.CSSProperties} 
                onClick={toggleMenu}
                aria-label="Fermer le menu"
              />
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed z-50" 
                style={{
                  ...mobileMenuStyle,
                  top: '50%' as const,
                  left: '50%' as const,
                  transform: 'translate(-50%, -50%)' as const
                }}
              >
                <motion.div 
                  className="px-3 py-2.5 space-y-2 flex flex-col"
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div
                    custom={0}
                    variants={menuItemVariants}
                  >
                    <Link 
                      href="/communaute" 
                      className="text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-all hover:pl-4"
                      onClick={toggleMenu}
                    >
                      Communauté
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    custom={1}
                    variants={menuItemVariants}
                  >
                    <Link 
                      href="/bibliotheque" 
                      className="text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-all hover:pl-4"
                      onClick={toggleMenu}
                    >
                      Bibliothèque
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    custom={2}
                    variants={menuItemVariants}
                  >
                    <Link 
                      href="/liens" 
                      className="text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-all hover:pl-4"
                      onClick={toggleMenu}
                    >
                      <LinkIcon className="mr-2 h-3.5 w-3.5" />
                      Liens
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};

export default StartupNavbar;
