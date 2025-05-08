import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
				<div className="flex flex-col items-center text-center mb-12 md:mb-16">
					<h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
						Batlife Comics
					</h1>
					<p className="text-muted-foreground md:text-xl max-w-[800px] mb-8">
						Plongez dans l'univers déjanté de Batlife, une série de bandes dessinées
						originales créées par La Grotte de Juju. Suivez les aventures de notre
						chauve-souris préférée et de ses amis hauts en couleur.
					</p>
					<div className="w-full max-w-4xl aspect-[21/9] relative rounded-xl overflow-hidden mb-8">
						<Image
							src="/images/batlife-comic-1.jpg"
							alt="Batlife Comics Banner"
							fill
							className="object-cover"
							priority
						/>
					</div>
				</div>

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

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{comics.map((comic) => (
						<Card key={comic.id}>
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
							<CardContent>
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
					))}
				</div>

				<div className="flex justify-center items-center mt-12 gap-2">
					<Button variant="outline" size="icon" disabled>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="h-4 w-4"
						>
							<path d="m15 18-6-6 6-6" />
						</svg>
						<span className="sr-only">Page précédente</span>
					</Button>
					<Button variant="outline" size="sm" className="px-4">
						1
					</Button>
					<Button variant="outline" size="sm" className="px-4">
						2
					</Button>
					<Button variant="outline" size="sm" className="px-4">
						3
					</Button>
					<Button variant="outline" size="icon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="h-4 w-4"
						>
							<path d="m9 18 6-6-6-6" />
						</svg>
						<span className="sr-only">Page suivante</span>
					</Button>
				</div>
			</div>
		</div>
	);
}
