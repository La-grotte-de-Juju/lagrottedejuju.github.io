"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card } from "../ui/card";
import { ImageIcon, Loader2, X, Search, RefreshCw, AlertTriangle } from "lucide-react";
import { FanArtViewer } from "./FanArtViewer";
import { useIntersectionObserver } from "./useIntersectionObserver";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";

interface FanArt {
  name: string;
  download_url: string;
  path: string;
  sha: string;
  size?: 'small' | 'medium' | 'large' | 'tall' | 'wide';
  zoomFactor?: string; // Facteur de zoom pour l'effet visuel
  borderRadius?: string; // Rayon de bordure fixe pour l'effet bento
}

// Fonction utilitaire pour générer des tailles aléatoires
const generateRandomSize = (): 'small' | 'medium' | 'large' | 'tall' | 'wide' => {
  // Ajuster les probabilités pour favoriser certaines tailles
  // Petite: 40%, Moyenne: 30%, Grande: 10%, Tall (grand carré): 10%, Wide: 10%
  const rand = Math.random() * 100;
  
  if (rand < 40) return 'small';
  if (rand < 70) return 'medium';
  if (rand < 80) return 'large';
  if (rand < 90) return 'tall'; // Maintenant tall = grand carré
  return 'wide';
};

// Fonction pour générer un facteur de zoom aléatoire
const generateRandomZoomFactor = (): string => {
  // Générer un facteur entre 100% et 120%
  const factor = 100 + Math.floor(Math.random() * 20);
  return `${factor}%`;
};

// Bordure fixe avec un rayon bien équilibré pour toutes les cartes
const FIXED_BORDER_RADIUS = '1rem';

// Type représentant la grille et ses cellules occupées
interface GridPosition {
  row: number;
  col: number;
}

interface GridCell {
  isOccupied: boolean;
  fanArtIndex?: number; // Index de l'image qui occupe cette cellule
}

// Créer une grille de suivi pour éviter les trous
const createGrid = (rows: number, cols: number): GridCell[][] => {
  const grid: GridCell[][] = [];
  
  for (let i = 0; i < rows; i++) {
    grid[i] = [];
    for (let j = 0; j < cols; j++) {
      grid[i][j] = { isOccupied: false };
    }
  }
  
  return grid;
};

// Vérifier si une position est disponible dans la grille pour une taille spécifique
const isPositionAvailable = (grid: GridCell[][], row: number, col: number, rowSpan: number, colSpan: number): boolean => {
  const gridRows = grid.length;
  const gridCols = grid[0].length;
  
  // Vérifier si la position est dans les limites de la grille
  if (row + rowSpan > gridRows || col + colSpan > gridCols) {
    return false;
  }
  
  // Vérifier si les cellules sont disponibles
  for (let i = row; i < row + rowSpan; i++) {
    for (let j = col; j < col + colSpan; j++) {
      if (grid[i][j].isOccupied) {
        return false;
      }
    }
  }
  
  return true;
};

// Marquer une position comme occupée dans la grille
const markPositionOccupied = (grid: GridCell[][], row: number, col: number, rowSpan: number, colSpan: number, fanArtIndex: number): void => {
  for (let i = row; i < row + rowSpan; i++) {
    for (let j = col; j < col + colSpan; j++) {
      grid[i][j] = { 
        isOccupied: true,
        fanArtIndex: fanArtIndex
      };
    }
  }
};

// Fonction pour attribuer des tailles optimisées aux fanArts
const assignOptimizedSizesToFanArts = (fanArts: FanArt[]): FanArt[] => {
  // Définir les dimensions maximales de notre grille virtuelle
  const GRID_ROWS = 30; // Grande valeur pour avoir assez d'espace
  const GRID_COLS = 6;  // Correspond au nombre de colonnes sur desktop (lg:grid-cols-6)
  
  // Créer notre grille virtuelle
  const grid = createGrid(GRID_ROWS, GRID_COLS);
  
  // Définir les possibilités de tailles
  const sizeDimensions = {
    'small': { rowSpan: 1, colSpan: 1 },
    'medium': { rowSpan: 1, colSpan: 2 },
    'large': { rowSpan: 2, colSpan: 2 },
    'tall': { rowSpan: 2, colSpan: 2 },
    'wide': { rowSpan: 1, colSpan: 3 }
  };
  
  // Préparation du résultat
  const result = [...fanArts];
  
  // Parcourir la grille ligne par ligne, colonne par colonne
  for (let fanArtIndex = 0; fanArtIndex < fanArts.length; fanArtIndex++) {
    let placed = false;
    
    // Trouver la première position disponible pour l'image
    outer: for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        if (!grid[row][col].isOccupied) {
          // Tester les tailles dans cet ordre : essayer d'équilibrer la distribution
          const sizesToTry: ('small' | 'medium' | 'large' | 'tall' | 'wide')[] = [];
          
          // Si on a une ligne complète ou presque, favoriser les petites tailles pour combler
          if (col >= GRID_COLS - 2) {
            sizesToTry.push('small');
            sizesToTry.push('medium');
            sizesToTry.push('large');
            sizesToTry.push('tall');
            sizesToTry.push('wide');
          } else {
            // Sinon, privilégier une distribution équilibrée
            const rand = Math.random() * 100;
            
            if (rand < 40) {
              sizesToTry.push('small', 'medium', 'large', 'tall', 'wide');
            } else if (rand < 70) {
              sizesToTry.push('medium', 'small', 'large', 'wide', 'tall');
            } else if (rand < 80) {
              sizesToTry.push('large', 'tall', 'medium', 'wide', 'small');
            } else if (rand < 90) {
              sizesToTry.push('tall', 'large', 'medium', 'small', 'wide');
            } else {
              sizesToTry.push('wide', 'medium', 'small', 'large', 'tall');
            }
          }
          
          // Tester les différentes tailles jusqu'à trouver une qui convient
          for (const size of sizesToTry) {
            const { rowSpan, colSpan } = sizeDimensions[size];
            
            if (isPositionAvailable(grid, row, col, rowSpan, colSpan)) {
              // Attribuer cette taille et marquer les cellules comme occupées
              result[fanArtIndex] = {
                ...result[fanArtIndex],
                size: size,
                zoomFactor: generateRandomZoomFactor(),
                borderRadius: FIXED_BORDER_RADIUS
              };
              
              markPositionOccupied(grid, row, col, rowSpan, colSpan, fanArtIndex);
              placed = true;
              break outer;
            }
          }
        }
      }
    }
    
    // Si l'image n'a pas pu être placée, lui attribuer une taille small par défaut
    if (!placed) {
      result[fanArtIndex] = {
        ...result[fanArtIndex],
        size: 'small',
        zoomFactor: generateRandomZoomFactor(),
        borderRadius: FIXED_BORDER_RADIUS
      };
    }
  }
  
  return result;
};

// Fonction pour attribuer une taille à chaque fan art
const assignRandomSizesToFanArts = (fanArts: FanArt[]): FanArt[] => {
  // Utiliser l'algorithme optimisé pour éviter les trous dans la grille
  return assignOptimizedSizesToFanArts(fanArts);
};

export default function FanArtGallery() {
  // Pour les fan arts
  const [fanArts, setFanArts] = useState<FanArt[]>([]);
  const [filteredFanArts, setFilteredFanArts] = useState<FanArt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Pagination
  const ITEMS_PER_PAGE = 12;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [showLoadAllWarning, setShowLoadAllWarning] = useState(false);
  
  // Animation progressive
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const ANIMATION_DELAY_MS = 100; // Délai entre chaque carte (0.1 seconde)
  
  // États communs
  const [selectedFanArt, setSelectedFanArt] = useState<FanArt | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fonction pour récupérer les fan arts avec useCallback
  const fetchFanArts = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    if (forceRefresh) setRefreshing(true);
    
    try {
      // Check local storage cache first
      const cacheKey = 'fanArtsCache-classic';
      const timestampKey = 'fanArtsCacheTimestamp-classic';
      const cachedData = localStorage.getItem(cacheKey);
      const cachedTimestamp = localStorage.getItem(timestampKey);
      const now = new Date().getTime();
      
      // If we have cached data and it's less than 30 minutes old, use it (unless forceRefresh is true)
      if (!forceRefresh && cachedData && cachedTimestamp && now - parseInt(cachedTimestamp) < 30 * 60 * 1000) {
        const parsedData = JSON.parse(cachedData);
        // Attribuer de nouvelles tailles aléatoires à chaque chargement même avec des données en cache
        const sizedFanArts = assignRandomSizesToFanArts(parsedData);
        setFanArts(sizedFanArts);
        setFilteredFanArts(sortFanArts(sizedFanArts, sortOrder));
        setLastUpdated(new Date(parseInt(cachedTimestamp)).toLocaleTimeString());
        setLoading(false);
        return;
      }
      
      setRefreshing(true);

      // Otherwise fetch from API
      const response = await fetch(
        `https://api.github.com/repos/La-grotte-de-Juju/La-grotte-de-Juju-Ressources/contents/Fanarts/classic`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des fan arts: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Filter only image files
      const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
      const imageFiles = data.filter((item: {type: string; name: string}) =>
        item.type === "file" &&
        imageExtensions.some(ext => item.name.toLowerCase().endsWith(ext))
      );

      // Add raw content URL to each image without size (will be assigned by optimized algorithm)
      const fanArtsWithUrls = imageFiles.map((file: {name: string; download_url: string; path: string; sha: string}) => ({
        name: file.name,
        download_url: file.download_url,
        path: file.path,
        sha: file.sha
      }));
      
      // Appliquer l'algorithme d'optimisation des tailles pour éviter les trous
      const optimizedFanArts = assignOptimizedSizesToFanArts(fanArtsWithUrls);

      // Save optimized fan arts to localStorage cache
      try {
        // Stocker seulement les données de base sans les tailles (pour permettre différentes dispositions à chaque chargement)
        localStorage.setItem(cacheKey, JSON.stringify(fanArtsWithUrls));
        const timestamp = new Date().getTime();
        localStorage.setItem(timestampKey, timestamp.toString());
        setLastUpdated(new Date(timestamp).toLocaleTimeString());
      } catch (e) {
        console.warn(`Failed to cache fan arts data:`, e);
      }

      setFanArts(optimizedFanArts);
      setFilteredFanArts(sortFanArts(optimizedFanArts, sortOrder));
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      console.error(`Erreur lors de la récupération des fan arts:`, err);
      setError(`Impossible de charger les fan arts. Veuillez réessayer plus tard.`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [sortOrder]);

  // Fonction pour forcer un rafraîchissement
  const handleRefresh = () => {
    fetchFanArts(true);
    if (!isSearchMode) setVisibleCount(ITEMS_PER_PAGE);
    
    // Réappliquer des tailles aléatoires aux images actuellement affichées
    // pour changer l'aspect de la galerie sans recharger les données
    const resizedFanArts = assignRandomSizesToFanArts([...fanArts]);
    setFanArts(resizedFanArts);
    setFilteredFanArts(sortFanArts(resizedFanArts, sortOrder));
  };

  // Référence pour la détection d'intersection
  const galleryRef = useRef<HTMLDivElement>(null);
  const isGalleryVisible = useIntersectionObserver(galleryRef);

  // Charger les fan arts au chargement
  useEffect(() => {
    fetchFanArts();
  }, [fetchFanArts]);

  // Fonction pour charger progressivement les images
  // Cette nouvelle approche affiche toutes les images immédiatement,
  // mais contrôle leur animation d'entrée pour créer une expérience fluide
  const loadImagesProgressively = useCallback((totalCount: number) => {
    // Rendre toutes les images visibles immédiatement, sans animation d'entrée
    // Cela résout fondamentalement le problème de "déplacement du bug"
    setVisibleItems(Array.from({ length: totalCount }, (_, i) => i));
    
    // Plus besoin d'intervalle car toutes les images sont déjà visibles dans le DOM
    // L'animation sera gérée par CSS avec des délais calculés dynamiquement
    
    // Pas besoin de nettoyage d'intervalle car nous n'en utilisons plus
    return () => {};
  }, []);

  // Déclencher le chargement progressif quand les images changent ou que la galerie devient visible
  useEffect(() => {
    // Vérifier si on a des images à afficher, si le chargement initial est terminé, et si la galerie est visible
    if (!loading && filteredFanArts.length > 0 && (isGalleryVisible || visibleItems.length > 0)) {
      const itemsToShow = isSearchMode 
        ? filteredFanArts.length 
        : Math.min(visibleCount, filteredFanArts.length);
      
      // Attendre que le DOM soit prêt avant de déclencher l'animation
      requestAnimationFrame(() => {
        // Rendre toutes les images visibles immédiatement pour résoudre les problèmes de chargement initial
        loadImagesProgressively(itemsToShow);
  
        // Réinitialiser le registre des images chargées quand la liste change
        setImagesLoaded({});
      });
    }
  }, [loading, filteredFanArts, visibleCount, isSearchMode, isGalleryVisible, loadImagesProgressively, visibleItems.length]);

  // Fonction pour trier les fan arts selon différents critères
  const sortFanArts = (arts: FanArt[], order: 'newest' | 'oldest' | 'alphabetical'): FanArt[] => {
    const sorted = [...arts];

    switch (order) {
      case 'alphabetical':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
        // Pour simuler un tri par date, on utilise le sha comme approximation
        return sorted.sort((a, b) => b.sha.localeCompare(a.sha));
      case 'oldest':
        return sorted.sort((a, b) => a.sha.localeCompare(b.sha));
      default:
        return sorted;
    }
  };
  
  // Appliquer le tri et le filtrage lorsque le critère change
  useEffect(() => {
    if (fanArts.length > 0) {
      let results = [...fanArts];
      
      // Filtre par recherche si on a un terme de recherche
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        results = results.filter(art => 
          art.name.toLowerCase().includes(query)
        );
        // Activer le mode recherche pour afficher tous les résultats
        setIsSearchMode(true);
      } else {
        // Désactiver le mode recherche quand on efface la recherche
        setIsSearchMode(false);
        // Réinitialiser le compteur visible au nombre par défaut
        setVisibleCount(ITEMS_PER_PAGE);
      }
      
      // Trier les résultats
      results = sortFanArts(results, sortOrder);
      
      setFilteredFanArts(results);
    }
  }, [sortOrder, fanArts, searchQuery, ITEMS_PER_PAGE]);

  const handleFanArtClick = (fanArt: FanArt) => {
    setSelectedFanArt(fanArt);
    setViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setViewerOpen(false);
  };
  
  // Fonction pour charger plus d'images
  const loadMoreImages = () => {
    // Calculer le nouveau nombre total d'images à afficher
    const newCount = Math.min(visibleCount + ITEMS_PER_PAGE, filteredFanArts.length);
    
    // Mettre à jour la visibilité de toutes les images en une seule fois
    // plutôt que progressivement, pour éviter les problèmes d'affichage
    setVisibleCount(newCount);
    setVisibleItems(Array.from({ length: newCount }, (_, i) => i));
  };
  
  // Fonction pour charger toutes les images
  const loadAllImages = () => {
    // Cacher l'avertissement
    setShowLoadAllWarning(false);
    
    // Mettre à jour le nombre total d'images à afficher
    const allImagesCount = filteredFanArts.length;
    
    // Afficher toutes les images
    setVisibleCount(allImagesCount);
    setVisibleItems(Array.from({ length: allImagesCount }, (_, i) => i));
  };
  
  // Afficher l'avertissement avant de charger toutes les images
  const showLoadAllWarningModal = () => {
    setShowLoadAllWarning(true);
  };
  
  // Gérer la navigation entre les images en mode plein écran
  useEffect(() => {
    const handleNext = (event: Event) => {
      const customEvent = event as CustomEvent;
      setSelectedFanArt(customEvent.detail.fanArt);
    };
    
    const handlePrev = (event: Event) => {
      const customEvent = event as CustomEvent;
      setSelectedFanArt(customEvent.detail.fanArt);
    };
    
    document.addEventListener('nextFanArt', handleNext);
    document.addEventListener('prevFanArt', handlePrev);
    
    return () => {
      document.removeEventListener('nextFanArt', handleNext);
      document.removeEventListener('prevFanArt', handlePrev);
    };
  }, []);
  
  // Affichage du chargement
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] p-8">
        <img 
          src="/images/JujuLoading.gif" 
          alt="Chargement en cours" 
          className="w-20 h-20 mb-4"
        />
        <p className="text-xl text-gray-600 dark:text-gray-400">Acquisition des images depuis l'API...</p>
      </div>
    );
  }

  // Affichage des erreurs
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 text-center">
        <ImageIcon className="h-16 w-16 text-red-500 mb-4" />
        <p className="text-xl font-medium mb-2">Oups! Une erreur est survenue</p>
        <p className="text-gray-600 dark:text-gray-400">
          {error}
        </p>
      </div>
    );
  }

  // Calcul du nombre total d'images affichées
  const totalImages = filteredFanArts.length;
  const totalOriginalImages = fanArts.length;
  
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Barre latérale fixe pour PC - cachée sur mobile - centrée verticalement */}
      <div className="hidden md:block md:w-64 lg:w-72 flex-shrink-0">
        <div className="sticky top-32 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-4 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex flex-col gap-5">
            {/* Recherche */}
            <div className="relative w-full">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Rechercher des fan arts
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <Search className="h-4 w-4" />
                </div>
                {searchQuery && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchMode(false);
                      setVisibleCount(ITEMS_PER_PAGE);
                    }}
                    className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-full transition-all"
                    aria-label="Effacer la recherche"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Tri */}
            <div>
              <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Trier par
              </label>
              <select
                id="sort-order"
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value as 'newest' | 'oldest' | 'alphabetical');
                  // Réinitialiser le nombre d'images visibles lors d'un changement de tri
                  if (!isSearchMode) setVisibleCount(ITEMS_PER_PAGE);
                }}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="newest">Plus récent</option>
                <option value="oldest">Plus ancien</option>
                <option value="alphabetical">Alphabétique</option>
              </select>
            </div>
            
            {/* Compteur de résultats */}
            {totalOriginalImages > 0 && (
              <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                <div className="font-medium mb-1">Statistiques</div>
                <div className="flex justify-between mt-1">
                  <span>Fan arts:</span>
                  <span className="font-medium">{filteredFanArts.length}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                <div className="flex justify-between">
                  <span>Total affiché:</span> 
                  <span className="font-medium">
                    {isSearchMode 
                      ? filteredFanArts.length 
                      : Math.min(visibleCount, filteredFanArts.length)}
                  </span>
                </div>
                {lastUpdated && (
                  <>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                    <div className="flex justify-between">
                      <span>Mise à jour:</span> 
                      <span className="font-medium">{lastUpdated}</span>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {/* Bouton de rafraîchissement */}
            <button
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className={`w-full py-2 px-3 flex items-center justify-center gap-2 text-sm font-medium rounded-md 
                ${refreshing || loading 
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                  : 'bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-800/40 text-purple-600 dark:text-purple-300 hover:text-purple-700'}`}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Mise à jour...' : 'Rafraîchir les images'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Contenu principal */}
      <div className="flex-1">
        {/* Barre mobile - visible uniquement sur mobile */}
        <div className="md:hidden flex flex-col gap-4 mb-6 px-3">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Rechercher des fan arts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md pl-9 pr-4 py-3 text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <div className="absolute left-3 top-3.5 text-gray-400">
              <Search className="h-4 w-4" />
            </div>
            {searchQuery && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchMode(false);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-full transition-all"
                aria-label="Effacer la recherche"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2 w-full">
            <label htmlFor="mobile-sort-order" className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
              Trier par:
            </label>              <select
                id="mobile-sort-order"
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value as 'newest' | 'oldest' | 'alphabetical');
                  // Réinitialiser le nombre d'images visibles lors d'un changement de tri
                  if (!isSearchMode) setVisibleCount(ITEMS_PER_PAGE);
                }}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-base w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
              <option value="newest">Plus récent</option>
              <option value="oldest">Plus ancien</option>
              <option value="alphabetical">Alphabétique</option>
            </select>
          </div>
          
          {/* Bouton de rafraîchissement mobile */}
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className={`w-full py-2 px-3 flex items-center justify-center gap-2 text-sm font-medium rounded-md 
              ${refreshing || loading 
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                : 'bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-800/40 text-purple-600 dark:text-purple-300 hover:text-purple-700'}`}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Mise à jour...' : 'Rafraîchir les images'}
          </button>
          
          {/* Compteur mobile */}
          {totalOriginalImages > 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {isSearchMode ? (
                <span>{filteredFanArts.length} fan art{filteredFanArts.length > 1 ? 's' : ''} trouvé{filteredFanArts.length > 1 ? 's' : ''}</span>
              ) : (
                <span>{Math.min(visibleCount, filteredFanArts.length)} fan art{Math.min(visibleCount, filteredFanArts.length) > 1 ? 's' : ''} affichés sur {filteredFanArts.length} au total</span>
              )}
              {lastUpdated && (
                <span className="block mt-1 text-xs">Dernière mise à jour: {lastUpdated}</span>
              )}
            </div>
          )}
        </div>

        {/* Section promotion pour soumettre des fan arts - avec effet arc-en-ciel pastel animé */}
        <div className="mb-8 mx-4">
          <div className="relative overflow-hidden rounded-lg">
            {/* Carte avec fond arc-en-ciel pastel animé et contour intérieur blanc */}
            <div
              className="p-5 text-center relative"
              style={{
                background: 'linear-gradient(to right, rgba(199, 210, 254, 0.8), rgba(221, 214, 254, 0.8), rgba(251, 207, 232, 0.8))',
                backgroundSize: '200% 200%',
                animation: 'gradientBg 8s ease infinite'
              }}
            >
              {/* Contour intérieur blanc avec légère opacité */}
              <div 
                className="absolute inset-0 pointer-events-none rounded-sm"
                style={{ 
                  boxShadow: 'inset 0 0 0 2px rgba(255, 255, 255, 0.6)'
                }}
              ></div>
              
              <p className="font-medium relative">
                <span style={{ 
                  background: 'linear-gradient(to right, #4f46e5, #9333ea, #db2777)', 
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundSize: '200% 200%',
                  animation: 'gradientBg 8s ease infinite'
                }}>
                  Tu as créé un fan art ? Partage ta création avec nous sur les réseaux sociaux ou contacte-nous directement pour l'ajouter à la galerie !
                </span>
              </p>
            </div>
            
            {/* Effet d'ombre arc-en-ciel pastel sous la carte */}
            <div 
              className="absolute -bottom-4 -z-10 left-2 right-2 h-8 blur-xl opacity-40"
              style={{
                background: 'linear-gradient(to right, rgba(199, 210, 254, 0.6), rgba(221, 214, 254, 0.6), rgba(251, 207, 232, 0.6))',
                backgroundSize: '200% 200%',
                animation: 'gradientBg 8s ease infinite',
                transformOrigin: 'center bottom'
              }}
            />
          </div>
          
          {/* Style pour l'animation du dégradé */}
          <style jsx>{`
            @keyframes gradientBg {
              0% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
              100% {
                background-position: 0% 50%;
              }
            }
            
            /* Styles pour la galerie bento optimisée - évite les trous dans la grille */
            /* L'algorithme d'attribution des tailles assure un remplissage optimal */
            .bento-card {
              transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .bento-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            }
            
            /* Style spécifique pour les grandes cartes carrées (tall) */
            .tall-card {
              transition: transform 0.3s ease, box-shadow 0.4s ease;
            }
            
            .tall-card:hover {
              transform: translateY(-7px) scale(1.01);
              box-shadow: 0 15px 30px -10px rgba(168, 85, 247, 0.2), 
                          0 10px 20px -5px rgba(168, 85, 247, 0.1);
            }
            
            /* Style spécifique pour les images des cartes tall */
            .tall-image {
              transition: all 0.5s ease-out;
            }
            
            .group:hover .tall-image {
              transform: scale(1.12) !important;
              filter: contrast(1.05) brightness(1.02);
            }
          `}</style>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center p-8">
              <img 
                src="/images/JujuLoading.gif" 
                alt="Chargement en cours" 
                className="w-16 h-16 mb-2"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">Acquisition des images...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mx-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : filteredFanArts.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 md:p-6 mx-2 md:mx-4 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                {searchQuery ? (
                  <>Aucun Fan Art ne correspond à votre recherche.</>
                ) : (
                  <>Aucun Fan Art disponible pour le moment.</>
                )}
              </p>
            </div>
          ) : (
            <>
              <div
                ref={galleryRef}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 auto-rows-[160px] gap-4 md:gap-5 p-3 md:p-4 min-h-[400px] will-change-contents"
                style={{
                  // Utiliser dense pour combler les espaces vides automatiquement
                  gridAutoFlow: 'dense'
                }}
              >
                {/* Afficher uniquement le nombre visible d'images ou toutes si en mode recherche */}
                {(isSearchMode ? filteredFanArts : filteredFanArts.slice(0, visibleCount)).map((fanArt, index) => {
                  // Définir les classes CSS en fonction de la taille optimisée attribuée à cette image
                  const sizeClasses = {
                    'small': 'col-span-1 row-span-1',
                    'medium': 'col-span-2 row-span-1',
                    'large': 'col-span-2 row-span-2',
                    'tall': 'col-span-2 row-span-2',
                    'wide': 'col-span-3 row-span-1'
                  };
                  
                  // Classe de taille par défaut si non définie
                  const sizeClass = sizeClasses[fanArt.size || 'medium'];
                  
                  return (
                    <div
                      key={fanArt.sha}
                      className={`${sizeClass} opacity-0 translate-y-4 transition-all ${index < 8 ? 'duration-300' : 'duration-500'} ${visibleItems.includes(index) ? 'opacity-100 translate-y-0' : ''}`}
                      style={{ 
                        transitionDelay: `${Math.min(index % 8 * 50, 350)}ms`
                      }}
                    >
                      <Card
                        className={`overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] transform cursor-pointer group h-full bento-card ${fanArt.size === 'tall' ? 'tall-card' : ''}`}
                        onClick={() => handleFanArtClick(fanArt)}
                        style={{
                          borderRadius: FIXED_BORDER_RADIUS,
                          // Ajouter un subtil effet de bordure pour les cartes de type 'tall'
                          boxShadow: fanArt.size === 'tall' ? '0 0 0 2px rgba(168, 85, 247, 0.15)' : undefined,
                        }}
                      >
                        <div className="relative w-full h-full overflow-hidden" style={{ borderRadius: 'inherit' }}>
                          {/* Loading indicator shown while the image is loading */}
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10 transition-opacity group-hover:opacity-0">
                            <img 
                              src="/images/JujuLoading.gif" 
                              alt="Chargement"
                              className="w-12 h-12" 
                            />
                          </div>

                          <img
                            src={fanArt.download_url}
                            alt={`Fan art: ${fanArt.name}`}
                            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${fanArt.size === 'tall' ? 'tall-image' : ''}`}
                            style={{ 
                              objectFit: 'cover', 
                              // Appliquer un facteur de zoom aléatoire, légèrement plus grand pour les cartes tall
                              objectPosition: 'center',
                              transform: fanArt.zoomFactor ? 
                                `scale(${fanArt.size === 'tall' ? 
                                  Math.min(parseFloat(fanArt.zoomFactor) / 100 + 0.05, 1.25) : 
                                  parseFloat(fanArt.zoomFactor) / 100})` : 
                                'none',
                              borderRadius: 'inherit'
                            }}
                            loading="eager"
                            fetchPriority={index < 8 ? "high" : "auto"}
                            onLoad={(e) => {
                              // Marquer cette image comme chargée dans notre registre
                              setImagesLoaded(prev => ({ ...prev, [fanArt.sha]: true }));
                              
                              // Hide loader when image loads
                              const target = e.target as HTMLImageElement;
                              const parent = target.parentElement;
                              if (parent) {
                                const loader = parent.querySelector('div');
                                if (loader) {
                                  loader.classList.add('opacity-0');
                                  setTimeout(() => {
                                    if (loader && loader.parentElement) {
                                      loader.parentElement.removeChild(loader);
                                    }
                                  }, 300);
                                }
                              }
                            }}
                          />
                          
                          {/* Overlay pour l'effet hover avec titre qui apparaît seulement au survol */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end opacity-0 group-hover:opacity-100">
                            <span className="text-white text-xs md:text-sm p-2 truncate w-full bg-black/50 backdrop-blur-sm">
                              {fanArt.name.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </div>
              
              {/* Boutons "Charger plus" et "Charger tout" - affichés uniquement si pas en mode recherche et s'il reste des images à charger */}
              {!isSearchMode && visibleCount < filteredFanArts.length && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6 mb-4">
                  <button
                    onClick={loadMoreImages}
                    className="py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium rounded-md bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-800/40 text-purple-600 dark:text-purple-300 hover:text-purple-700 transition-all duration-200"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Charger 12 images de plus ({Math.min(ITEMS_PER_PAGE, filteredFanArts.length - visibleCount)} sur {filteredFanArts.length - visibleCount})
                  </button>
                  
                  <button
                    onClick={showLoadAllWarningModal}
                    className="py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium rounded-md bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40 text-red-600 dark:text-red-400 hover:text-red-700 transition-all duration-200"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Tout charger ({filteredFanArts.length - visibleCount} restants)
                  </button>
                </div>
              )}
              
              {/* Boîte de dialogue d'avertissement pour charger toutes les images */}
              <Dialog open={showLoadAllWarning} onOpenChange={setShowLoadAllWarning}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Attention
                    </DialogTitle>
                    <DialogDescription>
                      Vous êtes sur le point de charger toutes les {filteredFanArts.length - visibleCount} images restantes.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-3 space-y-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Cette action peut :
                    </p>
                    <ul className="list-disc pl-5 text-sm space-y-1.5 text-gray-700 dark:text-gray-300">
                      <li>Ralentir considérablement votre navigateur</li>
                      <li>Consommer beaucoup de bande passante</li>
                      <li>Prendre du temps en fonction de votre connexion internet</li>
                      <li>Augmenter le trafic sur notre serveur</li>
                    </ul>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                      Il est recommandé de charger les images progressivement pour une meilleure expérience.
                    </p>
                  </div>
                  
                  <DialogFooter className="flex sm:justify-between">
                    <Button variant="outline" onClick={() => setShowLoadAllWarning(false)}>
                      Annuler
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={loadAllImages} 
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Charger quand même
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>
      
      {/* Viewer de Fan Art */}
      <FanArtViewer
        fanArt={selectedFanArt}
        isOpen={viewerOpen}
        onClose={handleCloseViewer}
        allFanArts={filteredFanArts}
      />
    </div>
  );
}
