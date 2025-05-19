"use client";

import React from 'react';
import { VenueCreate } from '@/types/venue';
import { MapboxAddressInput } from '@/components/mapbox-address-input';
import { MapboxLocationMap } from '@/components/mapbox-location-map';

interface LocationProps {
  formData: VenueCreate;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleAddressSelect: (value: string, locationData?: {
    address?: string;
    city?: string;
    country?: string;
    zip?: string;
    lat?: number;
    lng?: number;
  }) => void;
  isSubmitting: boolean;
}

/**
 * Location - Component for the venue location form section
 * 
 * @param formData - The current form data
 * @param handleChange - Handler for input changes
 * @param handleAddressSelect - Handler for address selection from MapBox
 * @param isSubmitting - Whether the form is currently submitting
 */
export function Location({ formData, handleChange, handleAddressSelect, isSubmitting }: LocationProps) {
  const hasCoordinates = formData.location?.lat !== undefined && formData.location?.lng !== undefined;
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Location</h3>
        <p className="text-sm text-gray-500">
          Use our address search to automatically fill in your venue&apos;s location details.
        </p>
      </div>
      
      {/* Address autocomplete field - Full width and prominent */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <label className="block font-medium text-blue-800 mb-2">
          Search for your venue address <span className="text-red-500">*</span>
          <div className="mt-1">
            <MapboxAddressInput
              value={formData.location?.address || ""}
              onChange={handleAddressSelect}
              placeholder="Start typing your venue address..."
              className="w-full border rounded p-3 focus:ring-2 focus:ring-blue-500 text-black [&::selection]:text-black [&::selection]:bg-blue-200"
              disabled={isSubmitting}
            />
          </div>
          <p className="text-xs text-blue-700 mt-1">
            For best results, select an address from the dropdown to automatically fill location details
          </p>
        </label>
      </div>
      
      {/* Map display when coordinates are available */}
      {hasCoordinates && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <h4 className="font-medium text-gray-700">Location Preview</h4>
          </div>
          <MapboxLocationMap 
            latitude={formData.location?.lat}
            longitude={formData.location?.lng}
            className="h-[300px]"
          />
        </div>
      )}
      
      {/* Address details section */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 mb-3">Address details (automatically filled from search above):</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              City <span className="text-red-500">*</span>
              <input
                type="text"
                name="location.city"
                value={formData.location?.city || ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded p-2"
                placeholder="Miami"
                disabled={isSubmitting}
                required
              />
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Zip/Postal Code
              <input
                type="text"
                name="location.zip"
                value={formData.location?.zip || ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded p-2"
                placeholder="33101"
                disabled={isSubmitting}
              />
            </label>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Country <span className="text-red-500">*</span>
              <input
                type="text"
                name="location.country"
                value={formData.location?.country || ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded p-2"
                placeholder="USA"
                disabled={isSubmitting}
                required
              />
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Address <span className="text-red-500">*</span>
              <input
                type="text"
                name="location.address"
                value={formData.location?.address || ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded p-2 bg-gray-50"
                placeholder="Full address from search"
                disabled={isSubmitting}
                required
              />
            </label>
          </div>
        </div>
      </div>
      
      {/* Display coordinates if available */}
      {/* Removing coordinates display as per request */}
    </div>
  );
} 