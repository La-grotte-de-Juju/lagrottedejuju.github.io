"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, AlertTriangle, Bug } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from './header.module.css';
import { usePathname } from 'next/navigation';
// Version du site
const SITE_VERSION = "testchannel-verbêta-1.0"; // La version actuelle du site
const DEV_TITLE = "Site en Développement";
const DEV_MESSAGE = "Certaines fonctionnalités peuvent ne pas être disponibles.";
const DEV_IMAGE = "/images/dev%20img/indev.webp"; // Chemin vers l'image de développement

const menuItems = [
  {
    title: "Dessins et BD",
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
    submenu: [
      { title: "Le lore", href: "/univers/lore" },
      { title: "Fiches des personnages", href: "/univers/personnages" },
    ],
  },
  {
    title: "Série",
    submenu: [
      { title: "Batlife", href: "/series/batlife" },
      { title: "Chasseurs de Sorciers", href: "/series/chasseurs-de-sorciers" },
      { title: "Tower of Babel", href: "/series/tower-of-babel" },
      { title: "Templier vs Sorcier", href: "/series/templier-vs-sorcier" },
      { title: "Prism", href: "/series/prism" },
    ],
  },
  {
    title: "Actu YouTube",
    submenu: [
      { title: "Dernières vidéos", href: "/actu/dernieres-videos" },
      { title: "YouTube bonus", href: "/actu/youtube-bonus" },
      { title: "Rediff Live", href: "/actu/rediff-live" },
    ],
  },
];

export function Header() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showDevCard, setShowDevCard] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Afficher la carte à chaque changement de route
    setShowDevCard(true);
    setIsClosing(false);
  }, [pathname]); // Se déclenche à chaque changement de chemin URL

  const toggleMenu = (menuTitle: string) => {
    setActiveMenu(activeMenu === menuTitle ? null : menuTitle);
  };

  const dismissDevCard = () => {
    // Déclencher l'animation de fermeture
    setIsClosing(true);
    
    // Attendre que l'animation soit terminée avant de cacher complètement la carte
    setTimeout(() => {
      setShowDevCard(false);
      setIsClosing(false);
    }, 500); // Augmentation du délai pour permettre l'animation complète
  };

  const reportBug = () => {
    // Ici vous pourriez ouvrir un formulaire de rapport de bug ou rediriger vers une page dédiée
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSd6ue-eDoyzwTqSxM_fczARh9U-O2VOH5l6J0un5HDs3SntaQ/viewform?usp=dialog', '_blank');
  };

  // Animation variants pour les éléments du menu
  const menuItemVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
    }
  };

  // Animation variants pour la carte de développement
  const cardVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300 }
    },
    exit: { 
      opacity: 1,
      y: 500, // Valeur beaucoup plus grande pour assurer que la carte sorte complètement de l'écran
      transition: { type: "tween", ease: "easeIn", duration: 0.4 } // Légère augmentation de la durée
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showDevCard && (
          <motion.div 
            className="fixed bottom-4 right-4 z-[100] w-80 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 overflow-hidden"
            initial="hidden"
            animate={isClosing ? "exit" : "visible"}
            exit="exit"
            variants={cardVariants}
            key={pathname} // Force la réanimation à chaque changement de route
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={reportBug}
                  className="flex items-center gap-2"
                >
                  <Bug className="h-4 w-4" />
                  Signaler un bug
                </Button>
                
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={dismissDevCard}
                  className="ml-2"
                >
                  Fermer
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/juju-logo.webp"
                alt="La grotte de Juju"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="font-bold text-xl hidden sm:inline-block">La Grotte de Juju</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map((item, index) => (
              <div
                key={item.title}
                className="relative"
                onMouseEnter={() => setActiveMenu(item.title)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <motion.div
                  whileHover="hover"
                  whileTap="tap"
                  variants={menuItemVariants}
                >
                  <Button 
                    variant="ghost" 
                    className={`font-medium ${styles.headerButton}`}
                  >
                    <span className="relative z-10">{item.title}</span>
                  </Button>
                </motion.div>
                
                {activeMenu === item.title && (
                  <motion.div 
                    className="absolute left-0 top-full w-48 py-2 bg-background rounded-md shadow-md z-50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {item.submenu.map((subItem, idx) => (
                      <motion.div
                        key={subItem.title} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Link
                          href={subItem.href}
                          className="block px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                        >
                          {subItem.title}
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className={styles.headerButton}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {menuItems.map((item, index) => (
                  <div key={item.title} className="space-y-2">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start font-medium text-lg ${styles.headerButton}`}
                      onClick={() => toggleMenu(item.title)}
                    >
                      {item.title}
                    </Button>
                    
                    {activeMenu === item.title && (
                      <motion.div 
                        className="ml-4 flex flex-col gap-1"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                      >
                        {item.submenu.map((subItem, idx) => (
                          <motion.div
                            key={subItem.title}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <Link
                              href={subItem.href}
                              className="py-2 px-4 hover:bg-accent hover:text-accent-foreground rounded-md block"
                            >
                              {subItem.title}
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
}

export default Header;
