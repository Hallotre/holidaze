"use client";

import React from 'react';
import { VenueCreate } from '@/types/venue';

interface AmenitiesProps {
  formData: VenueCreate;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
}

/**
 * Amenities - Component for the venue amenities form section
 * 
 * @param formData - The current form data
 * @param handleCheckboxChange - Handler for checkbox changes
 * @param isSubmitting - Whether the form is currently submitting
 */
export function Amenities({ formData, handleCheckboxChange, isSubmitting }: AmenitiesProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Amenities</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <label className="flex items-center text-sm">
          <input
            type="checkbox"
            name="meta.wifi"
            checked={formData.meta?.wifi || false}
            onChange={handleCheckboxChange}
            className="mr-2"
            disabled={isSubmitting}
          />
          WiFi Available
        </label>
        
        <label className="flex items-center text-sm">
          <input
            type="checkbox"
            name="meta.parking"
            checked={formData.meta?.parking || false}
            onChange={handleCheckboxChange}
            className="mr-2"
            disabled={isSubmitting}
          />
          Parking Available
        </label>
        
        <label className="flex items-center text-sm">
          <input
            type="checkbox"
            name="meta.breakfast"
            checked={formData.meta?.breakfast || false}
            onChange={handleCheckboxChange}
            className="mr-2"
            disabled={isSubmitting}
          />
          Breakfast Included
        </label>
        
        <label className="flex items-center text-sm">
          <input
            type="checkbox"
            name="meta.pets"
            checked={formData.meta?.pets || false}
            onChange={handleCheckboxChange}
            className="mr-2"
            disabled={isSubmitting}
          />
          Pets Allowed
        </label>
      </div>
    </div>
  );
} 