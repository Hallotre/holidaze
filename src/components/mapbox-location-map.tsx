"use client";

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { logError } from '@/lib/utils/error-handler';

interface MapboxLocationMapProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  className?: string;
  showMarker?: boolean;
}

/**
 * MapboxLocationMap - A component for displaying a location on a map using Mapbox GL
 * 
 * @param latitude - The latitude coordinate
 * @param longitude - The longitude coordinate
 * @param zoom - The initial zoom level (default: 14)
 * @param className - Additional CSS classes
 * @param showMarker - Whether to display a marker at the specified coordinates
 */
export function MapboxLocationMap({
  latitude,
  longitude,
  zoom = 14,
  className = "",
  showMarker = true
}: MapboxLocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Initialize the map
  useEffect(() => {
    if (!isClient || !mapContainer.current || !latitude || !longitude) return;
    
    try {
      const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
      
      if (!token) {
        setMapError("MapBox access token not found");
        setIsLoading(false);
        return;
      }
      
      if (!map.current) {
        mapboxgl.accessToken = token;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [longitude, latitude],
          zoom: zoom
        });
        
        map.current.on('load', () => {
          setIsLoading(false);
        });
        
        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Add marker if requested
        if (showMarker) {
          marker.current = new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .addTo(map.current);
        }
      } else {
        // Update the map center and marker if coordinates change
        map.current.setCenter([longitude, latitude]);
        
        if (showMarker && marker.current) {
          marker.current.setLngLat([longitude, latitude]);
        }
        
        setIsLoading(false);
      }
    } catch (error: unknown) {
      logError(error, 'MapboxLocationMap');
      setMapError('Failed to load map');
      setIsLoading(false);
    }
    
    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isClient, latitude, longitude, zoom, showMarker]);
  
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
      <div 
        ref={mapContainer} 
        className="w-full h-full min-h-[250px] rounded-lg overflow-hidden"
      />
      
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