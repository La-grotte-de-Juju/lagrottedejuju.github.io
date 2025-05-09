"use client";

import { useRef, useEffect, ReactNode } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

interface AnimateOnScrollProps {
  children: ReactNode;
  animation?: "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "scale" | "rotate" | "card-3d" | "bounce-3d";
  duration?: number;
  delay?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
}

const animations = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "slide-up": {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },
  "slide-down": {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },
  "slide-left": {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },
  "slide-right": {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },
  scale: {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  },
  rotate: {
    hidden: { rotate: -5, scale: 0.95, opacity: 0 },
    visible: { rotate: 0, scale: 1, opacity: 1 },
  },
  "card-3d": {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      rotateX: 10, 
      rotateY: -5,
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotateX: 0, 
      rotateY: 0,
    },
  },
  "bounce-3d": {
    hidden: {
      opacity: 0,
      y: 100,
      scale: 0.75,
      rotateX: -75,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
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
  once = false,
}: AnimateOnScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once,
    amount: threshold,
    margin: "150px 0px 150px 0px"
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      const timerId = setTimeout(() => {
        controls.start("visible");
      }, 1);
      return () => clearTimeout(timerId);
    } else if (!once) {
      controls.start("hidden");
    }
  }, [isInView, controls, once]);

  const selectedAnimation = animations[animation] || animations.fade;

  let transitionConfig: {
    duration?: number;
    delay?: number;
    ease?: string;
    type?: string;
    stiffness?: number;
    damping?: number;
  } = {
    duration,
    delay,
    ease: "easeInOut",
  };

  if (animation === "bounce-3d") {
    transitionConfig = {
      type: "spring",
      stiffness: 280,
      damping: 20,
      delay,
    };
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={selectedAnimation}
      transition={transitionConfig}
      style={
        animation === "card-3d" || animation === "bounce-3d"
          ? { perspective: "1000px", transformStyle: "preserve-3d" }
          : undefined
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
