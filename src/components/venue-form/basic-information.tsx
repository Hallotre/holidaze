"use client";

import React, { useRef, useState } from 'react';
import { VenueCreate } from '@/types/venue';

interface BasicInformationProps {
  formData: VenueCreate;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  isSubmitting: boolean;
}

/**
 * BasicInformation - Component for the basic venue information form section
 * 
 * @param formData - The current form data
 * @param handleChange - Handler for input changes
 * @param isSubmitting - Whether the form is currently submitting
 */
export function BasicInformation({ formData, handleChange, isSubmitting }: BasicInformationProps) {
  const priceInputRef = useRef<HTMLInputElement>(null);
  const maxGuestsInputRef = useRef<HTMLInputElement>(null);
  const [isFocusedPrice, setIsFocusedPrice] = useState(false);
  const [isFocusedGuests, setIsFocusedGuests] = useState(false);
  const [tempPriceValue, setTempPriceValue] = useState<string>("");
  const [tempGuestsValue, setTempGuestsValue] = useState<string>("");
  
  // Handle focus on number fields
  const handleNumberFocus = (
    e: React.FocusEvent<HTMLInputElement>, 
    setFocused: React.Dispatch<React.SetStateAction<boolean>>,
    fieldName: "price" | "maxGuests"
  ) => {
    setFocused(true);
    // Store current value as string
    if (fieldName === "price") {
      setTempPriceValue(formData.price === 0 ? "" : formData.price.toString());
    } else {
      setTempGuestsValue(formData.maxGuests === 1 ? "" : formData.maxGuests.toString());
    }
  };
  
  // Handle blur on number fields
  const handleNumberBlur = (
    e: React.FocusEvent<HTMLInputElement>, 
    setFocused: React.Dispatch<React.SetStateAction<boolean>>,
    fieldName: "price" | "maxGuests"
  ) => {
    setFocused(false);
    
    // On blur, if the field is empty, reset to default value
    if (fieldName === "price") {
      if (tempPriceValue === "") {
        // Create a synthetic event to set price back to 0
        const syntheticEvent = {
          target: {
            name: "price",
            value: "0",
            type: "number"
          }
        } as React.ChangeEvent<HTMLInputElement>;
        handleChange(syntheticEvent);
      }
    } else {
      if (tempGuestsValue === "") {
        // Create a synthetic event to set maxGuests back to 1
        const syntheticEvent = {
          target: {
            name: "maxGuests",
            value: "1",
            type: "number"
          }
        } as React.ChangeEvent<HTMLInputElement>;
        handleChange(syntheticEvent);
      }
    }
  };
  
  // Handle custom change for numbers to allow temporary empty values
  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setTempValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const { value } = e.target;
    setTempValue(value);
    
    // Only update the form state if there's a value
    if (value !== "") {
      handleChange(e);
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Basic Information</h3>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Venue Name <span className="text-red-500">*</span> <span className="text-xs text-gray-500">(3-50 characters)</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 w-full border rounded p-2"
            placeholder="Beach House Retreat"
            disabled={isSubmitting}
            minLength={3}
            maxLength={50}
          />
        </label>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Description <span className="text-red-500">*</span> <span className="text-xs text-gray-500">(10-1000 characters)</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="mt-1 w-full border rounded p-2"
            placeholder="Describe your venue in detail"
            disabled={isSubmitting}
            minLength={10}
            maxLength={1000}
          />
          <span className="text-xs text-gray-500 mt-1 block text-right">
            {formData.description.length}/1000 characters
          </span>
        </label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Price per Night (USD) <span className="text-red-500">*</span>
            <input
              type="number"
              name="price"
              value={isFocusedPrice ? tempPriceValue : formData.price}
              onChange={(e) => handleNumberChange(e, setTempPriceValue)}
              onFocus={(e) => handleNumberFocus(e, setIsFocusedPrice, "price")}
              onBlur={(e) => handleNumberBlur(e, setIsFocusedPrice, "price")}
              ref={priceInputRef}
              required
              min="1"
              className="mt-1 w-full border rounded p-2"
              disabled={isSubmitting}
              placeholder="Enter price"
            />
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Maximum Guests <span className="text-red-500">*</span>
            <input
              type="number"
              name="maxGuests"
              value={isFocusedGuests ? tempGuestsValue : formData.maxGuests}
              onChange={(e) => handleNumberChange(e, setTempGuestsValue)}
              onFocus={(e) => handleNumberFocus(e, setIsFocusedGuests, "maxGuests")}
              onBlur={(e) => handleNumberBlur(e, setIsFocusedGuests, "maxGuests")}
              ref={maxGuestsInputRef}
              required
              min="1"
              max="100"
              className="mt-1 w-full border rounded p-2"
              disabled={isSubmitting}
              placeholder="Enter number of guests"
            />
          </label>
        </div>
      </div>
    </div>
  );
} 