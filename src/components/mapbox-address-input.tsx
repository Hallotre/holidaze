"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { logError } from '@/lib/utils/error-handler';

interface MapboxAddressInputProps {
  value: string;
  onChange: (value: string, location?: {
    address?: string;
    city?: string;
    country?: string;
    zip?: string;
    lat?: number;
    lng?: number;
  }) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * MapboxAddressInput - A component for address autocomplete using MapBox
 * 
 * This component dynamically loads the MapBox address autocomplete functionality
 * and provides a fallback to a regular input field when MapBox is not available.
 * It also extracts location data like city, country, zip, and coordinates.
 * 
 * @param value - The current address value
 * @param onChange - Callback when address is changed or selected
 * @param placeholder - Placeholder text for the input
 * @param className - Additional CSS classes
 * @param disabled - Whether the input is disabled
 */
export function MapboxAddressInput({
  value,
  onChange,
  placeholder = "Enter an address",
  className = "",
  disabled = false,
}: MapboxAddressInputProps) {
  const [isClient, setIsClient] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [MapboxComponent, setMapboxComponent] = useState<any>(null);
  
  // This effect runs only on the client
  useEffect(() => {
    setIsClient(true);
    setIsLoading(true);
    
    // Get the token from environment variables
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (token) {
      setAccessToken(token);
      
      // Dynamically import the MapBox component only on the client
      import('@mapbox/search-js-react')
        .then((mapbox) => {
          // Using any type to bypass TypeScript checking
          setMapboxComponent(() => mapbox.AddressAutofill);
          setIsLoading(false);
        })
        .catch(err => {
          logError(err, "MapboxAddressInput");
          setLoadError("Failed to load address autocomplete");
          setIsLoading(false);
        });
    } else {
      setLoadError("MapBox access token not found");
      setIsLoading(false);
    }
  }, []);
  
  // Render loading state
  if (isClient && isLoading) {
    return (
      <div className="relative">
        <Input
          type="text"
          value={value}
          disabled={true}
          placeholder="Loading address search..."
          className={className}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <LoadingSpinner size="sm" />
        </div>
      </div>
    );
  }
  
  // Render standard input if we're server-side or MapBox isn't loaded yet
  if (!isClient || !MapboxComponent || !accessToken || loadError) {
    return (
      <div className="relative">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={loadError ? "Address search unavailable" : placeholder}
          className={className}
          disabled={disabled}
        />
        {loadError && (
          <div className="text-xs text-red-500 mt-1">
            {loadError}
          </div>
        )}
      </div>
    );
  }
  
  // Handle the address selection from MapBox
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRetrieve = (res: any) => {
    if (!res.features || !res.features.length) return;
    
    const feature = res.features[0];
    
    if (feature) {
      // Extract address components
      let city = '';
      let country = '';
      let zip = '';
      let address = '';
      
      // Try to extract full address
      if (feature.place_name) {
        address = feature.place_name;
      }
      
      // Try to extract address components from properties
      if (feature.properties) {
        // Some Mapbox responses have the address in properties
        if (feature.properties.address) {
          address = feature.properties.address;
        }
        
        // Try to extract city, country, zip from context
        if (feature.properties.context) {
          for (const item of feature.properties.context) {
            if (item.id && item.id.startsWith('place')) {
              city = item.text || '';
            } else if (item.id && item.id.startsWith('country')) {
              country = item.text || '';
            } else if (item.id && item.id.startsWith('postcode')) {
              zip = item.text || '';
            }
          }
        }
      }
      
      // Extract coordinates if available
      let lat: number | undefined;
      let lng: number | undefined;
      if (feature.geometry && feature.geometry.coordinates) {
        [lng, lat] = feature.geometry.coordinates;
      }
      
      // Update with full location data
      onChange(address, {
        address,
        city,
        country,
        zip,
        lat,
        lng
      });
    }
  };
  
  // Now we can safely render the MapBox component
  return (
    <div className="relative">
      <MapboxComponent
        accessToken={accessToken}
        onRetrieve={handleRetrieve}
      >
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={className}
          disabled={disabled}
          autoComplete="address-line1"
        />
      </MapboxComponent>
      <div className="text-xs text-green-600 mt-1">
        Address autocomplete enabled
      </div>
    </div>
  );
} 