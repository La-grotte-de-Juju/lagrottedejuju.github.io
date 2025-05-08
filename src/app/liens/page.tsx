"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link as LinkIcon } from 'lucide-react';
import { FaYoutube, FaInstagram, FaTiktok, FaXTwitter } from 'react-icons/fa6';

const initialLinks = [
	{
		name: "YouTube",
		url: "https://www.youtube.com/@lagrottedejuju",
		icon: <FaYoutube className="h-8 w-8" />,
		color: "bg-red-600",
		gradient: "from-red-500 to-red-700",
		shadowColor: "rgba(220, 38, 38, 0.35)",
	},
	{
		name: "Tipeee",
		url: "https://fr.tipeee.com/la-grotte-dejuju",
		icon: <LinkIcon className="h-8 w-8" />,
		color: "bg-emerald-500",
		gradient: "from-emerald-400 to-emerald-600",
		shadowColor: "rgba(16, 185, 129, 0.35)",
	},
	{
		name: "Twitter / 𝕏",
		url: "https://x.com/LagrottedeJuju",
		icon: <FaXTwitter className="h-8 w-8" />,
		color: "bg-black",
		gradient: "from-gray-800 to-black",
		shadowColor: "rgba(50, 50, 50, 0.35)",
	},
	{
		name: "TikTok",
		url: "https://www.tiktok.com/@lagrottedejuju",
		icon: <FaTiktok className="h-8 w-8" />,
		color: "bg-black",
		gradient: "from-[#000000] via-[#ff0050] to-[#00f2ea]",
		shadowColor: "rgba(255, 0, 80, 0.3)",
	},
	{
		name: "Instagram",
		url: "https://www.instagram.com/la_grotte_de_juju",
		icon: <FaInstagram className="h-8 w-8" />,
		color: "bg-pink-500",
		gradient: "from-pink-400 via-red-500 to-yellow-500",
		shadowColor: "rgba(236, 72, 153, 0.35)",
	},
	{
		name: "BlueSky",
		url: "https://bsky.app/profile/lagrottedejuju.bsky.social",
		icon: <LinkIcon className="h-8 w-8" />,
		color: "bg-sky-600",
		gradient: "from-sky-500 to-sky-700",
		shadowColor: "rgba(2, 132, 199, 0.35)",
	},
];

type LinkWithColSpan = (typeof initialLinks)[number] & { colSpan: string };

const LiensPage: React.FC = () => {
	const [shuffledLinks, setShuffledLinks] = useState<LinkWithColSpan[]>(() => {
		const desiredSpanClasses = [
			'col-span-1 md:col-span-1', 'col-span-1 md:col-span-1', 'col-span-1 md:col-span-1', 
			'col-span-1 md:col-span-2', 
			'col-span-2 md:col-span-2', 'col-span-2 md:col-span-2'  
		];

		const randomlyOrderedLinks = [...initialLinks];
		for (let i = randomlyOrderedLinks.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[randomlyOrderedLinks[i], randomlyOrderedLinks[j]] = [randomlyOrderedLinks[j], randomlyOrderedLinks[i]];
		}

		const randomlyOrderedSpans = [...desiredSpanClasses];
		for (let i = randomlyOrderedSpans.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[randomlyOrderedSpans[i], randomlyOrderedSpans[j]] = [randomlyOrderedSpans[j], randomlyOrderedSpans[i]];
		}

		return randomlyOrderedLinks.map((link, index) => ({
			...link,
			colSpan: randomlyOrderedSpans[index]
		}));
	});

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: {
			opacity: 0,
			y: 60,
			rotateX: -25,
			filter: "blur(8px)",
		},
		visible: {
			opacity: 1,
			y: 0,
			rotateX: 0,
			filter: "blur(0px)",
			transition: {
				type: "spring",
				stiffness: 160,
				damping: 16,
				mass: 0.8
			}
		},
	};

	interface LinkCardProps {
		href: string;
		title: string;
		icon: React.ReactNode;
		gradient: string;
		shadowColor?: string;
	}

	const LinkCard: React.FC<LinkCardProps> = ({ href, title, icon, gradient, shadowColor }) => {
		const [rotate, setRotate] = useState({ x: 0, y: 0 });

		const handleMouseMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
			const rect = event.currentTarget.getBoundingClientRect();
			const x = event.clientX - rect.left - rect.width / 2;
			const y = event.clientY - rect.top - rect.height / 2;

			const rotateX = (-y / rect.height) * 25; 
			const rotateY = (x / rect.width) * 25; 
			setRotate({ x: rotateX, y: rotateY });
		};

		const handleMouseLeave = () => {
			setRotate({ x: 0, y: 0 });
		};

		return (
			<motion.a
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				className={`flex items-center p-8 rounded-xl shadow-lg text-white bg-gradient-to-br ${gradient} min-h-[140px]`}
				style={{ transformStyle: "preserve-3d" }}
				animate={{
					rotateX: rotate.x,
					rotateY: rotate.y,
				}}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				whileHover={{
					scale: 1.06,
					z: 25,
					boxShadow: `0px 20px 40px ${shadowColor || 'rgba(0,0,0,0.25)'}`,
					transition: { type: "spring", stiffness: 180, damping: 12, mass: 0.7 }
				}}
				whileTap={{
					scale: 0.96,
					z: 0,
					rotateX: 0,
					rotateY: 0,
					boxShadow: `0px 5px 15px ${shadowColor ? shadowColor.replace(new RegExp("(\\d\\.\\d+)"), (match, p1) => (parseFloat(p1) * 0.5).toFixed(2)) : 'rgba(0,0,0,0.15)'}`,
					transition: { type: "spring", stiffness: 350, damping: 20 }
				}}
			>
				<div className="mr-6 text-4xl" style={{ transform: "translateZ(20px)" }}>
					{icon}
				</div>
				<div style={{ transform: "translateZ(10px)" }}>
					<h3 className="text-2xl font-semibold">{title}</h3>
				</div>
			</motion.a>
		);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/30 dark:to-gray-800 py-12 pt-36 px-4 sm:px-6 lg:px-8">
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
				className="text-center mb-12"
			>
				<h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white">
					Retrouvez{' '}
					<span className="relative inline-block">
						<span
							className="absolute inset-0 blur-lg bg-apple-gradient from-apple-blue via-apple-purple to-apple-orange bg-[length:200%_auto] bg-clip-text text-transparent animate-apple-gradient"
							aria-hidden="true"
						>
							Juju
						</span>
						<span className="relative z-10 bg-apple-gradient from-apple-blue via-apple-purple to-apple-orange bg-[length:200%_auto] bg-clip-text text-transparent animate-apple-gradient">
							Juju
						</span>
					</span>
					{' '}partout !
				</h1>
				<p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
					Tous les liens essentiels pour suivre les aventures de La Grotte de Juju et soutenir la création.
				</p>
			</motion.div>

			<motion.div
				className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 md:grid-flow-row-dense gap-6"
				style={{ perspective: '1200px' }}
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				{shuffledLinks.map((link) => (
					<motion.div
						key={link.name}
						variants={itemVariants}
						className={link.colSpan}
					>
						<LinkCard
							href={link.url}
							title={link.name}
							icon={link.icon}
							gradient={link.gradient}
							shadowColor={link.shadowColor}
						/>
					</motion.div>
				))}
			</motion.div>

		</div>
	);
};

export default LiensPage;

