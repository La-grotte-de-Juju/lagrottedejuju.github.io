"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AnimateOnScroll from "@/components/animation/AnimateOnScroll";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { BookOpen, Users, Film, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

const featuredItems = [
	{
		title: "Bibliothèque de Comics",
		description: "Plongez dans l'univers de Batlife à travers des bandes dessinées captivantes et pleines d'humour.",
		image: "/images/animation/Strip-grotte-Visual.gif",
		link: "/dessins/batlife-comics",
		icon: BookOpen,
		category: "BD & Comics",
		color: "emerald"
	},
	{
		title: "Galerie des Personnages",
		description: "Découvrez les héros attachants de La Grotte avec leurs histoires fascinantes et leurs secrets.",
		image: "/images/animation/fichepersos.gif",
		link: "/fiches-personnages",
		icon: Users,
		category: "Personnages",
		color: "purple"
	},
	{
		title: "Séries Animées",
		description: "Vivez des aventures épiques avec nos animations originales au style unique et captivant.",
		image: "/images/dev img/5.webp",
		link: "/series",
		icon: Film,
		category: "Animations",
		color: "orange"
	},
];

// Composant de carte moderne pour slider
function SliderCard({ item, index }: { item: typeof featuredItems[0], index: number }) {
	const [isHovered, setIsHovered] = useState(false);
	
	const colorClasses = {
		emerald: "from-emerald-500 to-emerald-600",
		purple: "from-purple-500 to-purple-600", 
		orange: "from-orange-500 to-orange-600"
	};
	
	return (
		<motion.div
			className="relative group h-full"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			whileHover={{ y: -8 }}
			transition={{ type: "spring", stiffness: 400, damping: 30 }}
		>
			{/* Carte principale */}
			<div className="relative h-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500 border border-gray-200 dark:border-gray-700">
				
				{/* Image avec overlay */}
				<div className="relative aspect-video overflow-hidden">
					<Image
						src={item.image}
						alt={item.title}
						fill
						className="object-cover transition-transform duration-700 group-hover:scale-110"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
					
					{/* Overlay gradient subtil */}
					<div className={`absolute inset-0 bg-gradient-to-t ${colorClasses[item.color as keyof typeof colorClasses]} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
					
					{/* Badge catégorie flottant */}
					<motion.div 
						className="absolute top-4 left-4 z-20"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: index * 0.1 }}
					>
						<div className={`px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${colorClasses[item.color as keyof typeof colorClasses]} text-white shadow-lg backdrop-blur-sm`}>
							{item.category}
						</div>
					</motion.div>
					
					{/* Icône animée */}
					<motion.div 
						className="absolute top-4 right-4 z-20"
						whileHover={{ rotate: 360, scale: 1.1 }}
						transition={{ duration: 0.6 }}
					>
						<div className="p-3 rounded-full bg-white/95 backdrop-blur-sm shadow-lg border border-white/20">
							<item.icon className="w-5 h-5 text-gray-700" />
						</div>
					</motion.div>
				</div>

				{/* Contenu avec design moderne */}
				<div className="p-6 h-48 flex flex-col justify-between">
					<div className="space-y-3">
						<motion.h3 
							className="text-xl font-bold title-font text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300"
							whileHover={{ x: 4 }}
						>
							{item.title}
						</motion.h3>
						<p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
							{item.description}
						</p>
					</div>
					
					{/* Bouton d'action moderne */}
					<Link href={item.link} className="block mt-4">
						<motion.div
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							<Button
								className={`w-full bg-gradient-to-r ${colorClasses[item.color as keyof typeof colorClasses]} hover:shadow-lg text-white border-0 font-medium py-3 rounded-xl transition-all duration-300`}
								size="lg"
							>
								<span className="flex items-center justify-center gap-2">
									Découvrir
									<motion.div
										animate={{ x: isHovered ? 4 : 0 }}
										transition={{ type: "spring", stiffness: 400 }}
									>
										<ChevronRight className="w-4 h-4" />
									</motion.div>
								</span>
							</Button>
						</motion.div>
					</Link>
				</div>
				
				{/* Effet de brillance au hover */}
				<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
					<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
				</div>
			</div>
			
			{/* Ombre projetée */}
			<div className="absolute inset-0 bg-gray-900/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 translate-y-4"></div>
		</motion.div>
	);
}

export function FeaturedSection() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const sliderRef = useRef<HTMLDivElement>(null);
	
	// Auto-scroll toutes les 5 secondes
	useEffect(() => {
		if (!isAutoPlaying) return;
		
		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
		}, 5000);
		
		return () => clearInterval(interval);
	}, [isAutoPlaying]);
	
	const goToSlide = (index: number) => {
		setCurrentIndex(index);
		setIsAutoPlaying(false);
		// Reprendre l'auto-play après 10 secondes
		setTimeout(() => setIsAutoPlaying(true), 10000);
	};
	
	const nextSlide = () => {
		setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
		setIsAutoPlaying(false);
		setTimeout(() => setIsAutoPlaying(true), 10000);
	};
	
	const prevSlide = () => {
		setCurrentIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
		setIsAutoPlaying(false);
		setTimeout(() => setIsAutoPlaying(true), 10000);
	};
	
	return (
		<section className="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden min-h-screen">
			{/* Éléments décoratifs de fond */}
			<div className="absolute inset-0 opacity-40">
				<div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
				<div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-orange-500/5 rounded-full blur-3xl"></div>
			</div>
			
			<div className="container px-4 md:px-6 relative z-10 h-full flex flex-col justify-center">
				{/* En-tête de section */}
				<div className="text-center mb-20">
					<AnimateOnScroll animation="liquid-rise">
						<motion.div 
							className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-8"
							whileHover={{ scale: 1.05 }}
							transition={{ type: "spring", stiffness: 300 }}
						>
							<Sparkles className="w-4 h-4 text-primary" />
							<span className="text-sm font-medium text-primary">Contenu Exclusif</span>
						</motion.div>
						
						<h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-8 title-font">
							L'Univers de{" "}
							<span className="text-primary bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
								La Grotte
							</span>
						</h2>
						<p className="max-w-3xl mx-auto text-xl text-muted-foreground leading-relaxed">
							Explorez les trésors créatifs de Juju : des comics palpitants, des personnages attachants 
							et des animations époustouflantes vous attendent !
						</p>
					</AnimateOnScroll>
				</div>

				{/* Slider de cartes avec hauteur fixe */}
				<div className="relative max-w-7xl mx-auto flex-1 flex items-center">
					{/* Boutons de navigation redesignés */}
					<motion.button
						onClick={prevSlide}
						className="absolute left-0 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
						whileHover={{ scale: 1.1, x: -2 }}
						whileTap={{ scale: 0.95 }}
					>
						<ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
					</motion.button>
					
					<motion.button
						onClick={nextSlide}
						className="absolute right-0 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
						whileHover={{ scale: 1.1, x: 2 }}
						whileTap={{ scale: 0.95 }}
					>
						<ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
					</motion.button>
					
					{/* Container du slider avec hauteur adaptée */}
					<div className="mx-16 overflow-hidden rounded-3xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
						<motion.div
							ref={sliderRef}
							className="flex"
							animate={{ x: `-${currentIndex * 100}%` }}
							transition={{ type: "spring", stiffness: 300, damping: 30 }}
							style={{ width: `${featuredItems.length * 100}%` }}
						>
							{featuredItems.map((item, index) => (
								<div key={item.title} className="w-full p-8" style={{ width: `${100 / featuredItems.length}%` }}>
									<div className="max-w-md mx-auto h-[500px]">
										<SliderCard item={item} index={index} />
									</div>
								</div>
							))}
						</motion.div>
					</div>
				</div>
				
				{/* Contrôles modernisés */}
				<div className="flex flex-col items-center gap-8 mt-16">
					{/* Indicateurs de pagination redesignés */}
					<div className="flex justify-center gap-3">
						{featuredItems.map((_, index) => (
							<motion.button
								key={index}
								onClick={() => goToSlide(index)}
								className={`relative overflow-hidden rounded-full transition-all duration-300 ${
									index === currentIndex 
										? 'w-12 h-3 bg-primary' 
										: 'w-3 h-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
								}`}
								whileHover={{ scale: 1.2 }}
								whileTap={{ scale: 0.9 }}
							>
								{index === currentIndex && (
									<motion.div
										className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600"
										layoutId="activeIndicator"
									/>
								)}
							</motion.button>
						))}
					</div>
					
					{/* Barre de progression élégante */}
					<div className="w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2 shadow-inner">
						<motion.div
							className="bg-gradient-to-r from-primary to-purple-600 h-2 rounded-full shadow-lg"
							initial={{ width: "0%" }}
							animate={{ 
								width: isAutoPlaying ? "100%" : `${((currentIndex + 1) / featuredItems.length) * 100}%`
							}}
							transition={{ 
								duration: isAutoPlaying ? 5 : 0.3,
								ease: "linear"
							}}
							key={currentIndex}
						/>
					</div>
				</div>

				{/* Call-to-action modernisé */}
				<AnimateOnScroll animation="spring-bounce" delay={0.8}>
					<div className="text-center mt-20">
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<Link href="/map">
								<Button
									variant="outline"
									size="lg"
									className="group relative overflow-hidden border-2 border-primary/30 hover:border-primary/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-8 py-4 text-lg font-semibold rounded-2xl"
								>
									<span className="relative z-10 flex items-center gap-3">
										Explorer toute la carte
										<motion.div
											className="flex"
											animate={{ 
												rotate: [0, 360],
											}}
											transition={{ 
												duration: 8,
												repeat: Infinity,
												ease: "linear"
											}}
										>
											<Sparkles className="w-5 h-5 text-primary" />
										</motion.div>
									</span>
									<motion.div 
										className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
										whileHover={{ scale: 1.05 }}
									/>
								</Button>
							</Link>
						</motion.div>
					</div>
				</AnimateOnScroll>
			</div>
		</section>
	);
}

export default FeaturedSection;
