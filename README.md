<div align="center">
    <img src="/public/images/juju-logo.webp" alt="La Grotte de Juju" width="200" />
    <h1>La Grotte de Juju</h1>
    <p>Site officiel de La Grotte de Juju, YouTubeur d'animation et bandes dessinées.</p>
</div>

## ⚠️ Avertissement Copyright

Ce site et tous ses assets sont sous copyright. Il est strictement interdit de cloner, réutiliser ou redistribuer ce code et ses éléments sans l'accord explicite du propriétaire. Toute utilisation non autorisée est passible de poursuites judiciaires.

## 🚀 Démarrage rapide

### Prérequis
- [Node.js](https://nodejs.org/en/) (version 18 ou supérieure)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/) ou [pnpm](https://pnpm.io/) ou [bun](https://bun.sh/)

### Installation

Clonez le dépôt et installez les dépendances :

```bash
# Installer les dépendances
npm install
# ou
yarn install
# ou
pnpm install
# ou
bun install
```

### Développement

#### Windows
```bash
# Démarrer le serveur de développement
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

#### macOS
```bash
# Démarrer le serveur de développement
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Le site sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

### Production

#### Windows
```bash
# Construction pour la production
npm run build
# ou
yarn build
# ou
pnpm build
# ou
bun build

# Démarrer le serveur de production
npm run start
# ou
yarn start
# ou
pnpm start
# ou
bun start
```

#### macOS
```bash
# Construction pour la production
npm run build
# ou
yarn build
# ou
pnpm build
# ou
bun build

# Démarrer le serveur de production
npm run start
# ou
yarn start
# ou
pnpm start
# ou
bun start
```

## 📁 Structure du projet [06/04/2025 à 23:33]
```
la-grotte-de-juju/
├── public/
│   ├── images/
│   │   ├── favicon.ico       # Favicon du site
│   │   ├── juju-logo.webp    # Logo principal
│   │   └── ... 
├── src/
│   ├── app/                  # Dossier principal de l'App Router Next.js
│   │   ├── layout.tsx        # Layout global
│   │   ├── page.tsx          # Page d'accueil
│   │   ├── globals.css       # Styles globaux
│   │   └── ... 
│   ├── components/           # Composants réutilisables
│   │   ├── ui/               # Composants UI de base (shadcn)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── sheet.tsx
│   │   │   └── ...
│   │   ├── animation/        # Composants d'animation 
│   │   │   └── AnimateOnScroll.tsx
│   │   ├── layout/           # Composants de mise en page
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── LoadingScreen.tsx
│   │   └── home/             # Composants spécifiques à la page d'accueil
│   │       ├── HeroSection.tsx
│   │       ├── FeaturedSection.tsx
│   │       ├── LatestVideosSection.tsx
│   │       └── FaqSection.tsx
│   └── lib/                  # Utilitaires et fonctions
│       └── utils.ts
├── .next/                    # Build de Next.js (généré)
├── components.json           # Configuration shadcn/ui
├── tailwind.config.ts        # Configuration Tailwind CSS
├── eslint.config.mjs         # Configuration ESLint
├── biome.json                # Configuration Biome
└── ... 
```
## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
