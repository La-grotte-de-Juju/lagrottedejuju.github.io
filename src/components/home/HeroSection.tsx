"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AnimateOnScroll from "@/components/animation/AnimateOnScroll";

export function HeroSection() {
  return (
    <section className="relative py-20 overflow-hidden bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
          <AnimateOnScroll animation="slide-right" delay={0.3}>
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none title-font">
                  Bienvenue dans <span className="text-primary">La Grotte de Juju</span>
                </h1>
                <br></br>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Ici, tu pourras rester au courant des nouveautés de la chaîne, qu’il s’agisse des dernières vidéos, des créations en cours ou de l’univers qui prend forme peu à peu ! Tu auras même la chance de lire des bandes dessinées mettant en scène tes personnages préférés.
                </p>
                <br></br>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/series/batlife" prefetch={false}>
                  <Button size="lg" className="btn-primary-shine">
                    Voir sur YouTube
                  </Button>
                </Link>
                <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="btn-outline-animate">
                    Découvrir Batlife
                  </Button>
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
          
          <AnimateOnScroll animation="scale" delay={0.6}>
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-[366px] h-[450px] overflow-hidden rounded-xl">
                <Image
                  src="/images/juju.webp"
                  alt="Personnage de Batlife"
                  className="absolute inset-0 object-cover w-full h-full hero-image shine-effect"
                  width={366}
                  height={450}
                  priority
                />
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
