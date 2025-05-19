"use client";

import React from 'react';
import Image from 'next/image';
import { VenueCreate } from '@/types/venue';
import { Button } from '@/components/ui/button';

interface MediaProps {
  formData: VenueCreate;
  handleMediaChange: (index: number, field: "url" | "alt", value: string) => void;
  addMediaField: () => void;
  removeMediaField: (index: number) => void;
  isSubmitting: boolean;
}

/**
 * Media - Component for the venue media form section
 * 
 * @param formData - The current form data
 * @param handleMediaChange - Handler for media field changes
 * @param addMediaField - Function to add a new media field
 * @param removeMediaField - Function to remove a media field
 * @param isSubmitting - Whether the form is currently submitting
 */
export function Media({ 
  formData, 
  handleMediaChange, 
  addMediaField, 
  removeMediaField, 
  isSubmitting 
}: MediaProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Media</h3>
      <p className="text-sm text-gray-500">Add images of your venue (at least one required)</p>
      
      {formData.media?.map((item, index) => (
        <div key={index} className="space-y-2 border p-4 rounded-md">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Image {index + 1} {index === 0 && <span className="text-red-500">*</span>}</h4>
            {formData.media!.length > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => removeMediaField(index)}
                className="text-red-500 hover:text-red-700"
                disabled={isSubmitting}
              >
                Remove
              </Button>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Image URL <span className="text-red-500">*</span>
              <input
                type="url"
                value={item.url || ""}
                onChange={(e) => handleMediaChange(index, "url", e.target.value)}
                className="mt-1 w-full border rounded p-2"
                placeholder="https://example.com/image.jpg"
                disabled={isSubmitting}
                required={index === 0}
              />
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Image Description
              <input
                type="text"
                value={item.alt || ""}
                onChange={(e) => handleMediaChange(index, "alt", e.target.value)}
                className="mt-1 w-full border rounded p-2"
                placeholder="Beautiful beach view"
                disabled={isSubmitting}
              />
            </label>
          </div>
          
          {/* Preview image if URL is valid */}
          {item.url && (
            <div className="mt-2">
              <div className="text-xs text-gray-500 mb-1">Preview:</div>
              <div className="relative max-h-32 w-full">
                <Image 
                  src={item.url} 
                  alt={item.alt || "Preview"} 
                  className="rounded border object-contain"
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  onError={(e) => {
                    // Hide broken images
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                  onLoad={(e) => {
                    // Show successful images
                    (e.target as HTMLImageElement).style.display = 'block';
                  }}
                  style={{ display: 'none' }} // Start hidden until loaded
                />
              </div>
            </div>
          )}
        </div>
      ))}
      
      <Button 
        type="button" 
        variant="outline" 
        onClick={addMediaField}
        className="w-full"
        disabled={isSubmitting}
      >
        Add Another Image
      </Button>
    </div>
  );
} 