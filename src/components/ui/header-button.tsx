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
      >
        <Button
          ref={ref}
          variant={variant}
          className={cn(
            "relative overflow-hidden",
            className
          )}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    )
  }
)
HeaderButton.displayName = "HeaderButton"

export { HeaderButton }
