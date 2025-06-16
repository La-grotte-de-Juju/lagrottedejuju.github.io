'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, Eye } from 'lucide-react';
import AnimateOnScroll from '@/components/animation/AnimateOnScroll';
import Image from 'next/image';

interface BDFolder {
  name: string;
  path: string;
  coverImage?: string;
  pages?: string[];
  description?: string;
  createdAt?: string;
}

interface BDGalleryProps {
  folders: BDFolder[];
  onFolderSelect: (folder: BDFolder) => void;
}

export function BDGallery({ folders, onFolderSelect }: BDGalleryProps) {
  // Filtrer les dossiers vides (sans pages) et les trier par date
  const validFolders = folders
    .filter(folder => folder.pages && folder.pages.length > 0)
    .sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  
  if (validFolders.length === 0) {
    return (
      <div className="text-center py-20">
        <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Aucune BD disponible</h3>
        <p className="text-muted-foreground">
          Les bandes dessinées seront bientôt disponibles !
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {validFolders.map((folder, index) => (
        <AnimateOnScroll
          key={folder.path}
          animation="floating-card"
          delay={0.1 * (index + 1)}
          intensity={0.8}
        >
          <BDCard 
            folder={folder}
            onSelect={() => onFolderSelect(folder)}
          />
        </AnimateOnScroll>
      ))}
    </div>
  );
}

interface BDCardProps {
  folder: BDFolder;
  onSelect: () => void;
}

function BDCard({ folder, onSelect }: BDCardProps) {
  const pageCount = folder.pages?.length || 0;
  const formattedDate = folder.createdAt 
    ? new Date(folder.createdAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Date inconnue';

  return (
    <motion.div
      className="group cursor-pointer h-full"
      whileHover={{ y: -8 }}
      transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
      onClick={onSelect}
    >
      <Card className="h-full bg-white dark:bg-gray-900/95 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
        {/* Image de couverture */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {folder.coverImage ? (
            <Image
              src={folder.coverImage}
              alt={folder.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-primary/60" />
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badge nombre de pages */}
          {pageCount > 0 && (
            <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
              {pageCount} pages
            </div>
          )}

          {/* Informations au hover */}
          <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-2 text-sm">
              <Eye className="w-4 h-4" />
              <span>Cliquer pour lire</span>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {folder.name}
            </h3>
            
            {folder.description && (
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-3">
                {folder.description}
              </p>
            )}
          </div>

          {/* Métadonnées */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            {pageCount > 0 && (
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{pageCount} pages</span>
              </div>
            )}
          </div>

          {/* Bouton d'action */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="pt-2"
          >
            <Button
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:shadow-lg text-white border-0 font-medium py-3 rounded-xl transition-all duration-300"
              size="sm"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Lire la BD
            </Button>
          </motion.div>
        </div>

        {/* Effet de brillance */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000" />
        </div>
      </Card>
    </motion.div>
  );
}
