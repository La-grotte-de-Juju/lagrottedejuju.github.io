"use client";

import React from 'react'; 
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion'; 
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';
import {
  Brush, BookOpen, Clapperboard,
  Link as LinkIcon, Users, Library, MoreHorizontal,
  Youtube, Twitter, MessageSquare, BookCopy,
} from "lucide-react";
import { usePathname } from 'next/navigation';

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

export function Header() {
  const pathname = usePathname();

  return (
    <>
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

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          </nav>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-4 p-4">
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.header>
    </>
  );
}

export default Header;
