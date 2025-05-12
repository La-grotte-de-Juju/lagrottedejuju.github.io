"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./fanart-viewer.css";

interface FanArt {
  name: string;
  download_url: string;
  sha: string;
  path: string;
}

interface FanArtViewerProps {
  fanArt: FanArt | null;
  isOpen: boolean;
  onClose: () => void;
  allFanArts?: FanArt[];
}

export function FanArtViewer({ fanArt, isOpen, onClose, allFanArts = [] }: FanArtViewerProps) {
  if (!fanArt) return null;

  const currentIndex = allFanArts.findIndex(art => art.sha === fanArt.sha);
  const hasNext = currentIndex < allFanArts.length - 1;
  const hasPrev = currentIndex > 0;
  
  const handleNext = () => {
    if (hasNext && allFanArts[currentIndex + 1]) {
      const nextEvent = new CustomEvent('nextFanArt', { 
        detail: { fanArt: allFanArts[currentIndex + 1] } 
      });
      document.dispatchEvent(nextEvent);
    }
  };
  
  const handlePrev = () => {
    if (hasPrev && allFanArts[currentIndex - 1]) {
      const prevEvent = new CustomEvent('prevFanArt', { 
        detail: { fanArt: allFanArts[currentIndex - 1] } 
      });
      document.dispatchEvent(prevEvent);
    }
  };
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fanArt.download_url;
    link.download = fanArt.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl w-[95vw] md:w-[90vw] lg:w-[80vw] h-[90vh] p-0 bg-black/70 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col focus:outline-none">
        <div className="relative flex flex-col h-full w-full">
          <div className="absolute top-6 right-6 flex gap-4 z-50">
            <motion.button
              onClick={handleDownload}
              className="bg-black/40 hover:bg-black/50 backdrop-filter backdrop-blur-lg text-gray-100 rounded-full p-3 shadow-xl transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/60"
              title="Télécharger"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-6 h-6" />
            </motion.button>
            <motion.button
              onClick={onClose}
              className="bg-black/40 hover:bg-black/50 backdrop-filter backdrop-blur-lg text-gray-100 rounded-full p-3 shadow-xl transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/60"
              title="Fermer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          <div className="flex-grow relative flex items-center justify-center overflow-hidden pt-20 pb-24 px-6 md:px-10">
            {hasPrev && (
              <button
                onClick={handlePrev}
                className="nav-fixed-button absolute left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-30 bg-black/30 backdrop-filter backdrop-blur-lg text-white rounded-full p-3.5 shadow-xl focus:outline-none"
                title="Précédent"
              >
                <ChevronLeft className="w-7 h-7 md:w-9 md:h-9" />
              </button>
            )}
            
            <AnimatePresence mode="wait">
              <motion.img
                key={fanArt.download_url} 
                src={fanArt.download_url}
                alt={`Fan art: ${fanArt.name}`}
                className="max-h-full max-w-full object-contain select-none shadow-2xl rounded-lg" 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              />
            </AnimatePresence>
            
            {hasNext && (
              <button
                onClick={handleNext}
                className="nav-fixed-button absolute right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-30 bg-black/30 backdrop-filter backdrop-blur-lg text-white rounded-full p-3.5 shadow-xl focus:outline-none"
                title="Suivant"
              >
                <ChevronRight className="w-7 h-7 md:w-9 md:h-9" />
              </button>
            )}
          </div>
          
          <motion.div 
            className="absolute bottom-6 left-6 right-6 px-4 py-3 bg-black/50 backdrop-blur-xl text-gray-100 flex justify-between items-center shadow-2xl rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "circOut", delay: 0.1 }}
          >
            <h3 className="font-semibold text-base md:text-lg truncate pr-4">
              {fanArt.name.replace(/\.(jpg|jpeg|png|gif|webp)$/i, "")}
            </h3>
            <div className="text-sm text-gray-300 whitespace-nowrap">
              {currentIndex + 1} / {allFanArts.length}
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
