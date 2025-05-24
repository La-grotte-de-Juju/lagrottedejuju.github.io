'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AnimateOnScroll from "@/components/animation/AnimateOnScroll";
import { ShinyCard } from "@/components/ui/shiny-card";

const comics = [
	{
		id: "comic-1",
		title: "Batlife - La rencontre",
		description: "Découvrez comment notre héros chauves-souris a rencontré son acolyte pour la première fois.",
		date: "12 Mars 2024",
		image: "/images/batlife-comic-1.jpg",
		link: "/dessins/batlife-comics/la-rencontre",
	},
	{
		id: "comic-2",
		title: "Batlife - Une nuit à Tortueville",
		description: "Une soirée qui ne se passe pas comme prévu dans le bar de Tortueville.",
		date: "25 Février 2024",
		image: "/images/batlife-comic-2.jpg",
		link: "/dessins/batlife-comics/nuit-tortueville",
	},
	{
		id: "comic-3",
		title: "Batlife - Le départ",
		description: "Notre héro doit faire face à un choix difficile qui changera son destin à jamais.",
		date: "10 Février 2024",
		image: "/images/batlife-comic-1.jpg",
		link: "/dessins/batlife-comics/le-depart",
	},
	{
		id: "comic-4",
		title: "Batlife - Ivy Serpenta",
		description: "La rencontre avec une mystérieuse créature dans les marécages.",
		date: "28 Janvier 2024",
		image: "/images/batlife-comic-2.jpg",
		link: "/dessins/batlife-comics/ivy-serpenta",
	},
];

export default function BatlifeComicsPage() {
	return (
		<div className="py-12 md:py-16 lg:py-20">
			<div className="container px-4 md:px-6">
				<AnimateOnScroll animation="liquid-rise" duration={1.0}>
					<div className="flex flex-col items-center text-center mb-12 md:mb-16">
						<h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
							Batlife Comics
						</h1>
						<p className="text-muted-foreground md:text-xl max-w-[800px] mb-8">
							Plongez dans l'univers déjanté de Batlife, une série de bandes dessinées
							originales créées par La Grotte de Juju. Suivez les aventures de notre
							chauve-souris préférée et de ses amis hauts en couleur.
						</p>
					</div>
				</AnimateOnScroll>

				<AnimateOnScroll animation="glass-morph" delay={0.2} intensity={1.1}>
					<div className="w-full max-w-4xl mx-auto aspect-[21/9] relative rounded-xl overflow-hidden mb-8">
						<Image
							src="/images/batlife-comic-1.jpg"
							alt="Batlife Comics Banner"
							fill
							className="object-cover"
							priority
						/>
					</div>
				</AnimateOnScroll>

				<AnimateOnScroll animation="magnetic-pull" delay={0.3}>
					<div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
						<h2 className="text-2xl font-bold">Tous les épisodes</h2>
						<div className="flex items-center gap-4">
							<Button variant="outline" size="sm">
								Les plus récents
							</Button>
							<Button variant="outline" size="sm">
								Les plus populaires
							</Button>
						</div>
					</div>
				</AnimateOnScroll>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{comics.map((comic, index) => (
						<AnimateOnScroll key={comic.id} animation="floating-card" delay={0.1 * (index + 1)} intensity={0.8}>
							<ShinyCard intensity={6} shineIntensity={0.35} className="h-full">
								<Card className="h-full flex flex-col border-0 shadow-none">
									<div className="aspect-[4/3] relative">
										<Image
											src={comic.image}
											alt={comic.title}
											fill
											className="object-cover rounded-t-lg"
										/>
									</div>
									<CardHeader>
										<CardTitle>{comic.title}</CardTitle>
										<CardDescription>{comic.date}</CardDescription>
									</CardHeader>
									<CardContent className="flex-grow">
										<p className="text-muted-foreground">{comic.description}</p>
									</CardContent>
									<CardFooter>
										<Link href={comic.link} className="w-full">
											<Button variant="default" className="w-full">
												Lire la BD
											</Button>
										</Link>
									</CardFooter>
								</Card>
							</ShinyCard>
						</AnimateOnScroll>
					))}
				</div>
			</div>
		</div>
	);
}
