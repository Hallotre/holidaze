import { useState } from 'react';
import { VenueCreate } from '@/types/venue';
import { z } from 'zod';
import { venueService } from '@/lib/api';

// Define the venue schema for validation
export const venueSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(50, "Name cannot exceed 50 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(1, "Price must be at least 1"),
  maxGuests: z.number().min(1, "Maximum guests must be at least 1").max(100, "Maximum guests cannot exceed 100"),
  media: z.array(
    z.object({
      url: z.string().url("Invalid image URL"),
      alt: z.string().optional()
    })
  ).min(1, "At least one image is required").refine(
    (media) => media.some(item => item.url.trim() !== ""),
    {
      message: "At least one image URL is required"
    }
  ),
  meta: z.object({
    wifi: z.boolean().optional(),
    parking: z.boolean().optional(),
    breakfast: z.boolean().optional(),
    pets: z.boolean().optional()
  }).optional(),
  location: z.object({
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
    zip: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional()
  })
});

// Initial form data
export const initialVenueFormData: VenueCreate = {
  name: "",
  description: "",
  price: 0,
  maxGuests: 1,
  media: [{ url: "", alt: "" }],
  meta: {
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false
  },
  location: {
    address: "",
    city: "",
    zip: "",
    country: "",
    lat: undefined,
    lng: undefined
  }
};

export interface UseVenueFormResult {
  formData: VenueCreate;
  setFormData: React.Dispatch<React.SetStateAction<VenueCreate>>;
  isSubmitting: boolean;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  success: string | null;
  setSuccess: React.Dispatch<React.SetStateAction<string | null>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMediaChange: (index: number, field: "url" | "alt", value: string) => void;
  addMediaField: () => void;
  removeMediaField: (index: number) => void;
  handleAddressSelect: (value: string, locationData?: {
    address?: string;
    city?: string;
    country?: string;
    zip?: string;
    lat?: number;
    lng?: number;
  }) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>, onSuccess?: (venueId: string) => void) => Promise<void>;
  resetForm: () => void;
}

export function useVenueForm(): UseVenueFormResult {
  const [formData, setFormData] = useState<VenueCreate>(initialVenueFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => {
        // Type guard to ensure we're working with an object
        const parentObj = prev[parent as keyof VenueCreate];
        if (parentObj && typeof parentObj === 'object') {
          return {
            ...prev,
            [parent]: {
              ...parentObj,
              [child]: type === "number" ? Number(value) : value
            }
          };
        }
        return prev;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value
      }));
    }
  };

  // Handle checkbox changes for meta fields
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const [parent, child] = name.split(".");
    
    setFormData(prev => {
      // Type guard to ensure we're working with an object
      const parentObj = prev[parent as keyof VenueCreate];
      if (parentObj && typeof parentObj === 'object') {
        return {
          ...prev,
          [parent]: {
            ...parentObj,
            [child]: checked
          }
        };
      }
      return prev;
    });
  };

  // Handle media array changes
  const handleMediaChange = (index: number, field: "url" | "alt", value: string) => {
    setFormData(prev => {
      const updatedMedia = [...(prev.media || [])];
      
      if (!updatedMedia[index]) {
        updatedMedia[index] = { url: "", alt: "" };
      }
      
      updatedMedia[index][field] = value;
      return { ...prev, media: updatedMedia };
    });
  };

  // Add another media field
  const addMediaField = () => {
    setFormData(prev => ({
      ...prev,
      media: [...(prev.media || []), { url: "", alt: "" }]
    }));
  };

  // Remove a media field
  const removeMediaField = (index: number) => {
    setFormData(prev => {
      const updatedMedia = [...(prev.media || [])];
      updatedMedia.splice(index, 1);
      return { ...prev, media: updatedMedia.length ? updatedMedia : [{ url: "", alt: "" }] };
    });
  };

  // Handle address autocomplete selection
  const handleAddressSelect = (value: string, locationData?: {
    address?: string;
    city?: string;
    country?: string;
    zip?: string;
    lat?: number;
    lng?: number;
  }) => {
    if (locationData) {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          address: locationData.address || prev.location?.address || '',
          city: locationData.city || prev.location?.city || '',
          country: locationData.country || prev.location?.country || '',
          zip: locationData.zip || prev.location?.zip || '',
          lat: locationData.lat,
          lng: locationData.lng
        }
      }));
    } else {
      // If just typing manually without selecting from dropdown
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          address: value
        }
      }));
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData(initialVenueFormData);
    setError(null);
    setSuccess(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, onSuccess?: (venueId: string) => void) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      setIsSubmitting(true);
      
      // Clean up data before validation (remove empty fields)
      const cleanedMedia = formData.media?.filter(item => item.url.trim() !== "") || [];
      
      // Check if at least one image is provided
      if (cleanedMedia.length === 0) {
        throw new Error("At least one image URL is required");
      }
      
      // Check required location fields
      if (!formData.location?.address?.trim()) {
        throw new Error("Address is required");
      }
      
      if (!formData.location?.city?.trim()) {
        throw new Error("City is required");
      }
      
      if (!formData.location?.country?.trim()) {
        throw new Error("Country is required");
      }
      
      const dataToValidate = {
        ...formData,
        media: cleanedMedia
      };
      
      // Validate form data
      const validatedData = venueSchema.parse(dataToValidate);
      
      // Submit venue data with cleaned media
      const submissionData: VenueCreate = {
        ...validatedData,
        media: cleanedMedia
      };
      
      // Submit venue data
      const response = await venueService.createVenue(submissionData);
      setSuccess(`Venue "${response.data.name}" has been successfully registered!`);
      
      // Reset form
      resetForm();
      
      // Call onSuccess callback if provided
      if (onSuccess && response.data.id) {
        onSuccess(response.data.id);
      }
      
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const firstError = err.errors[0];
        setError(`Validation error: ${firstError.message}`);
      } else {
        const errorMessage = err instanceof Error ? err.message : "Failed to register venue";
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    error,
    setError,
    success,
    setSuccess,
    handleChange,
    handleCheckboxChange,
    handleMediaChange,
    addMediaField,
    removeMediaField,
    handleAddressSelect,
    handleSubmit,
    resetForm
  };
} 