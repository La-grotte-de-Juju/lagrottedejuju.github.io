'use client';

import { useState, useEffect } from 'react';
import AnimateOnScroll from '@/components/animation/AnimateOnScroll';
import { motion } from 'framer-motion';
import { BDGallery } from '@/components/bd/BDGallery';
import { BDReader } from '@/components/bd/BDReader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { getBDFolders, type BDFolder } from '@/data/bd-data';

export default function BibliothequeePage() {
  const [folders, setFolders] = useState<BDFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<BDFolder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBDFolders();
  }, []);  const fetchBDFolders = async () => {
    try {
      setLoading(true);
      console.log('🚀 Début du chargement des BD...');
      const data = await getBDFolders();
      console.log('📚 Données reçues:', data);
      setFolders(data);
    } catch (err) {
      console.error('❌ Erreur lors du chargement:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
      console.log('✅ Chargement terminé');
    }
  };

  if (selectedFolder) {
    return (
      <BDReader 
        folder={selectedFolder}
        onBack={() => setSelectedFolder(null)}
      />
    );
  }

  return (
    <div className="py-20 md:py-24 lg:py-28 bg-white dark:bg-gray-900 min-h-screen">
      <div className="container px-4 md:px-6">
        {/* En-tête */}
        <div className="text-center mb-16 md:mb-20">
          <AnimateOnScroll animation="crystal-emerge" delay={0.1}>
            <motion.div 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-purple-500/10 px-6 py-3 rounded-full mb-8 border border-primary/20"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <BookOpen className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-sm font-bold text-primary">Bibliothèque Exclusive</span>
            </motion.div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="smooth-reveal">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 title-font">
              Bibliothèque de{" "}
              <span className="relative inline-block">
                <span className="text-transparent bg-gradient-to-r from-primary via-purple-600 to-orange-500 bg-clip-text animate-pulse relative z-10">
                  La Grotte
                </span>
                {/* Effet de glow */}
                <span 
                  className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-orange-500 bg-clip-text text-transparent blur-md opacity-40 animate-pulse"
                  aria-hidden="true"
                >
                  La Grotte
                </span>
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-xl text-muted-foreground leading-relaxed">
              Découvrez toutes les bandes dessinées de l'univers de La Grotte de Juju. 
              Plongez dans des histoires captivantes et des aventures épiques !
            </p>
          </AnimateOnScroll>
        </div>

        {/* Navigation de retour */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>        {/* Contenu principal */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Chargement des BD depuis GitHub...</p>
          </div>        ) : error ? (
          <div className="text-center py-20">          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg p-6 mb-6 max-w-lg mx-auto">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-red-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Erreur GitHub</h3>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-md mb-4">
                <p className="text-sm md:text-base font-medium text-gray-800 dark:text-gray-200">{error}</p>
              </div>
              <div className="flex flex-col gap-3 justify-center items-center">
                <Button onClick={fetchBDFolders} className="bg-primary hover:bg-primary/90 text-white">
                  <span className="mr-2">🔄</span> Réessayer maintenant
                </Button>
                <details className="mt-4 text-sm text-muted-foreground">
                  <summary className="cursor-pointer font-medium">Solutions possibles</summary>
                  <div className="mt-2 text-left">
                    <p className="mb-2">Pour résoudre ce problème:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Vérifiez votre connexion internet</li>
                      <li>Essayez de rafraîchir la page (<kbd>F5</kbd>)</li>
                      <li>Le service GitHub peut être temporairement inaccessible</li>
                      <li>Réessayez plus tard (l'API GitHub a des limitations de requêtes)</li>
                    </ul>
                  </div>
                </details>
              </div>
            </div>
          </div>        ) : folders.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-lg p-6 mb-6 max-w-lg mx-auto">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-amber-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Aucune BD disponible</h3>
              <p className="text-muted-foreground mb-4">
                Le dépôt GitHub est accessible mais ne contient pas de bandes dessinées.
                Vérifiez que le chemin <code className="bg-amber-100 dark:bg-amber-900 px-2 py-1 rounded text-xs">BD/</code> existe dans le dépôt.
              </p>
              <Button onClick={fetchBDFolders} variant="outline">
                Rafraîchir
              </Button>
            </div>
          </div>): (
          <BDGallery 
            folders={folders}
            onFolderSelect={setSelectedFolder}
          />
        )}        {/* Section info */}
        <AnimateOnScroll animation="glass-morph" delay={0.5}>
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl p-8 border border-primary/20">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Bibliothèque Officielle</h3>
              <p className="text-muted-foreground">
                Découvrez toutes les bandes dessinées officielles de La Grotte de Juju, 
                synchronisées directement depuis notre dépôt GitHub.
              </p>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  );
}
