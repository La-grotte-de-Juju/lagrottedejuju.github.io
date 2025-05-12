'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import PageTransition from '@/components/animation/PageTransition';
import { Home, Pencil, Users, Link as LinkIconLucide, Map, Mountain, Book, Scroll, Palette, Feather, Compass, Anchor, Gem } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface PageLink {
  name: string;
  path: string;
}

interface SiteSection {
  name: string;
  icon: JSX.Element;
  description: string;
  bgColor: string;
  borderColor: string;
  hoverTextColor: string;
  hoverBgColor: string;
  hoverIconColor: string;
  pages: PageLink[];
  colSpan?: string;
  rowSpan?: string;
}

const siteSections: SiteSection[] = [
	{
		name: 'Accueil',
		icon: <Home className="w-16 h-16 text-amber-500" />,
		description: 'Le point de départ de votre aventure',
		bgColor: 'bg-white', 
		borderColor: 'border-slate-200',
		hoverTextColor: 'group-hover:text-amber-700',
		hoverBgColor: 'group-hover:bg-slate-100',
		hoverIconColor: 'group-hover:text-amber-600',
		pages: [{ name: "Page d'accueil", path: '/' }],
		colSpan: 'md:col-span-1',
		rowSpan: 'md:row-span-1',
	},
	{
		name: 'Dessins & Créations',
		icon: <Palette className="w-16 h-16 text-purple-600" />,
		description: 'Explorez les œuvres artistiques de Juju',
		bgColor: 'bg-white',
		borderColor: 'border-slate-200',
		hoverTextColor: 'group-hover:text-purple-700',
		hoverBgColor: 'group-hover:bg-slate-100',
		hoverIconColor: 'group-hover:text-purple-600',
		pages: [
			{ name: 'Fan Arts', path: '/fan-art' },
			{ name: 'Comics Batlife', path: '/dessins/batlife-comics' },
			{ name: 'Nuit à Tortueville (Comic)', path: '/dessins/batlife-comics/nuit-tortueville' },
		],
		colSpan: 'md:col-span-1',
		rowSpan: 'md:row-span-1',
	},
	{
		name: 'Univers & Personnages',
		icon: <Users className="w-16 h-16 text-blue-600" />,
		description: 'Découvrez les personnages qui peuplent cet univers',
		bgColor: 'bg-white', 
		borderColor: 'border-slate-200', 
		hoverTextColor: 'group-hover:text-blue-700',
		hoverBgColor: 'group-hover:bg-slate-100', 
		hoverIconColor: 'group-hover:text-blue-600',
		pages: [{ name: 'Fiches Personnages', path: '/fiches-personnages' }],
		colSpan: 'md:col-span-1',
		rowSpan: 'md:row-span-1',
	},
	{
		name: 'Autres Liens',
		icon: <LinkIconLucide className="w-16 h-16 text-green-600" />,
		description: "Portails vers d'autres destinations",
		bgColor: 'bg-white', 
		borderColor: 'border-slate-200', 
		hoverTextColor: 'group-hover:text-green-700',
		hoverBgColor: 'group-hover:bg-slate-100', 
		hoverIconColor: 'group-hover:text-green-600',
		pages: [{ name: 'Liens Utiles', path: '/liens' }],
		colSpan: 'md:col-span-1',
		rowSpan: 'md:row-span-1',
	},
];

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.2, delayChildren: 0.3 },
	},
};

const sectionVariants = {
	hidden: { opacity: 0, y: 30 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const listItemVariants = {
	hidden: { opacity: 0, scale: 0.9 },
	visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

const floatingIconsList = [
	{ Icon: Mountain, color: 'text-slate-400' },
	{ Icon: Map, color: 'text-slate-500' },
	{ Icon: Scroll, color: 'text-slate-400' },
	{ Icon: Feather, color: 'text-sky-400' },
	{ Icon: Compass, color: 'text-orange-400' },
	{ Icon: Anchor, color: 'text-teal-400' },
	{ Icon: Gem, color: 'text-rose-400' },
	{ Icon: Book, color: 'text-lime-400' },
];

interface FloatingIconProps {
	Icon: React.ElementType;
	color: string;
	top: string;
	left: string;
	size: number;
	duration: number;
	delay: number;
	rotation: number;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({ Icon, color, top, left, size, duration, delay, rotation }) => {
	return (
		<motion.div
			className="absolute opacity-20"
			style={{ top, left, rotate: `${rotation}deg` }}
			animate={{
				y: [0, -35, 0, 35, 0],
				x: [0, -25, 0, 25, 0],
				rotate: [rotation, rotation - 25, rotation, rotation + 25, rotation],
			}}
			transition={{
				duration: duration, 
				repeat: Infinity,
				ease: 'easeInOut',
				delay: delay,
			}}
		>
			<Icon className={`w-${size} h-${size} ${color}`} /> 
		</motion.div>
	);
};

export default function SiteMapPage() {
	const [icons, setIcons] = useState<FloatingIconProps[]>([]);

	useEffect(() => {
		const generateIcons = () => {
			const newIcons = floatingIconsList.flatMap((item, index) => 
				Array.from({ length: 25 }).map((_, i) => {
					const baseSize = Math.floor(Math.random() * 20) + 20;
					const tailwindSize = Math.max(4, Math.floor(baseSize / 4));
					return {
						Icon: item.Icon,
						color: item.color,
						top: `${Math.random() * 100}%`,
						left: `${Math.random() * 100}%`,
						size: tailwindSize,
						duration: Math.random() * 20 + 35,
						delay: Math.random() * 18,
						rotation: Math.floor(Math.random() * 360),
					};
				})
			);
			setIcons(newIcons);
		};
		generateIcons();
	}, []);

  const sortedSiteSections = [...siteSections].sort((a, b) => b.pages.length - a.pages.length);

  let gridColsClass = 'md:grid-cols-3';
  if (sortedSiteSections.length === 1) {
    gridColsClass = 'md:grid-cols-1';
  } else if (sortedSiteSections.length === 2) {
    gridColsClass = 'md:grid-cols-2';
  }

	return (
		<PageTransition>
			<div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 text-slate-800 py-12 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
				{icons.map((iconProps, index) => (
					<FloatingIcon key={index} {...iconProps} />
				))}

				<div className="container max-w-6xl mx-auto pt-28 md:pt-32 pb-8 md:pb-12 relative z-10">
					<motion.div
						className="text-center mb-10 md:mb-16"
						variants={sectionVariants}
						initial="hidden"
						animate="visible"
					>
						<h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
							Carte d'Exploration
						</h1>
						<p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
							Bienvenue dans la carte d'exploration de La Grotte de Juju. Choisissez votre destination et partez à l'aventure !
						</p>
					</motion.div>

					<motion.div
						className={`grid grid-cols-1 ${gridColsClass} gap-6 md:items-start`}
						variants={containerVariants}
						initial="hidden"
						animate="visible"
					>
						{sortedSiteSections.map((section, index) => {
							const isFirstSection = index === 0;
							const effectiveRowSpan = isFirstSection ? 'md:row-span-2' : (section.rowSpan || 'md:row-span-1');

							return (
								<motion.section
									key={section.name}
									className={`rounded-xl shadow-lg border ${section.borderColor} transition-all duration-300 hover:shadow-xl hover:scale-103 overflow-hidden flex flex-col ${section.colSpan || ''} ${effectiveRowSpan}`}
									variants={sectionVariants}
								>
									<div className={`${section.bgColor} p-8 md:p-10 flex flex-col items-center text-center flex-grow`}>
										<div className="p-6 bg-white rounded-full shadow-inner mb-6 flex items-center justify-center">
											{section.icon}
										</div>
										<h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-2 break-words">
											{section.name}
										</h2>
										<p className="mb-6 text-slate-600 break-words">{section.description}</p>
										
										<div className="w-full mt-4 space-y-3">
											{section.pages.map((page: PageLink) => (
												<motion.div key={page.path} variants={listItemVariants}>
													<Link href={page.path} legacyBehavior>
														<a className={`flex w-full p-3 bg-white/80 backdrop-blur-sm hover:bg-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md border border-slate-200 hover:border-slate-300 items-center justify-between group`}>
															<span className={`text-lg text-slate-700 ${section.hoverTextColor} font-medium`}>
																{page.name}
															</span>
															<div className={`bg-slate-100 ${section.hoverBgColor} p-2 rounded-full transform group-hover:translate-x-1 transition-all`}>
																<Book className={`w-4 h-4 text-slate-500 ${section.hoverIconColor}`} />
															</div>
														</a>
													</Link>
												</motion.div>
											))}
										</div>
									</div>
								</motion.section>
							);
						})}
					</motion.div>
				</div>
			</div>
		</PageTransition>
	);
}
