"use client";

import { useRef, useEffect, ReactNode } from "react";
import { motion, useInView, useAnimation, Variant } from "framer-motion";

interface AnimateOnScrollProps {
  children: ReactNode;
  animation?: "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "scale" | "rotate" | "card-3d" | "bounce-3d";
  duration?: number;
  delay?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
}

// Améliorer les animations existantes et ajouter des versions 3D
const animations = {
  fade: {
    hidden: { opacity: 0, filter: "blur(8px)" },
    visible: { 
      opacity: 1, 
      filter: "blur(0px)",
      transition: { type: "spring", damping: 12 }
    },
  },
  "slide-up": {
    hidden: { y: 100, opacity: 0, filter: "blur(8px)" },
    visible: { 
      y: 0, 
      opacity: 1, 
      filter: "blur(0px)",
      transition: { type: "spring", damping: 12, stiffness: 100 }
    },
  },
  "slide-down": {
    hidden: { y: -100, opacity: 0, filter: "blur(8px)" },
    visible: { 
      y: 0, 
      opacity: 1, 
      filter: "blur(0px)",
      transition: { type: "spring", damping: 12, stiffness: 100 }
    },
  },
  "slide-left": {
    hidden: { x: 100, opacity: 0, filter: "blur(8px)" },
    visible: { 
      x: 0, 
      opacity: 1, 
      filter: "blur(0px)",
      transition: { type: "spring", damping: 12, stiffness: 100 }
    },
  },
  "slide-right": {
    hidden: { x: -100, opacity: 0, filter: "blur(8px)" },
    visible: { 
      x: 0, 
      opacity: 1, 
      filter: "blur(0px)",
      transition: { type: "spring", damping: 12, stiffness: 100 }
    },
  },
  scale: {
    hidden: { scale: 0.8, opacity: 0, filter: "blur(8px)" },
    visible: { 
      scale: 1, 
      opacity: 1, 
      filter: "blur(0px)",
      transition: { type: "spring", bounce: 0.4, duration: 0.8 }
    },
  },
  rotate: {
    hidden: { rotate: -5, scale: 0.9, opacity: 0, filter: "blur(8px)" },
    visible: { 
      rotate: 0, 
      scale: 1, 
      opacity: 1, 
      filter: "blur(0px)",
      transition: { type: "spring", bounce: 0.4, duration: 0.8 }
    },
  },
  "card-3d": {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      rotateX: 25, 
      rotateY: -15,
      z: -100,
      filter: "blur(8px)"
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotateX: 0, 
      rotateY: 0,
      z: 0,
      filter: "blur(0px)",
      transition: { 
        type: "spring", 
        damping: 10, 
        stiffness: 80, 
        bounce: 0.25,
        duration: 0.8
      }
    },
  },
  "bounce-3d": {
    hidden: { 
      y: 100, 
      opacity: 0, 
      rotateX: 10,
      perspective: 1000,
      filter: "blur(8px)"
    },
    visible: { 
      y: 0, 
      opacity: 1, 
      rotateX: 0,
      perspective: 1000, 
      filter: "blur(0px)",
      transition: { 
        type: "spring", 
        bounce: 0.5, 
        duration: 1 
      }
    },
  },
};

export default function AnimateOnScroll({
  children,
  animation = "fade",
  duration = 0.5,
  delay = 0,
  threshold = 0.1,
  className = "",
  once = false, // Changé de true à false pour que les animations se rejouent
}: AnimateOnScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: threshold }); // Force once à false pour que l'événement se déclenche à chaque fois
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden"); // Réinitialise l'animation quand l'élément n'est plus visible
    }
  }, [isInView, controls]);

  const selectedAnimation = animations[animation] || animations.fade;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={selectedAnimation}
      transition={{ 
        duration: duration, 
        delay: delay,
        ease: "easeOut"
      }}
      style={{ 
        perspective: "1000px", 
        transformStyle: "preserve-3d"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
