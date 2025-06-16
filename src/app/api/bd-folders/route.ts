import { NextRequest, NextResponse } from 'next/server';

// Note: Cette API route ne fonctionnera qu'en développement avec output: 'export'
// En production, les données seront récupérées côté client

interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
  size?: number;
}

interface BDFolder {
  name: string;
  path: string;
  coverImage?: string;
  pages?: string[];
  description?: string;
  createdAt?: string;
}

const GITHUB_API_BASE = 'https://api.github.com/repos/La-grotte-de-Juju/La-grotte-de-Juju-Ressources/contents';
const RAW_BASE = 'https://raw.githubusercontent.com/La-grotte-de-Juju/La-grotte-de-Juju-Ressources/main';

// Données de fallback pour le développement local
const FALLBACK_BD_DATA: BDFolder[] = [
  {
    name: "Aventure Mystique",
    path: "BD/Aventure-Mystique",
    coverImage: "https://via.placeholder.com/400x600/1a1a2e/ffffff?text=Aventure+Mystique",
    pages: [
      "https://via.placeholder.com/800x1200/1a1a2e/ffffff?text=Page+1",
      "https://via.placeholder.com/800x1200/16213e/ffffff?text=Page+2",
      "https://via.placeholder.com/800x1200/0f3460/ffffff?text=Page+3",
      "https://via.placeholder.com/800x1200/533483/ffffff?text=Page+4",
      "https://via.placeholder.com/800x1200/7209b7/ffffff?text=Page+5"
    ],
    description: "Une aventure épique dans un monde mystique rempli de magie et de créatures fantastiques. Suivez notre héros dans sa quête pour sauver le royaume.",
    createdAt: "2024-01-15T00:00:00Z"
  },
  {
    name: "Sci-Fi Chronicles",
    path: "BD/Sci-Fi-Chronicles",
    coverImage: "https://via.placeholder.com/400x600/0f4c75/ffffff?text=Sci-Fi+Chronicles",
    pages: [
      "https://via.placeholder.com/800x1200/0f4c75/ffffff?text=Page+1",
      "https://via.placeholder.com/800x1200/3282b8/ffffff?text=Page+2",
      "https://via.placeholder.com/800x1200/bbe1fa/000000?text=Page+3",
      "https://via.placeholder.com/800x1200/1b262c/ffffff?text=Page+4"
    ],
    description: "Exploration de l'espace et découvertes technologiques dans un futur lointain.",
    createdAt: "2024-01-10T00:00:00Z"
  },
  {
    name: "Comédie Urbaine",
    path: "BD/Comedie-Urbaine",
    coverImage: "https://via.placeholder.com/400x600/ff6b6b/ffffff?text=Comédie+Urbaine",
    pages: [
      "https://via.placeholder.com/800x1200/ff6b6b/ffffff?text=Page+1",
      "https://via.placeholder.com/800x1200/ffa726/ffffff?text=Page+2",
      "https://via.placeholder.com/800x1200/66bb6a/ffffff?text=Page+3"
    ],
    description: "Les aventures hilarantes de personnages dans la ville moderne.",
    createdAt: "2024-01-05T00:00:00Z"
  }
];

export async function GET() {
  try {
    // Tenter de récupérer le contenu du dossier BD depuis GitHub
    const response = await fetch(`${GITHUB_API_BASE}/BD`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // Ajouter un token GitHub si nécessaire pour éviter les limites de rate
        // 'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      },
      // Cache pendant 5 minutes
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      console.warn(`GitHub API error: ${response.status}, using fallback data`);
      return NextResponse.json(FALLBACK_BD_DATA);
    }

    const bdFolders: GitHubFile[] = await response.json();
    
    // Filtrer seulement les dossiers
    const folders = bdFolders.filter(item => item.type === 'dir');
    
    // Si aucun dossier trouvé, utiliser les données de fallback
    if (folders.length === 0) {
      console.warn('No BD folders found on GitHub, using fallback data');
      return NextResponse.json(FALLBACK_BD_DATA);
    }
    
    // Pour chaque dossier, récupérer son contenu
    const bdData: BDFolder[] = await Promise.all(
      folders.map(async (folder) => {
        try {
          const folderResponse = await fetch(`${GITHUB_API_BASE}/BD/${folder.name}`, {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
            },
            next: { revalidate: 300 }
          });

          if (!folderResponse.ok) {
            console.warn(`Failed to fetch folder ${folder.name}`);
            return {
              name: folder.name,
              path: folder.path,
              pages: [],
            };
          }

          const folderContents: GitHubFile[] = await folderResponse.json();
          
          // Filtrer les images (png, jpg, jpeg, gif, webp)
          const imageFiles = folderContents
            .filter(file => 
              file.type === 'file' && 
              /\.(png|jpg|jpeg|gif|webp)$/i.test(file.name)
            )
            .map(file => `${RAW_BASE}/${file.path}`)
            .sort((a, b) => {
              // Trier par numéro dans le nom de fichier
              const aNum = parseInt(a.match(/(\d+)/)?.[1] || '0');
              const bNum = parseInt(b.match(/(\d+)/)?.[1] || '0');
              return aNum - bNum;
            });

          // Chercher une image de couverture (première page ou fichier spécifique)
          let coverImage = imageFiles[0]; // Par défaut, première page
          
          // Chercher des noms spécifiques pour la couverture
          const coverNames = ['cover', 'couverture', 'thumb', 'thumbnail', '1', '01', '001'];
          for (const name of coverNames) {
            const foundCover = imageFiles.find(img => 
              img.toLowerCase().includes(name.toLowerCase())
            );
            if (foundCover) {
              coverImage = foundCover;
              break;
            }
          }

          // Chercher un fichier description.txt ou readme.txt
          const descriptionFile = folderContents.find(file => 
            file.type === 'file' && 
            /^(description|readme)\.txt$/i.test(file.name)
          );
          
          let description = `Bande dessinée "${folder.name}" - ${imageFiles.length} pages`;
          if (descriptionFile && descriptionFile.download_url) {
            try {
              const descResponse = await fetch(descriptionFile.download_url);
              if (descResponse.ok) {
                description = await descResponse.text();
              }
            } catch (error) {
              console.warn(`Failed to fetch description for ${folder.name}`);
            }
          }

          // Générer une date fictive basée sur l'ordre alphabétique pour le tri
          // En production, vous pourriez utiliser les commits Git pour la vraie date
          const createdAt = new Date(2024, 0, folders.indexOf(folder) + 1).toISOString();

          return {
            name: folder.name,
            path: folder.path,
            coverImage,
            pages: imageFiles,
            description: description.trim(),
            createdAt,
          };        } catch (error) {
          console.error(`Error processing folder ${folder.name}:`, error);
          return {
            name: folder.name,
            path: folder.path,
            pages: [],
          };
        }
      })
    );

    // Filtrer les dossiers vides et trier par date de création (plus récent en premier)
    const validBDData = bdData
      .filter(bd => bd.pages && bd.pages.length > 0)
      .sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

    return NextResponse.json(validBDData);

  } catch (error) {
    console.error('Error fetching BD folders from GitHub:', error);
    console.log('Using fallback data for development');
    
    // En cas d'erreur, retourner les données de fallback
    return NextResponse.json(FALLBACK_BD_DATA);
  }
}

// Optionnel : endpoint pour récupérer une BD spécifique
export async function POST(request: NextRequest) {
  try {
    const { folderName } = await request.json();
    
    if (!folderName) {
      return NextResponse.json(
        { error: 'Nom du dossier requis' },
        { status: 400 }
      );
    }

    const response = await fetch(`${GITHUB_API_BASE}/BD/${folderName}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const folderContents: GitHubFile[] = await response.json();
    
    const imageFiles = folderContents
      .filter(file => 
        file.type === 'file' && 
        /\.(png|jpg|jpeg|gif|webp)$/i.test(file.name)
      )
      .map(file => `${RAW_BASE}/${file.path}`)
      .sort((a, b) => {
        const aNum = parseInt(a.match(/(\d+)/)?.[1] || '0');
        const bNum = parseInt(b.match(/(\d+)/)?.[1] || '0');
        return aNum - bNum;
      });

    return NextResponse.json({
      name: folderName,
      pages: imageFiles,
    });

  } catch (error) {
    console.error('Error fetching specific BD:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération de la BD',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
