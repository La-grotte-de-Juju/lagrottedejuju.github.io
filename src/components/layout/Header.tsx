"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeaderButton } from "@/components/ui/header-button";
import { 
  Menu, X, AlertTriangle, Bug, LayoutGrid, 
  Brush, BookOpen, Clapperboard, Youtube, ChevronRight, Home, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import styles from './header.module.css';
import { usePathname } from 'next/navigation';

const SITE_VERSION = "testchannel-verbêta-1.2.0";
const DEV_TITLE = "Site en Développement";
const DEV_MESSAGE = "Certaines fonctionnalités peuvent ne pas être disponibles.";
const DEV_IMAGE = "/images/dev%20img/indev.webp";

const menuItems = [
  {
    title: "Série",
    href: "/series",
    icon: Clapperboard,
    submenu: [
      { title: "Batlife", href: "/series/batlife" },
      { title: "Chasseurs de Sorciers", href: "/series/chasseurs-de-sorciers" },
      { title: "Tower of Babel", href: "/series/tower-of-babel" },
      { title: "Templier vs Sorcier", href: "/series/templier-vs-sorcier" },
      { title: "Prism", href: "/series/prism" },
    ],
  },
  {
    title: "Dessins et BD",
    href: "/dessins",
    icon: Brush,
    submenu: [
      { title: "Strip", href: "/dessins/strip" },
      { title: "Grand Strip", href: "/dessins/grand-strip" },
      { title: "Batlife Comics", href: "/dessins/batlife-comics" },
      { title: "Autres", href: "/dessins/autres" },
      { title: "Fan-art", href: "/dessins/fan-art" },
    ],
  },
  {
    title: "Univers de la grotte",
    href: "/univers",
    icon: BookOpen,
    submenu: [
      { title: "Le lore", href: "/univers/lore" },
      { title: "Fiches des personnages", href: "/univers/personnages" },
    ],
  },
];

// Shared spring transition for layout and appearance
const capsuleSpringTransition = {
  type: "spring",
  stiffness: 400,
  damping: 35,
};

// Amélioration des variants pour le style Dynamic Island
const capsuleVariants = {
  hidden: { 
    y: -100, 
    opacity: 0 
  },
  visible: (isMegaMenuOpen: boolean) => ({
    y: 0,
    opacity: 1,
    width: isMegaMenuOpen ? "auto" : "auto",
    height: isMegaMenuOpen ? "auto" : "56px",
    borderRadius: isMegaMenuOpen ? "1.5rem" : "28px",
    backgroundColor: isMegaMenuOpen ? "hsla(0, 0%, 98%, 0.9)" : "hsla(0, 0%, 100%, 0.8)", 
    backdropFilter: isMegaMenuOpen ? "blur(18px) saturate(180%)" : "blur(16px) saturate(180%)",
    boxShadow: isMegaMenuOpen 
      ? "0 10px 25px -5px hsla(0, 0%, 0%, 0.15), 0 8px 10px -6px hsla(0, 0%, 0%, 0.1)" 
      : "0 4px 15px -3px hsla(0, 0%, 0%, 0.1), 0 2px 6px -4px hsla(0, 0%, 0%, 0.1)",
    border: isMegaMenuOpen ? "1px solid hsla(0, 0%, 0%, 0.08)" : "1px solid hsla(0, 0%, 0%, 0.05)",
    transition: {
      y: { type: 'spring', stiffness: 100, damping: 25, delay: 0.5 }, // Ralenti et adouci l'entrée
      opacity: { duration: 0.5, delay: 0.5 }, // Fondu plus lent
      width: { type: 'spring', stiffness: 300, damping: 35 }, // Redimensionnement plus lent et doux
      height: { type: 'spring', stiffness: 300, damping: 35 }, // Redimensionnement plus lent et doux
      borderRadius: { type: 'spring', stiffness: 300, damping: 35 }, // Changement de forme plus lent et doux
      default: { duration: 0.5 } // Transition par défaut plus lente
    }
  }),
};

// Animation pour le bouton de défilement séparé
const scrollButtonVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.1, // Commence très petit
    y: -5,      // Légère translation pour l'effet
    originX: 0.5, // Point d'origine pour le scale
    originY: 0.5
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      delay: 0.7
    }
  },
  hover: {
    scale: 1.07, // Légèrement plus subtil que 1.1
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 20
    }
  },
  exit: { // Animation de sortie améliorée pour se réduire
    opacity: 0,
    scale: 0.1, // Réduit à une petite taille
    y: -5,      // Légère translation
    transition: { duration: 0.2, ease: "easeIn" } // Transition rapide et nette
  }
};

// Animation pour l'emplacement de future fonctionnalité
const futureFunctionVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    x: 20 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      delay: 0.3
    }
  },
  hover: { // Ajout de l'effet hover
    scale: 1.07,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 20
    }
  }
};

// Modifier les variants pour synchroniser les animations
const backdropVariants = {
  open: {
    opacity: 1,
    transition: {
      duration: 0.3
    }
  },
  closed: {
    opacity: 0,
    transition: {
      duration: 0.3
    }
  }
};

// Remplacer les contentVariants existants par cette version améliorée
const contentVariants = {
  open: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      bounce: 0.1,
      duration: 0.5,
      delayChildren: 0.1,
      staggerChildren: 0.05
    }
  },
  closed: {
    scale: 0.95,
    opacity: 0,
    y: -5,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.4,
      staggerChildren: 0.05,
      staggerDirection: -1,
      scale: { duration: 0.25, ease: "easeIn" },
      y: { duration: 0.2, ease: "easeIn" },
      opacity: { duration: 0.25, ease: "easeIn" }
    }
  }
};

// Ajouter ces variants pour les éléments enfants
const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  },
  closed: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.2
    }
  }
};

const devCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

export function Header() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [showDevCard, setShowDevCard] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [showScrollArrow, setShowScrollArrow] = useState(true);
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setIsMegaMenuOpen(false);
    setShowDevCard(true);
    setIsClosing(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollArrow(false);
      } else {
        setShowScrollArrow(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMegaMenu = () => {
    setIsMegaMenuOpen(!isMegaMenuOpen);
  };

  const dismissDevCard = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowDevCard(false);
      setIsClosing(false);
    }, 500);
  };

  const reportBug = () => {
    // Ensure window is defined (only run on client-side)
    if (typeof window !== 'undefined') { 
      window.open('https://form.typeform.com/to/DEoa7nkM', '_blank');
    }
  };

  const dynamicTransition = shouldReduceMotion 
    ? { duration: 0 }
    : capsuleSpringTransition;

  return (
    <>
      <AnimatePresence mode="wait">
        {showDevCard && (
          <motion.div 
            className="fixed bottom-4 right-4 z-[100] w-80 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 overflow-hidden"
            initial="hidden"
            animate={isClosing ? "exit" : "visible"}
            exit="exit"
            variants={devCardVariants}
            key={pathname}
          >
            <div className="relative h-32 w-full overflow-hidden">
              <Image 
                src={DEV_IMAGE} 
                alt="Site en développement"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-1">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{DEV_TITLE}</h3>
              </div>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{DEV_MESSAGE}</p>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <p>Version actuelle : {SITE_VERSION}</p>
              </div>
              <br />
              <div className="flex justify-between">
                <HeaderButton 
                  variant="outline" 
                  size="sm" 
                  onClick={reportBug}
                  className="flex items-center gap-2"
                >
                  <Bug className="h-4 w-4" />
                  Signaler un bug
                </HeaderButton>
                <HeaderButton 
                  variant="destructive" 
                  size="sm" 
                  onClick={dismissDevCard}
                  className="ml-2"
                >
                  Fermer
                </HeaderButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMegaMenuOpen && (
          <motion.div
            className={styles.megaMenuBackdrop}
            initial="closed"
            animate="open"
            exit="closed"
            variants={backdropVariants}
            onClick={toggleMegaMenu}
          />
        )}
      </AnimatePresence>

      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-auto flex items-center justify-center">
        {/* Navbar capsule principale - style Dynamic Island */}
        <motion.div
          className={`flex items-center justify-between ${styles.navbarCapsule} px-3`}
          layout
          initial="hidden"
          animate="visible"
          variants={capsuleVariants}
          custom={isMegaMenuOpen}
          transition={dynamicTransition}
        >
          <div className="flex h-14 items-center justify-between">
            <Link href="/" className="flex items-center" onClick={() => isMegaMenuOpen && toggleMegaMenu()}>
              <motion.div 
                layout="position"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }} // Ajout de l'effet hover ici
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Image
                  src="/images/juju-logo.webp"
                  alt="La grotte de Juju"
                  width={40}
                  height={40}
                  className="rounded-full"
                  priority
                />
              </motion.div>
            </Link>

            <HeaderButton
              variant="ghost"
              className={`${styles.headerButtonCapsule} header-btn ml-4 px-3`}
              onClick={toggleMegaMenu}
              aria-label={isMegaMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              glowEffect={false}
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={isMegaMenuOpen ? "x" : "grid"}
                  layout
                  initial={{ opacity: 0, scale: 0.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  style={{ originX: 0.5, originY: 0.5 }}
                >
                  {isMegaMenuOpen ? (
                    <X className="h-5 w-5 text-gray-800" />
                  ) : (
                    <div className="flex items-center text-gray-700">
                      <LayoutGrid className="h-5 w-5 mr-1.5" />
                      <span className="text-sm font-medium">Menu</span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </HeaderButton>
          </div>

          <AnimatePresence mode="wait">
            {isMegaMenuOpen && (
              <motion.div
                className={styles.megaMenuContent}
                initial="closed"
                animate="open"
                exit="closed"
                variants={contentVariants}
              >
                <div className={styles.megaMenuGrid}>
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <motion.div 
                        key={item.title} 
                        className={styles.megaMenuColumn}
                        variants={itemVariants}
                      >
                        <h3 className={styles.megaMenuTitle}>
                          <Icon className="h-5 w-5 mr-2 text-primary" />
                          {item.title}
                        </h3>
                        {item.submenu && item.submenu.map((subItem) => (
                          <motion.div
                            key={subItem.title}
                            variants={itemVariants}
                          >
                            <Link
                              href={subItem.href}
                              className={`${styles.megaMenuLink} group`}
                              onClick={toggleMegaMenu}
                            >
                              {subItem.title}
                              <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            </Link>
                          </motion.div>
                        ))}
                        {!item.submenu && item.href && (
                          <motion.div variants={itemVariants}>
                            <Link
                              href={item.href}
                              className={`${styles.megaMenuLink} group`}
                              onClick={toggleMegaMenu}
                            >
                              {item.title}
                            </Link>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bouton de défilement séparé - maintenant à droite de la pillule */}
        <AnimatePresence>
          {showScrollArrow && !isMegaMenuOpen && (
            <motion.div 
              className="ml-2 relative"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={scrollButtonVariants}
              whileHover="hover"
              onClick={() => window.scrollTo({ 
                top: window.innerHeight, 
                behavior: 'smooth'
              })}
            >
              <div className="h-10 w-10 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-[0_2px_10px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.3)] border border-white/40 dark:border-gray-700/40 flex items-center justify-center cursor-pointer">
                <ChevronDown className="h-5 w-5 text-primary/90" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Emplacement pour future fonctionnalité - apparaît seulement quand le mega menu est ouvert */}
        <AnimatePresence>
          {isMegaMenuOpen && (
            <motion.div
              className="ml-2 relative"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.8, x: 20, transition: { duration: 0.2 } }}
              variants={futureFunctionVariants}
              whileHover="hover"
            >
              <div className="h-10 w-10 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-[0_2px_10px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.3)] border border-white/40 dark:border-gray-700/40 flex items-center justify-center cursor-pointer opacity-50">
                {/* Espace réservé pour une future fonctionnalité */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

export default Header;
