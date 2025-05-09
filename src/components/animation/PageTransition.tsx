"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  blurIntensity?: number; // Nouvelle propriété pour contrôler l'intensité du flou
}

const variants = {
  initial: {
    opacity: 0,
    y: "20%",
    rotateX: -15,
    scale: 0.95,
    filter: "blur(16px)", // Augmenté pour un effet plus prononcé
    borderRadius: "30px",
  },
  animate: {
    opacity: 1,
    y: "0%",
    rotateX: 0,
    scale: 1,
    filter: "blur(0px)",
    borderRadius: "0px",
  },
  exit: {
    opacity: 0,
    y: "-20%",
    rotateX: 15,
    scale: 0.95,
    filter: "blur(16px)", // Augmenté pour un effet plus prononcé
    borderRadius: "30px",
  },
};

const springTransition = {
  type: "spring",
  stiffness: 260,
  damping: 20,
};

export default function PageTransition({ children, blurIntensity = 16 }: PageTransitionProps) {
  const pathname = usePathname();

  // Variants personnalisés avec l'intensité de flou paramétrable
  const customVariants = {
    initial: {
      ...variants.initial,
      filter: `blur(${blurIntensity}px)`,
    },
    animate: variants.animate,
    exit: {
      ...variants.exit,
      filter: `blur(${blurIntensity}px)`,
    },
  };

  return (
    <div style={{ perspective: "1200px", overflow: "visible" }}>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={customVariants}
          transition={springTransition}
          style={{
            transformOrigin: "center center",
            willChange: "transform, opacity, filter, borderRadius",
            overflow: "hidden",
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(128, 0, 128, 0.1)",
              backdropFilter: "blur(0px)",
              zIndex: -1,
              borderRadius: "15px",
              width: "100%",
              height: "100%",
            }}
            initial={{ opacity: 0.3, backdropFilter: `blur(${blurIntensity/2}px)` }}
            animate={{ opacity: 0, backdropFilter: "blur(0px)", transition: { delay: 0.3, duration: 0.4 } }}
            exit={{ opacity: 0.3, backdropFilter: `blur(${blurIntensity/2}px)`, transition: { duration: 0.2 } }}
          />
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
