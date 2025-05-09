'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface ShinyCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number; // Intensité de l'effet de parallax (1-10)
  shineIntensity?: number; // Intensité de l'effet brillant (1-10)
  borderRadius?: string;
}

export function ShinyCard({
  children,
  className = '',
  intensity = 10, // Augmenté l'intensité par défaut pour un effet plus prononcé
  shineIntensity = 0.5, // Augmenté l'intensité de brillance
  borderRadius = '0.75rem',
}: ShinyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Valeurs de mouvement pour le suivi de la souris
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Configuration des valeurs de rotation et de perspective - augmenté pour un effet plus prononcé
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [-intensity * 1.2, intensity * 1.2]); // Direction corrigée pour une rotation naturelle
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [intensity * 1.2, -intensity * 1.2]); // Direction corrigée pour une rotation naturelle

  // Appliquer un effet de ressort pour une animation plus fluide - amélioré pour plus de réactivité
  const springConfig = { damping: 18, stiffness: 170 }; // Réduction de l'amortissement, augmentation de la raideur
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  // Position pour l'effet brillant - étendu pour un meilleur mouvement
  const shineX = useTransform(mouseX, [-0.5, 0.5], [-50, 150], {
    clamp: false,
  });
  const shineY = useTransform(mouseY, [-0.5, 0.5], [-50, 150], {
    clamp: false,
  });

  // Variables d'ombre définies mais non utilisées
  const shadowBlur = useTransform(
    mouseY, 
    [-0.5, 0, 0.5], 
    [12, 24, 12]
  );
  const shadowX = useTransform(
    mouseX, 
    [-0.5, 0, 0.5], 
    [-7, 0, 7]
  );
  const shadowY = useTransform(
    mouseY, 
    [-0.5, 0, 0.5], 
    [-7, 0, 7]
  );
  const shadowSpread = useTransform(
    mouseY, 
    [-0.5, 0, 0.5], 
    [0, 3, 0]
  );
  
  // Intensité de l'ombre basée sur le survol
  const shadowOpacity = isHovered ? 0.5 : 0.3;
  
  // Box shadow vide pour supprimer l'effet d'ombre
  const boxShadow = useTransform(
    [shadowBlur, shadowX, shadowY, shadowSpread],
    () => 'none'
  );

  // Gérer le mouvement de la souris sur la carte
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculer la position relative de la souris sur la carte (-0.5 à 0.5)
    const relativeX = (e.clientX - centerX) / rect.width;
    const relativeY = (e.clientY - centerY) / rect.height;
    
    mouseX.set(relativeX);
    mouseY.set(relativeY);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`${className} relative`}
      style={{
        perspective: '800px', // Perspective réduite pour un effet 3D plus prononcé
        transformStyle: 'preserve-3d',
        rotateX: springRotateX,
        rotateY: springRotateY,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX .set(0);
        mouseY.set(0);
      }}
      whileHover={{ 
        scale: 1.03, 
        transition: { type: "spring", stiffness: 300, damping: 15 }
      }}
    >
      {/* Conteneur principal - tout est dans la même transformation 3D */}
      <motion.div
        className="relative w-full h-full overflow-hidden"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'translateZ(0)',
          borderRadius,
          boxShadow,
        }}
      >
        {/* Contenu de la carte */}
        <div 
          className="w-full h-full relative z-10" 
          style={{ 
            transformStyle: 'preserve-3d',
            borderRadius 
          }}
        >
          {children}
        </div>

        {/* Effet brillant principal - style Steam avec point lumineux intense */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: isHovered
              ? `radial-gradient(
                  circle at ${shineX}% ${shineY}%,
                  rgba(255, 255, 255, ${shineIntensity}),
                  rgba(255, 255, 255, 0.2) 30%,
                  transparent 60%
                )`
              : 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05), transparent 60%)',
            borderRadius,
            transformStyle: 'preserve-3d'
          }}
        />

        {/* Effet de contour brillant - style Steam */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10 opacity-70"
          style={{
            background: isHovered
              ? 'linear-gradient(145deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.02) 25%, rgba(255, 255, 255, 0.15) 100%)'
              : 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
            borderRadius,
            transformStyle: 'preserve-3d'
          }}
        />
        
        {/* Effet de reflet latéral dynamique - style Steam */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-15 opacity-60"
          style={{
            background: isHovered
              ? `linear-gradient(
                  ${90 + mouseX.get() * 30}deg, 
                  rgba(255, 255, 255, 0) 0%, 
                  rgba(255, 255, 255, 0.1) 25%, 
                  rgba(255, 255, 255, 0.2) 50%, 
                  rgba(255, 255, 255, 0.1) 75%, 
                  rgba(255, 255, 255, 0) 100%
                )`
              : 'none',
            borderRadius,
            transformStyle: 'preserve-3d'
          }}
        />
      </motion.div>
    </motion.div>
  );
}
