"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card } from "../ui/card";
import { ImageIcon, Loader2, X, Search, RefreshCw, AlertTriangle, Leaf, XCircle, Trash2 } from "lucide-react";
import { FanArtViewer } from "./FanArtViewer";
import { useIntersectionObserver } from "./useIntersectionObserver";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";

// Define interfaces for GitHub API responses
interface GithubContentEntry {
  type: string;
  name: string;
  path: string;
  sha: string;
  download_url: string | null;
}

interface GitHubFile extends GithubContentEntry {
  type: 'file';
  download_url: string; // Ensure download_url is string for files
}

interface FanArt {
  name: string;
  download_url: string;
  path: string;
  sha: string;
  commitDate?: string; // Added to store the commit date
  size?: 'small' | 'medium' | 'large' | 'tall' | 'wide';
  zoomFactor?: string; 
  borderRadius?: string; 
}

const generateRandomSize = (): 'small' | 'medium' | 'large' | 'tall' | 'wide' => {
  const rand = Math.random() * 100;
  if (rand < 40) return 'small';
  if (rand < 70) return 'medium';
  if (rand < 80) return 'large';
  if (rand < 90) return 'tall'; 
  return 'wide';
};

const generateRandomZoomFactor = (): string => {
  const factor = 100 + Math.floor(Math.random() * 20);
  return `${factor}%`;
};

const FIXED_BORDER_RADIUS = '1rem';

interface GridPosition {
  row: number;
  col: number;
}

interface GridCell {
  isOccupied: boolean;
  fanArtIndex?: number; 
}

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

const isPositionAvailable = (grid: GridCell[][], row: number, col: number, rowSpan: number, colSpan: number): boolean => {
  const gridRows = grid.length;
  const gridCols = grid[0].length;
  if (row + rowSpan > gridRows || col + colSpan > gridCols) {
    return false;
  }
  for (let i = row; i < row + rowSpan; i++) {
    for (let j = col; j < col + colSpan; j++) {
      if (grid[i][j].isOccupied) {
        return false;
      }
    }
  }
  return true;
};

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

const assignOptimizedSizesToFanArts = (fanArts: FanArt[]): FanArt[] => {
  const GRID_ROWS = 30; 
  const GRID_COLS = 6;  
  const grid = createGrid(GRID_ROWS, GRID_COLS);
  const sizeDimensions = {
    'small': { rowSpan: 1, colSpan: 1 },
    'medium': { rowSpan: 1, colSpan: 2 },
    'large': { rowSpan: 2, colSpan: 2 },
    'tall': { rowSpan: 2, colSpan: 2 },
    'wide': { rowSpan: 1, colSpan: 3 }
  };
  const result = [...fanArts];
  for (let fanArtIndex = 0; fanArtIndex < fanArts.length; fanArtIndex++) {
    let placed = false;
    outer: for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        if (!grid[row][col].isOccupied) {
          const sizesToTry: ('small' | 'medium' | 'large' | 'tall' | 'wide')[] = [];
          if (col >= GRID_COLS - 2) {
            sizesToTry.push('small');
            sizesToTry.push('medium');
            sizesToTry.push('large');
            sizesToTry.push('tall');
            sizesToTry.push('wide');
          } else {
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
          for (const size of sizesToTry) {
            const { rowSpan, colSpan } = sizeDimensions[size];
            if (isPositionAvailable(grid, row, col, rowSpan, colSpan)) {
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

const assignRandomSizesToFanArts = (fanArts: FanArt[]): FanArt[] => {
  return assignOptimizedSizesToFanArts(fanArts);
};

export default function FanArtGallery() {
  const [fanArts, setFanArts] = useState<FanArt[]>([]);
  const [filteredFanArts, setFilteredFanArts] = useState<FanArt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const ITEMS_PER_PAGE = 10;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [showLoadAllWarning, setShowLoadAllWarning] = useState(false);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const ANIMATION_DELAY_MS = 100; 
  const [selectedFanArt, setSelectedFanArt] = useState<FanArt | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showClearCacheConfirmDialog, setShowClearCacheConfirmDialog] = useState(false);

  const sortFanArts = useCallback((arts: FanArt[], order: typeof sortOrder): FanArt[] => {
    return [...arts].sort((a, b) => {
      if (order === 'newest') {
        return new Date(b.commitDate || 0).getTime() - new Date(a.commitDate || 0).getTime();
      }
      if (order === 'oldest') {
        return new Date(a.commitDate || 0).getTime() - new Date(b.commitDate || 0).getTime();
      }
      if (order === 'alphabetical') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, []);

  const fetchFanArts = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    if (forceRefresh) setRefreshing(true);
    
    const cacheKey = 'fanArtsCache-ressources-classic-v1'; 
    const timestampKey = 'fanArtsCacheTimestamp-ressources-classic-v1';
    const lastCommitDateKey = 'fanArtsLastCommitDate-ressources-classic-v1';

    try {
      const cachedData = localStorage.getItem(cacheKey);
      const cachedTimestamp = localStorage.getItem(timestampKey);
      const cachedLastCommitDate = localStorage.getItem(lastCommitDateKey);
      const now = new Date().getTime();
      
      if (!forceRefresh && cachedData && cachedTimestamp && cachedLastCommitDate && now - parseInt(cachedTimestamp) < 30 * 60 * 1000) {
        const parsedData = JSON.parse(cachedData) as FanArt[];
        const sizedFanArts = assignRandomSizesToFanArts(parsedData);
        setFanArts(sizedFanArts);
        setFilteredFanArts(sortFanArts(sizedFanArts, sortOrder));
        setLastUpdated(new Date(cachedLastCommitDate).toLocaleString());
        setLoading(false);
        setRefreshing(false);
        return;
      }
      
      setRefreshing(true);

      const response = await fetch('https://api.github.com/repos/La-grotte-de-Juju/La-grotte-de-Juju-Ressources/contents/Fanarts/classic?ref=main');
      
      if (!response.ok) {
        let errorBody = "Unknown error details";
        try {
          errorBody = await response.text(); 
        } catch (e) { /* ignore if can't read body */ }
        console.error(`GitHub API error: ${response.status} - ${response.statusText}. Body: ${errorBody}`);
        if (response.status === 403) {
          throw new Error("Erreur 403: Accès refusé par l'API GitHub. Cela est souvent dû à des limitations de débit pour les requêtes non authentifiées. Veuillez réessayer plus tard. Les détails techniques sont dans la console.");
        }
        throw new Error(`L'API GitHub a retourné une erreur ${response.status}. Les détails ont été enregistrés dans la console.`);
      }

      const rawData = await response.json();

      if (!Array.isArray(rawData)) {
        console.error("GitHub API did not return an array for Fanarts. Received:", rawData);
        throw new Error("Format de données incorrect reçu de l'API GitHub (attendu un tableau).");
      }

      const fanArtItems = (rawData as GithubContentEntry[]).filter(
        (item: GithubContentEntry): item is GitHubFile =>
        item.type === 'file' &&
        /\.(jpg|jpeg|png|gif|webp)$/i.test(item.name)
      );

      const fanArtsWithDatesPromises = fanArtItems.map(async (item: GitHubFile) => {
        try {
          const commitResponse = await fetch(`https://api.github.com/repos/La-grotte-de-Juju/La-grotte-de-Juju-Ressources/commits?path=${encodeURIComponent(item.path)}&page=1&per_page=1&ref=main`);
          if (!commitResponse.ok) {
            console.warn(`Impossible de récupérer la date de commit pour ${item.path}: ${commitResponse.status}`);
            return { ...item, download_url: item.download_url, commitDate: new Date(0).toISOString() };
          }
          const commitData = await commitResponse.json();
          const commitDate = (Array.isArray(commitData) && commitData.length > 0 && commitData[0]?.commit?.committer?.date) 
                           ? commitData[0].commit.committer.date 
                           : new Date(0).toISOString();
          return { ...item, download_url: item.download_url, commitDate };
        } catch (commitError) {
          console.warn(`Erreur lors de la récupération de la date de commit pour ${item.path}:`, commitError);
          return { ...item, download_url: item.download_url, commitDate: new Date(0).toISOString() };
        }
      });
      
      const fanArtsWithDates = await Promise.all(fanArtsWithDatesPromises);
      
      const latestCommitDate = fanArtsWithDates.reduce((latest, art) => {
        const artDate = new Date(art.commitDate || 0);
        return artDate > latest ? artDate : latest;
      }, new Date(0));
      
      const sizedFanArts = assignRandomSizesToFanArts(fanArtsWithDates);
      const sortedAndSizedFanArts = sortFanArts(sizedFanArts, sortOrder);

      setFanArts(sortedAndSizedFanArts);
      setFilteredFanArts(sortedAndSizedFanArts);
      setLastUpdated(latestCommitDate.toLocaleString());

      localStorage.setItem(cacheKey, JSON.stringify(fanArtsWithDates));
      localStorage.setItem(timestampKey, new Date().getTime().toString());
      localStorage.setItem(lastCommitDateKey, latestCommitDate.toISOString());

    } catch (err: unknown) { 
      console.error("Échec de la récupération des fan arts:", err);
      let displayError = "Oups! Une erreur est survenue\n\nImpossible de charger les fan arts. Veuillez réessayer plus tard.";
      if (err instanceof Error) {
         if (err.message.includes("L'API GitHub a retourné une erreur") || 
             err.message.includes("Format de données incorrect") ||
             err.message.includes("Erreur 403: Accès refusé par l'API GitHub")) {
             displayError = err.message;
         }
      }
      setError(displayError);
      
      localStorage.removeItem(cacheKey);
      localStorage.removeItem(timestampKey);
      localStorage.removeItem(lastCommitDateKey);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [sortOrder, sortFanArts]);

  const handleRefresh = () => {
    fetchFanArts(true);
    if (!isSearchMode) setVisibleCount(ITEMS_PER_PAGE);
    const resizedFanArts = assignRandomSizesToFanArts([...fanArts]);
    setFanArts(resizedFanArts);
    setFilteredFanArts(sortFanArts(resizedFanArts, sortOrder));
  };

  const handleClearCache = () => {
    setShowClearCacheConfirmDialog(true);
  };

  const confirmClearCache = () => {
    setShowClearCacheConfirmDialog(false);
    const cacheBuster = `?cacheBust=${new Date().getTime()}`;

    setFanArts(prevFanArts =>
      prevFanArts.map(art => ({
        ...art,
        download_url: art.download_url.split('?')[0] + cacheBuster,
      }))
    );
  };

  const galleryRef = useRef<HTMLDivElement>(null);
  const isGalleryVisible = useIntersectionObserver(galleryRef);

  useEffect(() => {
    fetchFanArts();
  }, [fetchFanArts]);

  const loadImagesProgressively = useCallback((totalCount: number) => {
    setVisibleItems(Array.from({ length: totalCount }, (_, i) => i));
    return () => {};
  }, []);

  useEffect(() => {
    if (!loading && filteredFanArts.length > 0 && (isGalleryVisible || visibleItems.length > 0)) {
      const itemsToShow = isSearchMode 
        ? filteredFanArts.length 
        : Math.min(visibleCount, filteredFanArts.length);
      requestAnimationFrame(() => {
        loadImagesProgressively(itemsToShow);
        setImagesLoaded({});
      });
    }
  }, [loading, filteredFanArts, visibleCount, isSearchMode, isGalleryVisible, loadImagesProgressively, visibleItems.length]);

  useEffect(() => {
    const sorted = sortFanArts(fanArts, sortOrder);
    const filtered = sorted.filter(art => 
      art.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFanArts(filtered);
    setVisibleCount(ITEMS_PER_PAGE); 
    setIsSearchMode(searchQuery !== '');
  }, [searchQuery, sortOrder, fanArts, sortFanArts, ITEMS_PER_PAGE]);

  const handleFanArtClick = (fanArt: FanArt) => {
    setSelectedFanArt(fanArt);
    setViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setViewerOpen(false);
  };
  
  const loadMoreImages = () => {
    const newCount = Math.min(visibleCount + ITEMS_PER_PAGE, filteredFanArts.length);
    setVisibleCount(newCount);
    setVisibleItems(Array.from({ length: newCount }, (_, i) => i));
  };
  
  const loadAllImages = () => {
    setShowLoadAllWarning(false);
    const allImagesCount = filteredFanArts.length;
    setVisibleCount(allImagesCount);
    setVisibleItems(Array.from({ length: allImagesCount }, (_, i) => i));
  };
  
  const showLoadAllWarningModal = () => {
    setShowLoadAllWarning(true);
  };
  
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

  const totalImages = filteredFanArts.length;
  const totalOriginalImages = fanArts.length;
  
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="hidden md:block md:w-64 lg:w-72 flex-shrink-0">
        <div className="sticky top-32 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-4 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex flex-col gap-5">
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
            <div>
              <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Trier par
              </label>
              <select
                id="sort-order"
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value as 'newest' | 'oldest' | 'alphabetical');
                  if (!isSearchMode) setVisibleCount(ITEMS_PER_PAGE);
                }}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="newest">Plus récent</option>
                <option value="oldest">Plus ancien</option>
                <option value="alphabetical">Alphabétique</option>
              </select>
            </div>
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
            <button
              onClick={handleClearCache}
              className="w-full py-2 px-3 flex items-center justify-center gap-2 text-sm font-medium rounded-md bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:hover:bg-yellow-800/40 text-yellow-600 dark:text-yellow-300 hover:text-yellow-700"
            >
              <AlertTriangle className="h-4 w-4" />
              Vider le cache des images
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1">
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
                  if (!isSearchMode) setVisibleCount(ITEMS_PER_PAGE);
                }}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-base w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
              <option value="newest">Plus récent</option>
              <option value="oldest">Plus ancien</option>
              <option value="alphabetical">Alphabétique</option>
            </select>
          </div>
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
          <button
            onClick={handleClearCache}
            className="w-full py-2 px-3 flex items-center justify-center gap-2 text-sm font-medium rounded-md bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:hover:bg-yellow-800/40 text-yellow-600 dark:text-yellow-300 hover:text-yellow-700"
          >
            <AlertTriangle className="h-4 w-4" />
            Vider le cache des images
          </button>
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
        <div className="mb-8 mx-4">
          <div className="relative overflow-hidden rounded-lg">
            <div
              className="p-5 text-center relative"
              style={{
                background: 'linear-gradient(to right, rgba(199, 210, 254, 0.8), rgba(221, 214, 254, 0.8), rgba(251, 207, 232, 0.8))',
                backgroundSize: '200% 200%',
                animation: 'gradientBg 8s ease infinite'
              }}
            >
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
            .bento-card {
              transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .bento-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            }
            .tall-card {
              transition: transform 0.3s ease, box-shadow 0.4s ease;
            }
            .tall-card:hover {
              transform: translateY(-7px) scale(1.01);
              box-shadow: 0 15px 30px -10px rgba(168, 85, 247, 0.2), 
                          0 10px 20px -5px rgba(168, 85, 247, 0.1);
            }
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
                  gridAutoFlow: 'dense'
                }}
              >
                {(isSearchMode ? filteredFanArts : filteredFanArts.slice(0, visibleCount)).map((fanArt, index) => {
                  const sizeClasses = {
                    'small': 'col-span-1 row-span-1',
                    'medium': 'col-span-2 row-span-1',
                    'large': 'col-span-2 row-span-2',
                    'tall': 'col-span-2 row-span-2',
                    'wide': 'col-span-3 row-span-1'
                  };
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
                          boxShadow: fanArt.size === 'tall' ? '0 0 0 2px rgba(168, 85, 247, 0.15)' : undefined,
                        }}
                      >
                        <div className="relative w-full h-full overflow-hidden" style={{ borderRadius: 'inherit' }}>
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
                              setImagesLoaded(prev => ({ ...prev, [fanArt.sha]: true }));
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
              {!isSearchMode && visibleCount < filteredFanArts.length && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6 mb-4">
                  <button
                    onClick={loadMoreImages}
                    className="py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium rounded-md bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-800/40 text-purple-600 dark:text-purple-300 hover:text-purple-700 transition-all duration-200"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Charger 10 images de plus ({Math.min(ITEMS_PER_PAGE, filteredFanArts.length - visibleCount)} sur {filteredFanArts.length - visibleCount})
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
      <Dialog open={showClearCacheConfirmDialog} onOpenChange={setShowClearCacheConfirmDialog}>
        <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-xl p-0">
          <DialogHeader className="p-6 pb-2 border-b border-gray-200 dark:border-gray-700">
        <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
          Vider le cache des images ?
        </DialogTitle>
          </DialogHeader>

          <div className="p-6 pt-3 space-y-4">
        <DialogDescription className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          Cette action forcera ton navigateur à re-télécharger toutes les images de la galerie. Cela peut entraîner une consommation importante de données sur ta connexion internet.
          Nous te recommandons de l'utiliser uniquement si certains fan arts ne s'affichent pas.
        </DialogDescription>
        
        <div className="p-4 rounded-md bg-orange-50 dark:bg-orange-900/40 border border-orange-200 dark:border-orange-700/60">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-orange-500 dark:text-orange-400 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-orange-700 dark:text-orange-300 leading-relaxed">
          <span className="font-semibold">Attention :</span> Pour éviter une surcharge de l'API et un éventuel blocage temporaire de l'accès aux fanarts, veuillez ne pas utiliser cette fonction de manière répétée et excessive.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-md bg-green-50 dark:bg-green-900/40 border border-green-200 dark:border-green-700/60">
          <div className="flex items-start">
            <Leaf className="h-5 w-5 text-green-600 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
          <span className="font-semibold">Éco :</span> Conserver le cache des images contribue à réduire la consommation de données et d'énergie, car les images ne sont pas re-téléchargées à chaque visite.
            </p>
          </div>
        </div>
          </div>
          
          <DialogFooter className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg flex flex-col sm:flex-row sm:justify-end gap-3 border-t border-gray-200 dark:border-gray-700">
        <Button 
          variant="outline" 
          onClick={() => setShowClearCacheConfirmDialog(false)} 
          className="w-full sm:w-auto dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 flex items-center justify-center gap-2"
        >
          <XCircle className="h-4 w-4" />
          Annuler
        </Button>
        <Button 
          variant="destructive" 
          onClick={confirmClearCache} 
          className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Confirmer et Vider
        </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {viewerOpen && selectedFanArt && (
        <FanArtViewer
          fanArt={selectedFanArt}
          isOpen={viewerOpen}
          onClose={handleCloseViewer}
          allFanArts={filteredFanArts}
        />
      )}
        </div>
      );
    }
