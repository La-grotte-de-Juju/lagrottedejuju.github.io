"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';
import { HeaderButton } from "@/components/ui/header-button";
import {
  AlertTriangle, Bug,
  Brush, BookOpen, Clapperboard,
  Link as LinkIcon, Users, Library, MoreHorizontal,
  Youtube, Twitter, MessageSquare, BookCopy,
} from "lucide-react";
import { usePathname } from 'next/navigation';

const SITE_VERSION = "testchannel-verbêta-1.3.0";
const DEV_TITLE = "Site en Développement";
const DEV_MESSAGE = "Certaines fonctionnalités peuvent ne pas être disponibles.";
const DEV_IMAGE = "/images/dev%20img/indev.webp";

const moreMenuItems = [
  {
    title: "Série",
    href: "/series",
    icon: Clapperboard,
    submenu: [
      { title: "Batlife", href: "/series/batlife", description: "Les aventures animées de Batlife.", src: "/images/animation/Strip-grotte-Visual.gif" },
      { title: "Chasseurs de Sorciers", href: "/series/chasseurs-de-sorciers", description: "Une série sur la traque des sorciers.", src: "/images/dev%20img/1.webp" },
      { title: "Tower of Babel", href: "/series/tower-of-babel", description: "L'ascension de la tour mystique.", src: "/images/dev%20img/2.webp" },
      { title: "Templier vs Sorcier", href: "/series/templier-vs-sorcier", description: "Le conflit éternel.", src: "/images/dev%20img/3.webp" },
      { title: "Prism", href: "/series/prism", description: "Une autre série captivante.", src: "/images/dev%20img/4.webp" },
    ],
  },
  {
    title: "Dessins et BD",
    href: "/dessins",
    icon: Brush,
    submenu: [
      { title: "Strip", href: "/dessins/strip", description: "Courtes bandes dessinées.", src: "/images/batlife-comic-1.jpg" },
      { title: "Grand Strip", href: "/dessins/grand-strip", description: "Bandes dessinées plus longues.", src: "/images/batlife-comic-2.jpg" },
      { title: "Batlife Comics", href: "/dessins/batlife-comics", description: "Les comics dédiés à Batlife.", src: "/images/batlife-animation.png" },
      { title: "Autres", href: "/dessins/autres", description: "Diverses illustrations.", src: "/images/dev%20img/5.webp" },
      { title: "Fan-art", href: "/dessins/fan-art", description: "Hommages artistiques.", src: "/images/dev%20img/6.webp" },
    ],
  },
  {
    title: "Univers de la grotte",
    href: "/univers",
    icon: BookOpen,
    submenu: [
      { title: "Le lore", href: "/univers/lore", description: "L'histoire et les règles de l'univers.", src: "/images/Juju.webp" },
      { title: "Fiches des personnages", href: "/univers/personnages", description: "Découvrez les protagonistes.", src: "/images/animation/fichepersos.gif" },
    ],
  },
];

const devCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

export function Header() {
  const [showDevCard, setShowDevCard] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setShowDevCard(true);
    setIsClosing(false);
  }, [pathname]);

  const dismissDevCard = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowDevCard(false);
      setIsClosing(false);
    }, 500);
  };

  const reportBug = () => {
    if (typeof window !== 'undefined') {
      window.open('https://form.typeform.com/to/DEoa7nkM', '_blank');
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

      <motion.header>
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: -10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center"
            >
              <Image
                src="/images/juju-logo.webp"
                alt="Accueil"
                width={32}
                height={32}
                className="rounded-full"
              />
            </motion.div>
          </Link>

          {/* Navigation pour les écrans larges */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {/* ... autres liens ... */}
          </nav>

          {/* Menu pour les écrans mobiles */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-4 p-4">
                {/* ... autres liens mobiles ... */}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.header>
    </>
  );
}

export default Header;
