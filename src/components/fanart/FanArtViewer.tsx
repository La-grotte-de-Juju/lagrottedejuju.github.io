"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";

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
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = fanArt.download_url;
    link.download = fanArt.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] p-1 bg-zinc-900 border-zinc-800">
        <div className="relative">
          <div className="absolute top-2 right-2 flex gap-2 z-10">
            <button
              onClick={handleDownload}
              className="bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5"
              title="Télécharger"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center justify-center max-h-[80vh]">
            {hasPrev && (
              <button 
                onClick={handlePrev} 
                className="absolute left-2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            
            <img
              src={fanArt.download_url}
              alt={`Fan art: ${fanArt.name}`}
              className="max-h-[80vh] max-w-full object-contain"
            />
            
            {hasNext && (
              <button 
                onClick={handleNext} 
                className="absolute right-2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>
          
          <div className="p-3 bg-zinc-800 text-gray-200 flex justify-between items-center">
            <h3 className="font-medium">
              {fanArt.name.replace(/\.(jpg|jpeg|png|gif|webp)$/i, "")}
            </h3>
            <div className="text-sm text-gray-400">
              {currentIndex + 1} / {allFanArts.length}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
