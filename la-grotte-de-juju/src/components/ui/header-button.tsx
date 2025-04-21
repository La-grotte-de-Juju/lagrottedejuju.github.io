"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import type { ButtonProps } from "./button"

export interface HeaderButtonProps extends ButtonProps {
  glowEffect?: boolean
  delayFactor?: number
}

const HeaderButton = React.forwardRef<HTMLButtonElement, HeaderButtonProps>(
  ({ className, variant = "ghost", glowEffect = true, delayFactor = 0, children, ...props }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: delayFactor * 0.1,
          type: "spring",
          stiffness: 100
        }}
        whileHover={{ 
          scale: 1.05,
          transition: { duration: 0.2 } 
        }}
        whileTap={{ scale: 0.98 }}
        style={{ display: "inline-block" }}
      >
        <Button
          ref={ref}
          variant={variant}
          className={cn(
            "relative overflow-hidden",
            glowEffect && "hover:shadow-[0_0_10px_2px_hsla(var(--primary),0.3)] hover:shadow-primary/30",
            className
          )}
          {...props}
        >
          <span className="relative z-10">{children}</span>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
        </Button>
      </motion.div>
    )
  }
)
HeaderButton.displayName = "HeaderButton"

export { HeaderButton }
