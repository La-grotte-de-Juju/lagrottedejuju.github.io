"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AnimateOnScroll from "@/components/animation/AnimateOnScroll";
import { motion } from "framer-motion";
import { BookOpen, Users, Film, Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";

const featuredItems = [
	{
		title: "Bibliothèque de La Grotte",
		description: "Plongez dans l'univers captivant de Batlife à travers des bandes dessinées pleines d'humour et d'aventures épiques.",
		image: "/images/animation/Strip-grotte-Visual.gif",
		link: "/bd",
		icon: BookOpen,
		category: "BD & Comics",
		color: "from-emerald-500 to-teal-600",		bgPattern: "bg-emerald-50 dark:bg-emerald-950/20"
	},
	{
		title: "Galerie des Héros",
		description: "Découvrez les personnages attachants de La Grotte avec leurs histoires fascinantes et leurs secrets les mieux gardés.",
		image: "/images/animation/fichepersos.gif",
		link: "/fiches-personnages",
		icon: Users,
		category: "Personnages",
		color: "from-purple-500 to-indigo-600",
		bgPattern: "bg-purple-50 dark:bg-purple-950/20"
	},
	{
		title: "Animations Exclusives",
		description: "Vivez des aventures épiques avec nos séries animées au style unique et aux histoires captivantes qui vous transporteront.",
		image: "/images/dev img/5.webp",
		link: "/series",
		icon: Film,
		category: "Animations",
		color: "from-orange-500 to-red-600",
		bgPattern: "bg-orange-50 dark:bg-orange-950/20"
	},
];

function FeatureCard({ item, index }: { item: typeof featuredItems[0], index: number }) {
	const [isHovered, setIsHovered] = useState(false);
	
	return (
		<motion.div
			className="group relative h-full"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			whileHover={{ y: -8 }}
			transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
		>
			{/* Carte principale avec effets de hover optimisés */}
			<div className="relative h-full bg-white dark:bg-gray-900/95 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300 border border-gray-200/50 dark:border-gray-700/50">
				
				{/* Image avec ratio 16:9 et effets optimisés */}
				<div className="relative aspect-video overflow-hidden">
					<Image
						src={item.image}
						alt={item.title}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
					
					{/* Overlay gradient simplifié */}
					<div className={`absolute inset-0 bg-gradient-to-t ${item.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
					
					{/* Badge catégorie flottant */}
					<div className="absolute top-4 left-4 z-20">
						<div className={`px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${item.color} text-white shadow-lg`}>
							{item.category}
						</div>
					</div>
				</div>				{/* Contenu avec design moderne */}
				<div className="p-8 space-y-4">
					{/* Titre */}
					<h3 className="text-2xl font-bold title-font text-gray-900 dark:text-white transition-all duration-300">
						{item.title}
					</h3>

					{/* Description */}
					<p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
						{item.description}
					</p>

					{/* Bouton d'action moderne */}
					<motion.div
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className="pt-4"
					>
						<Link href={item.link} className="block">
							<Button
								className={`w-full bg-gradient-to-r ${item.color} hover:shadow-xl text-white border-0 font-bold py-4 rounded-2xl transition-all duration-300 group/btn`}
								size="lg"
							>
								<span className="flex items-center justify-center gap-3">
									<Sparkles className="w-5 h-5" />
									Découvrir maintenant
									<motion.div
										animate={{ x: isHovered ? 6 : 0 }}
										transition={{ type: "spring", stiffness: 400 }}
									>
										<ArrowRight className="w-5 h-5" />
									</motion.div>
								</span>
							</Button>
						</Link>
					</motion.div>
				</div>
				
				{/* Effet de brillance au hover */}
				<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
					<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
				</div>
			</div>
			
			{/* Ombre projetée */}
			<div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 transition-all duration-500 -z-10 translate-y-6`}></div>
		</motion.div>
	);
}

export function FeaturedSection() {
	return (
		<section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
			{/* Éléments décoratifs de fond simplifiés */}
			<div className="absolute inset-0 opacity-20">
				<div className="absolute top-20 left-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
				<div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl"></div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-orange-500/3 rounded-full blur-2xl"></div>
			</div>
			
			<div className="container px-4 md:px-6 relative z-10">
				{/* En-tête de section modernisé */}
				<div className="text-center mb-20">
					<AnimateOnScroll animation="smooth-reveal">
						<motion.div 
							className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-purple-500/10 px-6 py-3 rounded-full mb-8 border border-primary/20"
							whileHover={{ scale: 1.05 }}
							transition={{ type: "spring", stiffness: 300 }}
						>
							<Sparkles className="w-5 h-5 text-primary animate-pulse" />
							<span className="text-sm font-bold text-primary">Contenu Exclusif</span>
						</motion.div>
					</AnimateOnScroll>					<AnimateOnScroll animation="crystal-emerge">
						<h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-8 title-font">
							L'univers de{" "}
							<span className="relative inline-block">
								<span className="text-transparent bg-gradient-to-r from-primary via-purple-600 to-orange-500 bg-clip-text animate-pulse relative z-10">
									La Grotte
								</span>								{/* Effet de glow multiple couches avec flou plus intense */}
								<span 
									className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-orange-500 bg-clip-text text-transparent blur-md opacity-40 animate-pulse"
									aria-hidden="true"
								>
									La Grotte
								</span>
								<span 
									className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-orange-500 bg-clip-text text-transparent blur-lg opacity-35 animate-pulse"
									aria-hidden="true"
								>
									La Grotte
								</span>
								<span 
									className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-orange-500 bg-clip-text text-transparent blur-xl opacity-30 animate-pulse"
									aria-hidden="true"
								>
									La Grotte
								</span>
								<span 
									className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-orange-500 bg-clip-text text-transparent blur-2xl opacity-25 animate-pulse"
									aria-hidden="true"
								>
									La Grotte
								</span>
								<span 
									className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-orange-500 bg-clip-text text-transparent blur-3xl opacity-15 animate-pulse"
									aria-hidden="true"
								>
									La Grotte
								</span>
							</span>
						</h2>
						<p className="max-w-3xl mx-auto text-xl text-muted-foreground leading-relaxed">
							Retrouve le meilleur de la grotte, tout en un seul endroit. 
						</p>
					</AnimateOnScroll>
				</div>

				{/* Grille de cartes avec espacement optimisé */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
					{featuredItems.map((item, index) => (
						<AnimateOnScroll
							key={item.title}
							animation="glass-morph"
							delay={0.2 * (index + 1)}
						>
							<FeatureCard item={item} index={index} />
						</AnimateOnScroll>
					))}
				</div>


			</div>
		</section>
	);
}

export default FeaturedSection;
