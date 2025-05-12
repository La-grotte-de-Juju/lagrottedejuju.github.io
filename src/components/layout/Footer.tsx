import Link from "next/link";
import Image from "next/image";
import { Youtube, Twitter, Instagram } from "lucide-react";

const menuGroups = [
	{
		title: "Dessins et BD",
		links: [
			{ label: "Strip", href: "/dessins/strip" },
			{ label: "Grand Strip", href: "/dessins/grand-strip" },
			{ label: "Batlife Comics", href: "/dessins/batlife-comics" },
			{ label: "Autres", href: "/dessins/autres" },
			{ label: "Fan-art", href: "/dessins/fan-art" },
		],
	},
	{
		title: "Univers de la grotte",
		links: [
			{ label: "Le lore", href: "/univers/lore" },
			{ label: "Fiches des personnages", href: "/univers/personnages" },
		],
	},
	{
		title: "Série",
		links: [
			{ label: "Batlife", href: "/series/batlife" },
			{ label: "Chasseurs de Sorciers", href: "/series/chasseurs-de-sorciers" },
			{ label: "Tower of Babel", href: "/series/tower-of-babel" },
			{ label: "Templier vs Sorcier", href: "/series/templier-vs-sorcier" },
			{ label: "Prism", href: "/series/prism" },
		],
	},
	{
		title: "Actu YouTube",
		links: [
			{ label: "Dernières vidéos", href: "/actu/dernieres-videos" },
			{ label: "YouTube bonus", href: "/actu/youtube-bonus" },
			{ label: "Rediff Live", href: "/actu/rediff-live" },
		],
	},
];

export function Footer() {
	return (
		<footer className="border-t bg-background/80 backdrop-blur-sm">
			<div className="container py-10">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
					<div className="lg:col-span-1">
						<Link href="/" className="flex items-center gap-2 mb-4">
							<Image
								src="/images/juju-logo.webp"
								alt="La grotte de Juju"
								width={50}
								height={50}
								className="rounded-full"
							/>
							<span className="font-bold text-xl">La Grotte de Juju</span>
						</Link>
						<p className="text-muted-foreground mb-4">
							YouTubeur d'animation travaillant sur diverses séries animées et
							bandes dessinées.
						</p>
						<div className="flex items-center gap-4">
							<a
								href="https://youtube.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								<Youtube className="h-5 w-5" />
								<span className="sr-only">YouTube</span>
							</a>
							<a
								href="https://twitter.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								<Twitter className="h-5 w-5" />
								<span className="sr-only">Twitter</span>
							</a>
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								<Instagram className="h-5 w-5" />
								<span className="sr-only">Instagram</span>
							</a>
						</div>
					</div>

					{menuGroups.map((group) => (
						<div key={group.title} className="space-y-3">
							<h3 className="font-medium text-foreground">{group.title}</h3>
							<ul className="space-y-2">
								{group.links.map((link) => (
									<li key={link.label}>
										<Link
											href={link.href}
											className="text-muted-foreground hover:text-primary transition-colors"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="border-t mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
					<p className="text-muted-foreground text-sm">
						© {new Date().getFullYear()} La Grotte de Juju. Tous droits réservés.
					</p>
					<div className="flex items-center gap-4 text-sm text-muted-foreground">
						<Link
							href="/mentions-legales"
							className="hover:text-primary transition-colors"
						>
							Mentions légales
						</Link>
						<Link
							href="/politique-confidentialite"
							className="hover:text-primary transition-colors"
						>
							Politique de confidentialité
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
