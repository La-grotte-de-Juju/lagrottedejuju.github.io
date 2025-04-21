# La Grotte de Juju

## Guide complet pour l'export et le déploiement sur GitHub Pages

### Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn
- Un compte GitHub

### Configuration locale

1. Clonez le dépôt:
   ```bash
   git clone https://github.com/Lagrottedejuju/la-grotte-de-juju.git
   cd la-grotte-de-juju
   ```

2. Installez les dépendances:
   ```bash
   npm install
   ```

3. Lancez le serveur de développement:
   ```bash
   npm run dev
   ```

### Export pour la production

Pour créer une version statique du site optimisée pour GitHub Pages:

1. Assurez-vous que `next.config.js` est correctement configuré (voir ci-dessous).

2. Construisez le projet:
   ```bash
   npm run build
   ```

3. Le site exporté se trouvera dans le dossier `out/`.

### Configuration de next.config.js pour GitHub Pages

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/la-grotte-de-juju' : '',
  trailingSlash: true,
};

module.exports = nextConfig;
```

### Déploiement manuel sur GitHub Pages

1. Construisez le site:
   ```bash
   npm run build
   ```

2. Déployez le dossier `out/` sur la branche `gh-pages`:
   ```bash
   git add out/ -f
   git commit -m "Deploy to GitHub Pages"
   git subtree push --prefix out origin gh-pages
   ```

3. Sur GitHub, allez dans Settings > Pages et configurez la source pour utiliser la branche `gh-pages`.

### Déploiement automatique avec GitHub Actions

Ce projet est configuré pour déployer automatiquement sur GitHub Pages à chaque push sur la branche `main`.

1. Assurez-vous que le fichier `.github/workflows/deploy.yml` est présent dans votre dépôt.
2. Poussez vos changements sur la branche `main`.
3. GitHub Actions construira et déploiera automatiquement votre site.

### Résolution des problèmes courants

#### CSS manquant en production

Si votre site apparaît sans style en production:

1. **Vérifiez le `basePath`** : Assurez-vous que la configuration `basePath` dans `next.config.js` correspond au nom de votre dépôt.

2. **Fichier `.nojekyll`** : Assurez-vous qu'un fichier `.nojekyll` vide existe dans le dossier `public/`.

3. **Inspectez le code source** : Ouvrez l'inspecteur de votre navigateur et vérifiez les chemins des fichiers CSS pour voir s'ils pointent vers le bon endroit.

4. **URLs relatives** : Dans vos composants, utilisez toujours des URLs relatives pour les images et autres ressources.

#### Images ne s'affichant pas

1. Configuration d'images non optimisées:
   ```js
   images: {
     unoptimized: true,
   }
   ```

2. Utilisez des chemins relatifs pour les images:
   ```jsx
   <Image src="/images/monimage.jpg" />  // Correct
   <Image src="images/monimage.jpg" />   // Incorrect
   ```

#### Problèmes de routing

1. Utilisez `Link` avec des chemins relatifs:
   ```jsx
   <Link href="/about">À propos</Link>
   ```

2. Assurez-vous que `trailingSlash: true` est défini dans `next.config.js`.

### Tester la version de production localement

Vous pouvez tester localement la version exportée avec un serveur HTTP simple:

```bash
npx serve out
```

Cela simule comment votre site fonctionnera sur GitHub Pages.
