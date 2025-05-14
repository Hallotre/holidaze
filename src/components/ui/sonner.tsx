"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

// Add global styles to ensure toast styling is correctly applied
import "./toaster.css"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group border-2 border-pink-200 bg-white shadow-lg",
          title: "text-pink-700 font-semibold text-base",
          description: "!text-pink-600 !font-medium text-sm", // Using !important to override default styles
          actionButton: "bg-pink-600 text-white",
          cancelButton: "bg-pink-100 text-pink-700",
          closeButton: "text-pink-600 hover:bg-pink-100",
          success: "border-blue-500 bg-blue-50",
          error: "border-red-500",
          info: "border-blue-500 bg-blue-50",
        },
      }}
      style={
        {
          "--normal-bg": "white",
          "--normal-text": "#db2777", // Pink-600
          "--normal-border": "#fbcfe8", // Pink-200
          "--normal-description": "#db2777", // Pink-600 for description
          "--success-bg": "#eff6ff", // Blue-50
          "--success-text": "#3b82f6", // Blue-500
          "--success-border": "#93c5fd", // Blue-300
          "--error-bg": "#fef2f2", // Red-50
          "--error-text": "#ef4444", // Red-500
          "--error-border": "#fecaca", // Red-200
        } as React.CSSProperties
      }
      richColors
      closeButton={true}
      {...props}
    />
  )
}

export { Toaster }
