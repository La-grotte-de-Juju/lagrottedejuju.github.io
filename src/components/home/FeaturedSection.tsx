"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AnimateOnScroll from "@/components/animation/AnimateOnScroll";

const featuredItems = [
  {
    title: "Strip de la Grotte",
    description: "Découvrez l'univers sombre et comique de Batlife, une parodie de super-héros avec un style unique.",
    image: "/images/animation/Strip-grotte-Visual.gif",
    link: "/dessins/batlife-comics",
  },
  {
    title: "Fiche des personnages",
    description: "Explorez les personnages de Batlife et leurs histoires dans un univers riche et coloré.",
    image: "/images/animation/fichepersos.gif",
    link: "/series/chasseurs-de-sorciers",
  },
  {
    title: "Séries animées",
    description: "Des animations originales avec un style unique et des histoires captivantes.",
    image: "/images/dev img/5.webp",
    link: "/series",
  },
];

export function FeaturedSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <AnimateOnScroll animation="slide-right">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight title-font">
                Créations <span className="text-primary">en vedette</span>
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Découvrez le meilleur de la Grotte de Juju.
              </p>
            </div>
          </AnimateOnScroll>
          
          <AnimateOnScroll animation="slide-left">
            <div className="flex items-center justify-end">
              <Link href="/series">
                <Button 
                  variant="outline" 
                  className="btn-premium relative group overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-1">
                    Voir toutes les séries
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform transition-transform duration-300 group-hover:translate-x-1">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Button>
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {featuredItems.map((item, index) => (
            <AnimateOnScroll 
              key={item.title} 
              animation="slide-up" 
              delay={0.1 * (index + 1)}
            >
              <Card className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="title-font">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link href={item.link} className="w-full">
                    <Button 
                      className="w-full btn-card-premium group overflow-hidden" 
                      variant="outline"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></span>
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Découvrir
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform transition-transform duration-300 group-hover:translate-x-1">
                          <path d="m9 18 6-6-6-6"/>
                        </svg>
                      </span>
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedSection;
