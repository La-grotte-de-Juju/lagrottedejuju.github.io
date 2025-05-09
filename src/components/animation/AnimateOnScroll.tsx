"use client";

import { useRef, useEffect, ReactNode, memo } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

interface AnimateOnScrollProps {
  children: ReactNode;
  animation?: "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "scale" | "rotate" | "card-3d" | "bounce-3d" | "fancy-card" | "float-up" | "shiny-card-reveal" | "card-flip";
  duration?: number;
  delay?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
  blurAmount?: number;
}

const animations = {
  fade: {
    hidden: { opacity: 0, filter: "blur(4px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
  "slide-up": {
    hidden: { y: 40, opacity: 0, filter: "blur(4px)" },
    visible: { y: 0, opacity: 1, filter: "blur(0px)" },
  },
  "slide-down": {
    hidden: { y: -40, opacity: 0, filter: "blur(4px)" },
    visible: { y: 0, opacity: 1, filter: "blur(0px)" },
  },
  "slide-left": {
    hidden: { x: 40, opacity: 0, filter: "blur(4px)" },
    visible: { x: 0, opacity: 1, filter: "blur(0px)" },
  },
  "slide-right": {
    hidden: { x: -40, opacity: 0, filter: "blur(4px)" },
    visible: { x: 0, opacity: 1, filter: "blur(0px)" },
  },
  scale: {
    hidden: { scale: 0.92, opacity: 0, filter: "blur(4px)" },
    visible: { scale: 1, opacity: 1, filter: "blur(0px)" },
  },
  rotate: {
    hidden: { rotate: -3, scale: 0.97, opacity: 0, filter: "blur(4px)" },
    visible: { rotate: 0, scale: 1, opacity: 1, filter: "blur(0px)" },
  },
  "card-3d": {
    hidden: { 
      opacity: 0, 
      scale: 0.97,
      rotateX: 8, 
      rotateY: -3,
      filter: "blur(4px)" 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotateX: 0, 
      rotateY: 0,
      filter: "blur(0px)" 
    },
  },
  "bounce-3d": {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.85,
      rotateX: -35,
      filter: "blur(4px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      filter: "blur(0px)"
    },
  },
  "fancy-card": {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.94,
      rotateX: 12,
      filter: "blur(5px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      filter: "blur(0px)"
    },
  },
  "float-up": {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      rotateX: 6,
      rotateY: -3,
      filter: "blur(4px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      filter: "blur(0px)"
    },
  },
  "shiny-card-reveal": {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.94,
      rotateX: 8,
      rotateY: -5,
      filter: "blur(4px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      filter: "blur(0px)"
    }
  },
  "card-flip": {
    hidden: {
      opacity: 0,
      rotateY: 45,
      scale: 0.9,
      filter: "blur(4px)"
    },
    visible: {
      opacity: 1,
      rotateY: 0,
      scale: 1,
      filter: "blur(0px)"
    }
  }
};

const AnimateOnScroll = memo(function AnimateOnScroll({
  children,
  animation = "fade",
  duration = 0.5,
  delay = 0,
  threshold = 0.1,
  className = "",
  once = true,
  blurAmount = 4,
}: AnimateOnScrollProps) {
  const ref = useRef(null);
  
  const isInView = useInView(ref, {
    once,
    amount: threshold,
    margin: "100px 0px 100px 0px"
  });
  
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
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
    duration: Math.min(duration, 0.6),
    delay: Math.min(delay, 0.5),
    ease: "easeOut",
  };

  if (animation === "bounce-3d") {
    transitionConfig = {
      type: "spring",
      stiffness: 200,
      damping: 18,
      delay: Math.min(delay, 0.3),
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
});

export default AnimateOnScroll;
