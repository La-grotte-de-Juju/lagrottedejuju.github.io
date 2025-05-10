"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "../ui/card";
import { ImageIcon, Loader2, X, Search, RefreshCw } from "lucide-react";
import { FanArtViewer } from "./FanArtViewer";

interface FanArt {
  name: string;
  download_url: string;
  path: string;
  sha: string;
}

export default function FanArtGallery() {
  // Pour les fan arts
  const [fanArts, setFanArts] = useState<FanArt[]>([]);
  const [filteredFanArts, setFilteredFanArts] = useState<FanArt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Pagination
  const ITEMS_PER_PAGE = 24;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isSearchMode, setIsSearchMode] = useState(false);
  
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
        setFanArts(parsedData);
        setFilteredFanArts(sortFanArts(parsedData, sortOrder));
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

      // Add raw content URL to each image
      const fanArtsWithUrls = imageFiles.map((file: {name: string; download_url: string; path: string; sha: string}) => ({
        name: file.name,
        download_url: file.download_url,
        path: file.path,
        sha: file.sha
      }));

      // Save to localStorage cache
      try {
        localStorage.setItem(cacheKey, JSON.stringify(fanArtsWithUrls));
        const timestamp = new Date().getTime();
        localStorage.setItem(timestampKey, timestamp.toString());
        setLastUpdated(new Date(timestamp).toLocaleTimeString());
      } catch (e) {
        console.warn(`Failed to cache fan arts data:`, e);
      }

      setFanArts(fanArtsWithUrls);
      setFilteredFanArts(sortFanArts(fanArtsWithUrls, sortOrder));
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
  };

  // Charger les fan arts au chargement
  useEffect(() => {
    fetchFanArts();
  }, [fetchFanArts]);

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
      }
      
      // Trier les résultats
      results = sortFanArts(results, sortOrder);
      
      setFilteredFanArts(results);
    }
  }, [sortOrder, fanArts, searchQuery]);

  const handleFanArtClick = (fanArt: FanArt) => {
    setSelectedFanArt(fanArt);
    setViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setViewerOpen(false);
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                  </svg>
                </div>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    aria-label="Effacer la recherche"
                  >
                    <X className="h-4 w-4" />
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
                onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest' | 'alphabetical')}
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
                  <span className="font-medium">{totalImages}</span>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label="Effacer la recherche"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2 w-full">
            <label htmlFor="mobile-sort-order" className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
              Trier par:
            </label>
            <select
              id="mobile-sort-order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest' | 'alphabetical')}
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
              {totalImages === totalOriginalImages ? (
                <span>Affichage de tous les {totalOriginalImages} fan arts</span>
              ) : (
                <span>{totalImages} fan art{totalImages > 1 ? 's' : ''} affichés sur {totalOriginalImages} au total</span>
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
          `}</style>
        </div>

        {/* Section Fan Arts */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 mb-4 gap-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Fan Arts
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredFanArts.length} œuvres
            </div>
          </div>
          
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
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 p-3 md:p-4">
              {filteredFanArts.map((fanArt, index) => (
                <Card
                  key={fanArt.sha}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] transform cursor-pointer group animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleFanArtClick(fanArt)}
                >
                  <div className="relative aspect-square overflow-hidden">
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
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                      loading="lazy"
                      onLoad={(e) => {
                        // Hide loader when image loads
                        const target = e.target as HTMLImageElement;
                        const parent = target.parentElement;
                        if (parent) {
                          const loader = parent.querySelector('div');
                          if (loader) {
                            loader.classList.add('opacity-0');
                            setTimeout(() => {
                              if (loader.parentElement) {
                                loader.parentElement.removeChild(loader);
                              }
                            }, 300);
                          }
                        }
                      }}
                    />
                  </div>
                  
                  <div className="p-2 md:p-3 bg-black/5 dark:bg-white/5">
                    <h3 className="font-medium text-xs md:text-sm truncate">
                      {fanArt.name.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')}
                    </h3>
                  </div>
                </Card>
              ))}
            </div>
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
