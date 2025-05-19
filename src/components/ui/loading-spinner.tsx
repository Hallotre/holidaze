import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
}

/**
 * A reusable loading spinner component
 * @param size - Size of the spinner (sm, md, lg)
 * @param className - Additional CSS classes
 * @param color - Color of the spinner
 */
export function LoadingSpinner({ 
  size = 'md', 
  className = '', 
  color = 'currentColor' 
}: LoadingSpinnerProps) {
  // Size mappings
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };
  
  const sizeClass = sizeMap[size] || sizeMap.md;
  
  return (
    <div className={`inline-block animate-spin ${sizeClass} ${className}`} role="status" aria-label="Loading">
      <svg 
        className="animate-spin" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke={color} 
          strokeWidth="4"
        ></circle>
        <path 
          className="opacity-75" 
          fill={color} 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span className="sr-only">Loading</span>
    </div>
  );
} 