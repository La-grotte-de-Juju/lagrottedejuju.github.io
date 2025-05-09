'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Share2, Heart } from "lucide-react";
import AnimateOnScroll from "@/components/animation/AnimateOnScroll";
import { motion } from "framer-motion";

export default function BatlifeComicDetailPage() {
  return (
    <div className="py-12 md:py-16 lg:py-20">
      <div className="container px-4 md:px-6">
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/dessins/batlife-comics">
            <Button variant="ghost" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Retour aux comics
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
              <span className="sr-only">J'aime</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
              <span className="sr-only">Partager</span>
            </Button>
          </div>
        </motion.div>

        <AnimateOnScroll animation="slide-down">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Batlife - Une nuit à Tortueville</h1>
            <p className="mt-2 text-muted-foreground">Publié le 25 Février 2024</p>
          </div>
        </AnimateOnScroll>

        <div className="max-w-4xl mx-auto space-y-8">
          <AnimateOnScroll animation="fade" delay={0.2}>
            <div className="prose prose-lg dark:prose-invert mx-auto mb-6">
              <p>
                Notre héros se retrouve au bar de Tortueville pour une soirée qui va prendre une tournure inattendue.
                Découvrez comment les événements vont se dérouler dans ce nouvel épisode de Batlife Comics.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="scale" delay={0.3}>
            <div className="rounded-xl overflow-hidden">
              <Image
                src="/images/batlife-comic-2.jpg"
                alt="Batlife Comic - Une nuit à Tortueville"
                width={1654}
                height={2339}
                className="w-full h-auto"
              />
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade" delay={0.4}>
            <div className="prose prose-lg dark:prose-invert mx-auto mt-6">
              <p>
                Une fin de soirée qui laisse présager de nouvelles aventures pour nos personnages.
                Que va-t-il se passer dans le prochain épisode ? Restez à l'écoute !
              </p>
            </div>
          </AnimateOnScroll>
        </div>

        <AnimateOnScroll animation="slide-up" delay={0.5}>
          <div className="mt-12 p-6 border rounded-xl bg-muted/40">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Image
                src="/images/juju-logo.webp"
                alt="La Grotte de Juju"
                width={80}
                height={80}
                className="rounded-full"
              />
              <div>
                <h2 className="text-xl font-bold">La Grotte de Juju</h2>
                <p className="text-muted-foreground">
                  Créateur de contenu et artiste derrière la série Batlife et d'autres univers animés populaires.
                </p>
                <div className="mt-2">
                  <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="mr-2">
                      YouTube
                    </Button>
                  </Link>
                  <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      Twitter
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="slide-up" delay={0.6}>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
            <div>
              <Link href="/dessins/batlife-comics/le-depart">
                <Button variant="outline" className="gap-1">
                  <ChevronLeft className="h-4 w-4" />
                  Précédent : Le départ
                </Button>
              </Link>
            </div>
            <div>
              <Link href="/dessins/batlife-comics/la-rencontre">
                <Button variant="outline" className="gap-1">
                  Suivant : La rencontre
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </AnimateOnScroll>

      </div>
    </div>
  );
}
