import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Share2, Heart } from "lucide-react";

export default function BatlifeComicDetailPage() {
  return (
    <div className="py-12 md:py-16 lg:py-20">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
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
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Batlife - Une nuit à Tortueville</h1>
          <p className="mt-2 text-muted-foreground">Publié le 25 Février 2024</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="prose prose-lg dark:prose-invert mx-auto mb-6">
            <p>
              Notre héros se retrouve au bar de Tortueville pour une soirée qui va prendre une tournure inattendue.
              Découvrez comment les événements vont se dérouler dans ce nouvel épisode de Batlife Comics.
            </p>
          </div>

          <div className="rounded-xl overflow-hidden">
            <Image
              src="/images/batlife-comic-2.jpg"
              alt="Batlife Comic - Une nuit à Tortueville"
              width={1654}
              height={2339}
              className="w-full h-auto"
            />
          </div>

          <div className="prose prose-lg dark:prose-invert mx-auto mt-6">
            <p>
              Une fin de soirée qui laisse présager de nouvelles aventures pour nos personnages.
              Que va-t-il se passer dans le prochain épisode ? Restez à l'écoute !
            </p>
          </div>
        </div>

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

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Vous aimerez aussi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="rounded-lg overflow-hidden border bg-card text-card-foreground shadow">
              <div className="aspect-[4/3] relative">
                <Image
                  src="/images/batlife-comic-1.jpg"
                  alt="Batlife - La rencontre"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium">Batlife - La rencontre</h3>
                <Link href="/dessins/batlife-comics/la-rencontre">
                  <Button className="w-full mt-2" variant="outline">
                    Lire
                  </Button>
                </Link>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden border bg-card text-card-foreground shadow">
              <div className="aspect-[4/3] relative">
                <Image
                  src="/images/batlife-comic-2.jpg"
                  alt="Batlife - Ivy Serpenta"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium">Batlife - Ivy Serpenta</h3>
                <Link href="/dessins/batlife-comics/ivy-serpenta">
                  <Button className="w-full mt-2" variant="outline">
                    Lire
                  </Button>
                </Link>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden border bg-card text-card-foreground shadow">
              <div className="aspect-[4/3] relative">
                <Image
                  src="/images/batlife-comic-1.jpg"
                  alt="Batlife - Le départ"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium">Batlife - Le départ</h3>
                <Link href="/dessins/batlife-comics/le-depart">
                  <Button className="w-full mt-2" variant="outline">
                    Lire
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
