"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface SuccessMessageProps {
  message: string;
  venueId?: string;
  redirectDelay?: number;
}

/**
 * SuccessMessage - Component for displaying a success message with redirect countdown
 * 
 * @param message - The success message to display
 * @param venueId - The ID of the created venue (for redirect)
 * @param redirectDelay - Delay in ms before redirecting
 */
export function SuccessMessage({ 
  message, 
  venueId, 
  redirectDelay = 3000 
}: SuccessMessageProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(redirectDelay / 1000);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  useEffect(() => {
    if (!venueId) return;
    
    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRedirecting(true);
          // Redirect after a brief pause to show the "Redirecting..." state
          setTimeout(() => {
            router.push(`/venues/${venueId}`);
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [venueId, router, redirectDelay]);
  
  // Handle manual redirect
  const handleRedirectNow = () => {
    if (venueId) {
      setIsRedirecting(true);
      router.push(`/venues/${venueId}`);
    }
  };
  
  return (
    <div className="bg-gradient-to-r from-green-50 to-green-100 text-green-700 p-8 rounded-lg mb-6 shadow-md border border-green-200 transition-all animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 text-green-500">
          <CheckCircle size={48} className="animate-pulse" />
        </div>
        
        <h3 className="text-xl font-bold mb-2">Success!</h3>
        <div className="text-lg mb-3">{message}</div>
        
        {venueId && (
          <div className="mt-4 w-full">
            {isRedirecting ? (
              <div className="flex items-center justify-center gap-2 bg-white p-3 rounded-md">
                <LoadingSpinner size="sm" />
                <span>Redirecting to your new venue page...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-3 rounded-md">
                  <span className="text-sm">Venue ID: <code className="bg-gray-100 px-1 py-0.5 rounded">{venueId}</code></span>
                  <span className="text-sm font-medium bg-green-100 px-2 py-1 rounded-full">
                    Redirecting in {countdown}s
                  </span>
                </div>
                
                <div className="flex gap-3 justify-center">
                  <Button 
                    onClick={handleRedirectNow}
                    variant="primary"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    View Your New Venue
                  </Button>
                  
                  <Link href="/venues/register">
                    <Button 
                      variant="outline"
                      className="border-green-500 text-green-700 hover:bg-green-50"
                      onClick={(e) => e.stopPropagation()} // Prevent the redirect
                    >
                      Register Another Venue
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 