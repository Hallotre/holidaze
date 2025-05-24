"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface MapboxLocationMapProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  className?: string;
  showMarker?: boolean;
  width?: number;
  height?: number;
}

/**
 * MapboxLocationMap - A component for displaying a location on a map using Mapbox static images
 * 
 * This component fetches a static map image from our server-side API route
 * to keep the Mapbox token secure and not expose it to the client.
 * 
 * @param latitude - The latitude coordinate
 * @param longitude - The longitude coordinate
 * @param zoom - The initial zoom level (default: 14)
 * @param className - Additional CSS classes
 * @param showMarker - Whether to display a marker at the specified coordinates
 * @param width - The width of the map image in pixels (default: 600)
 * @param height - The height of the map image in pixels (default: 400)
 */
export function MapboxLocationMap({
  latitude,
  longitude,
  zoom = 14,
  className = "",
  showMarker = true,
  width = 600,
  height = 400
}: MapboxLocationMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapImageUrl, setMapImageUrl] = useState<string | null>(null);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Generate the static map URL
  useEffect(() => {
    if (!isClient || !latitude || !longitude) return;
    
    try {
      // Create a URL for our server-side API route that will proxy the Mapbox static image request
      const staticMapUrl = `/api/mapbox/static?` + 
        `lat=${latitude}&` +
        `lng=${longitude}&` +
        `zoom=${zoom}&` +
        `width=${width}&` +
        `height=${height}&` +
        `marker=${showMarker}`;
      
      setMapImageUrl(staticMapUrl);
      setIsLoading(false);
    } catch (error) {
      console.error('Error generating map URL:', error);
      setMapError('Failed to generate map URL');
      setIsLoading(false);
    }
  }, [isClient, latitude, longitude, zoom, showMarker, width, height]);
  
  // If coordinates are not provided, show a message
  if (!latitude || !longitude) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center p-8 ${className}`}>
        <p className="text-gray-500">No location coordinates available</p>
      </div>
    );
  }
  
  return (
    <div className={`relative ${className}`}>
      <div className="w-full h-full min-h-[250px] rounded-lg overflow-hidden">
        {isClient && !isLoading && mapImageUrl && (
          <Image
            src={mapImageUrl}
            alt={`Map showing location at ${latitude},${longitude}`}
            width={width}
            height={height}
            className="object-cover w-full h-full"
          />
        )}
      </div>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      )}
      
      {/* Error message */}
      {mapError && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center text-red-500 p-4">
          <p>{mapError}</p>
        </div>
      )}
    </div>
  );
} 