"use client";

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { logError } from '@/lib/utils/error-handler';
import { geocodeAddress, parseMapboxFeature, LocationData, MapboxFeature } from '@/lib/mapbox-service';

interface MapboxAddressInputProps {
  value: string;
  onChange: (value: string, location?: LocationData) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * MapboxAddressInput - A component for address autocomplete with secure token handling
 * 
 * This component provides address search functionality without exposing the Mapbox token
 * by using a server-side API route as a proxy.
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Track if component is mounted
  useEffect(() => {
    setIsClient(true);
    
    // Add click outside listener to close suggestions
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounce search for better performance
  useEffect(() => {
    if (!value || value.length < 3 || !isClient) return;
    
    const timer = setTimeout(() => {
      handleSearch(value);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [value, isClient]);

  // Handle address search
  const handleSearch = async (searchText: string) => {
    if (!searchText || searchText.length < 3) {
      setSuggestions([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use our secure geocoding service
      const result = await geocodeAddress(searchText);
      
      if (result.features && Array.isArray(result.features)) {
        // Parse results to extract location data
        const parsedSuggestions = result.features
          .map((feature: MapboxFeature) => parseMapboxFeature(feature))
          .filter((loc: LocationData) => loc.address); // Only include results with an address
        
        setSuggestions(parsedSuggestions);
        setShowSuggestions(parsedSuggestions.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (err) {
      logError(err, "MapboxAddressInput");
      setError("Could not load address suggestions");
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: LocationData) => {
    if (suggestion.address) {
      onChange(suggestion.address, suggestion);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
        disabled={disabled || isLoading}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
      />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <LoadingSpinner size="sm" />
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="text-xs text-red-500 mt-1">
          {error}
        </div>
      )}
      
      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto"
        >
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li 
                key={index}
                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion.address}
                {suggestion.city && suggestion.country && (
                  <div className="text-xs text-gray-500">
                    {suggestion.city}, {suggestion.country}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 