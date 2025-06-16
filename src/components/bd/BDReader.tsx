'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight,
  SkipBack,
  SkipForward,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Settings,
  Maximize2,
  Grid3X3
} from 'lucide-react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import './bd-reader.css';

interface BDFolder {
  name: string;
  path: string;
  coverImage?: string;
  pages?: string[];
  description?: string;
  createdAt?: string;
}

interface BDReaderProps {
  folder: BDFolder;
  onBack: () => void;
}

type ReadingOrder = 'asc' | 'desc';
type ViewMode = 'single' | 'double' | 'overview';

export function BDReader({ folder, onBack }: BDReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [readingOrder, setReadingOrder] = useState<ReadingOrder>('asc');
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [zoom, setZoom] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (folder.pages) {
      const sortedPages = [...folder.pages].sort((a, b) => {
        const aNum = parseInt(a.match(/(\d+)/)?.[1] || '0');
        const bNum = parseInt(b.match(/(\d+)/)?.[1] || '0');
        return readingOrder === 'asc' ? aNum - bNum : bNum - aNum;
      });
      setPages(sortedPages);
      setCurrentPage(0);
    }
    setLoading(false);
  }, [folder.pages, readingOrder]);

  // Navigation au clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPreviousPage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNextPage();
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          exitFullscreen();
        } else {
          onBack();
        }
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, pages.length, isFullscreen]);

  const goToNextPage = useCallback(() => {
    if (viewMode === 'double') {
      setCurrentPage(prev => Math.min(prev + 2, pages.length - 1));
    } else {
      setCurrentPage(prev => Math.min(prev + 1, pages.length - 1));
    }
  }, [pages.length, viewMode]);

  const goToPreviousPage = useCallback(() => {
    if (viewMode === 'double') {
      setCurrentPage(prev => Math.max(prev - 2, 0));
    } else {
      setCurrentPage(prev => Math.max(prev - 1, 0));
    }
  }, [viewMode]);

  const goToFirstPage = () => setCurrentPage(0);
  const goToLastPage = () => setCurrentPage(pages.length - 1);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Erreur fullscreen:', error);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Erreur sortie fullscreen:', error);
    }
  };

  const toggleReadingOrder = () => {
    setReadingOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const resetZoom = () => setZoom(1);
  const zoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4 mx-auto"></div>
          <p>Chargement de la BD...</p>
        </div>
      </div>
    );
  }

  if (!pages.length) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p className="mb-4">Aucune page trouvée pour cette BD</p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  if (viewMode === 'overview') {
    return (
      <div className="min-h-screen bg-black text-white">
        <ReaderHeader 
          folder={folder}
          onBack={onBack}
          currentPage={currentPage}
          totalPages={pages.length}
          readingOrder={readingOrder}
          viewMode={viewMode}
          zoom={zoom}
          onReadingOrderToggle={toggleReadingOrder}
          onViewModeChange={setViewMode}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetZoom={resetZoom}
          onToggleFullscreen={toggleFullscreen}
          showSettings={showSettings}
          onToggleSettings={() => setShowSettings(!showSettings)}
        />
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {pages.map((page, index) => (
              <motion.div
                key={page}
                className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentPage ? 'border-primary' : 'border-transparent'
                }`}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setCurrentPage(index);
                  setViewMode('single');
                }}
              >
                <div className="aspect-[3/4] relative">                  <Image
                    src={page}
                    alt={`Page ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                    onError={(e) => {
                      // Add simple error handling for this image
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentNode as HTMLElement;
                      if (parent) {
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'flex items-center justify-center bg-gray-800 w-full h-full';
                        errorDiv.innerHTML = `<span class="text-xs text-gray-400">⚠️</span>`;
                        parent.appendChild(errorDiv);
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 hover:bg-black/0 transition-colors" />
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <ReaderHeader 
        folder={folder}
        onBack={onBack}
        currentPage={currentPage}
        totalPages={pages.length}
        readingOrder={readingOrder}
        viewMode={viewMode}
        zoom={zoom}
        onReadingOrderToggle={toggleReadingOrder}
        onViewModeChange={setViewMode}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
        onToggleFullscreen={toggleFullscreen}
        showSettings={showSettings}
        onToggleSettings={() => setShowSettings(!showSettings)}
      />

      {/* Zone de lecture principale */}
      <div className="flex-1 flex items-center justify-center pt-16 pb-20 px-4">
        <motion.div 
          className="relative max-w-full max-h-full overflow-auto"
          style={{ transform: `scale(${zoom})` }}
          transition={{ type: "tween", duration: 0.2 }}
        >
          {viewMode === 'double' && currentPage < pages.length - 1 ? (
            <div className="flex gap-2">
              {/* Page de gauche */}
              <div className="relative">                <ImageWithFallback
                  src={pages[currentPage]}
                  alt={`Page ${currentPage + 1}`}
                  width={600}
                  height={800}
                  className="object-contain max-h-[80vh] w-auto"
                  priority
                />
              </div>
              {/* Page de droite */}
              <div className="relative">                <ImageWithFallback
                  src={pages[currentPage + 1]}
                  alt={`Page ${currentPage + 2}`}
                  width={600}
                  height={800}
                  className="object-contain max-h-[80vh] w-auto"
                  priority
                />
              </div>
            </div>
          ) : (            <div className="relative">
              <ImageWithFallback
                src={pages[currentPage]}
                alt={`Page ${currentPage + 1}`}
                width={800}
                height={1000}
                className="object-contain max-h-[80vh] w-auto"
                priority
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* Navigation fixe en bas */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-gray-800 p-4">
        <div className="container mx-auto flex items-center justify-between">
          {/* Navigation pages */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToFirstPage}
              disabled={currentPage === 0}
              className="text-white hover:bg-white/10"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 0}
              className="text-white hover:bg-white/10"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <span className="text-sm text-gray-300 px-4">
              {viewMode === 'double' && currentPage < pages.length - 1
                ? `${currentPage + 1}-${currentPage + 2} / ${pages.length}`
                : `${currentPage + 1} / ${pages.length}`
              }
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextPage}
              disabled={
                viewMode === 'double' 
                  ? currentPage >= pages.length - 1
                  : currentPage === pages.length - 1
              }
              className="text-white hover:bg-white/10"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={goToLastPage}
              disabled={currentPage === pages.length - 1}
              className="text-white hover:bg-white/10"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Barre de progression */}
          <div className="flex-1 mx-8">
            <div className="bg-gray-700 rounded-full h-2 relative overflow-hidden">
              <motion.div 
                className="bg-primary h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${((currentPage + 1) / pages.length) * 100}%` 
                }}
                transition={{ type: "tween", duration: 0.3 }}
              />
            </div>
          </div>

          {/* Contrôles zoom */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={zoomOut}
              disabled={zoom <= 0.5}
              className="text-white hover:bg-white/10"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            
            <span className="text-sm text-gray-300 min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={zoomIn}
              disabled={zoom >= 3}
              className="text-white hover:bg-white/10"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Zones de clic invisibles pour navigation */}
      <div 
        className="fixed left-0 top-16 bottom-20 w-1/3 cursor-pointer z-10"
        onClick={goToPreviousPage}
      />
      <div 
        className="fixed right-0 top-16 bottom-20 w-1/3 cursor-pointer z-10"
        onClick={goToNextPage}
      />
    </div>
  );
}

interface ReaderHeaderProps {
  folder: BDFolder;
  onBack: () => void;
  currentPage: number;
  totalPages: number;
  readingOrder: ReadingOrder;
  viewMode: ViewMode;
  zoom: number;
  onReadingOrderToggle: () => void;
  onViewModeChange: (mode: ViewMode) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleFullscreen: () => void;
  showSettings: boolean;
  onToggleSettings: () => void;
}

function ReaderHeader({
  folder,
  onBack,
  currentPage,
  totalPages,
  readingOrder,
  viewMode,
  zoom,
  onReadingOrderToggle,
  onViewModeChange,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleFullscreen,
  showSettings,
  onToggleSettings
}: ReaderHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-b border-gray-800 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Gauche - Retour et titre */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            
            <div>
              <h1 className="text-lg font-semibold text-white truncate max-w-[200px] md:max-w-none">
                {folder.name}
              </h1>
              <p className="text-sm text-gray-400">
                Page {currentPage + 1} sur {totalPages}
              </p>
            </div>
          </div>

          {/* Droite - Contrôles */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFullscreen}
              className="text-white hover:bg-white/10 hidden md:flex"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange('overview')}
              className={`text-white hover:bg-white/10 ${
                viewMode === 'overview' ? 'bg-white/20' : ''
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSettings}
              className={`text-white hover:bg-white/10 ${
                showSettings ? 'bg-white/20' : ''
              }`}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Panneau de paramètres */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border-t border-gray-700 mt-3 pt-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Mode de lecture */}
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">
                      Mode de lecture
                    </label>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewModeChange('single')}
                        className={`text-white hover:bg-white/10 ${
                          viewMode === 'single' ? 'bg-white/20' : ''
                        }`}
                      >
                        Simple
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewModeChange('double')}
                        className={`text-white hover:bg-white/10 ${
                          viewMode === 'double' ? 'bg-white/20' : ''
                        }`}
                      >
                        Double
                      </Button>
                    </div>
                  </div>

                  {/* Ordre de lecture */}
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">
                      Ordre de lecture
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onReadingOrderToggle}
                      className="text-white hover:bg-white/10"
                    >
                      {readingOrder === 'asc' ? 'Plus ancien → Plus récent' : 'Plus récent → Plus ancien'}
                    </Button>
                  </div>

                  {/* Zoom */}
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">
                      Zoom
                    </label>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onZoomOut}
                        disabled={zoom <= 0.5}
                        className="text-white hover:bg-white/10"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onResetZoom}
                        className="text-white hover:bg-white/10 min-w-[4rem]"
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        {Math.round(zoom * 100)}%
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onZoomIn}
                        disabled={zoom >= 3}
                        className="text-white hover:bg-white/10"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Add this error handling code for image loading inside the BDReader component
function ImageWithFallback({ src, alt, ...props }: { 
  src: string; 
  alt: string; 
  width: number; 
  height: number; 
  className: string;
  priority?: boolean;
}) {
  const [error, setError] = useState(false);

  return (
    <>
      {error ? (
        <div className="flex flex-col items-center justify-center bg-gray-900 rounded-md w-full h-full min-h-[300px]">
          <div className="w-12 h-12 text-gray-500 mb-2">⚠️</div>
          <p className="text-gray-500 text-sm text-center px-4">
            Impossible de charger cette image.<br/>
            <span className="text-xs opacity-70">URL: {src.split('/').pop()}</span>
          </p>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          {...props}
          onError={() => setError(true)}
        />
      )}
    </>
  );
}
