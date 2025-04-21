"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fonction qui vérifie si le document est complètement chargé
    const handleLoad = () => {
      // Ajoute un délai pour voir l'animation de chargement un peu plus longtemps
      setTimeout(() => {
        setIsLoading(false);
      }, 10); // Un peu plus long pour une meilleure expérience visuelle
    };

    // Si la page est déjà chargée quand le composant monte
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      // Sinon on attend l'événement load
      window.addEventListener('load', handleLoad);
    }

    // Définir un timeout de secours au cas où l'événement load ne se déclenche pas
    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 5 secondes maximum de chargement

    // Nettoyage lors du démontage du composant
    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <div className={`loading-screen ${!isLoading ? 'hidden' : ''}`}>
      <div className="loading-gif">
        <Image 
          src="/images/JujuLoading512px.gif"
          alt="Chargement en cours..."
          width={120}
          height={120}
          priority
          className="rounded-full"
        />
      </div>
      <p className="loading-text">Chargement en cours...</p>
    </div>
  );
}
