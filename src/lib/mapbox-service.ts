/**
 * Service for securely interacting with Mapbox APIs
 * This approach keeps the Mapbox token on the server side
 * by using a Next.js API route as a proxy
 */

// Geocodes an address string to coordinates
export async function geocodeAddress(address: string) {
  try {
    // Use our secure API route instead of directly calling Mapbox
    const response = await fetch(`/api/mapbox?endpoint=geocoding/v5/mapbox.places&query=${encodeURIComponent(address)}`);
    
    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error geocoding address:', error);
    throw error;
  }
}

// Interface for location data
export interface LocationData {
  address?: string;
  city?: string;
  country?: string;
  zip?: string;
  lat?: number;
  lng?: number;
}

// Interface for Mapbox feature
export interface MapboxFeature {
  id?: string;
  place_name?: string;
  geometry?: {
    type?: string;
    coordinates?: number[];
  };
  context?: Array<{
    id?: string;
    text?: string;
  }>;
  properties?: Record<string, unknown>;
}

// Parses Mapbox feature to extract location data
export function parseMapboxFeature(feature: MapboxFeature): LocationData {
  if (!feature) return {};
  
  // Extract address components
  let city = '';
  let country = '';
  let zip = '';
  let address = '';
  
  // Try to extract full address
  if (feature.place_name) {
    address = feature.place_name;
  }
  
  // Try to extract address components from context
  if (feature.context) {
    for (const item of feature.context) {
      if (item.id && item.id.startsWith('place')) {
        city = item.text || '';
      } else if (item.id && item.id.startsWith('country')) {
        country = item.text || '';
      } else if (item.id && item.id.startsWith('postcode')) {
        zip = item.text || '';
      }
    }
  }
  
  // Extract coordinates if available
  let lat: number | undefined;
  let lng: number | undefined;
  if (feature.geometry && feature.geometry.coordinates) {
    [lng, lat] = feature.geometry.coordinates;
  }
  
  return {
    address,
    city,
    country,
    zip,
    lat,
    lng
  };
} 