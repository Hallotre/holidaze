import * as React from "react"
import { cn } from "@/lib/utils"

// Base button styles that all buttons will share
const baseButtonStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:pointer-events-none"

// Simple button variants with clear, distinct styles based on the homepage pink/white scheme
const buttonStyles = {
  // Primary action buttons (pink with white text)
  primary: "bg-pink-600 text-white hover:bg-pink-700 border border-pink-700",
  
  // Secondary/less prominent actions (lighter background)
  secondary: "bg-pink-100 text-pink-700 hover:bg-pink-200 border border-pink-300",
  
  // Positive action buttons (same pink as Explore text for save/confirm actions)
  positive: "bg-pink-600 text-white hover:bg-pink-700 border border-pink-700",
  
  // Destructive actions (delete, remove)
  danger: "bg-red-600 text-white hover:bg-red-700 border border-red-700",
  
  // Outline buttons (white with pink text/border)
  outline: "bg-white text-pink-600 hover:bg-pink-50 border-2 border-pink-600",
  
  // Text-only buttons
  link: "bg-transparent text-pink-600 hover:underline hover:bg-transparent p-0 border-none",
  
  // Ghost variant (transparent but shows hover effect)
  ghost: "bg-transparent text-pink-600 hover:bg-pink-50 border-none"
}

// Simple size variations
const buttonSizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4",
  lg: "h-12 px-6 text-lg"
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonStyles
  size?: keyof typeof buttonSizes
}

const buttonVariants = ({ 
  variant = "primary", 
  size = "md" 
}: {
  variant?: keyof typeof buttonStyles;
  size?: keyof typeof buttonSizes;
} = {}) => {
  return cn(baseButtonStyles, buttonStyles[variant], buttonSizes[size]);
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        className={cn(
          baseButtonStyles,
          buttonStyles[variant],
          buttonSizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
