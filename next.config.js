/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },

  basePath: process.env.NODE_ENV === 'production' ? '/la-grotte-de-juju' : '',
};

module.exports = nextConfig;
