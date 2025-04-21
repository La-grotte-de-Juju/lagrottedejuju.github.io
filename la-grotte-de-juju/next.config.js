/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Ajoutez cette ligne si votre site est hébergé sur un sous-chemin
  // Par exemple: https://username.github.io/repo-name/
  basePath: process.env.NODE_ENV === 'production' ? '/la-grotte-de-juju' : '',
  // Nécessaire pour GitHub Pages qui utilise des URLs avec des trailing slashes
  trailingSlash: true,
};

module.exports = nextConfig;
