/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Utiliser cette ligne si vous déployez dans un sous-dossier GitHub Pages
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // Désactiver le trailing slash pour la compatibilité GitHub Pages
  trailingSlash: true,
  // Activer ce qui suit si nécessaire pour le développement local
  // distDir: 'out',
}

module.exports = nextConfig
