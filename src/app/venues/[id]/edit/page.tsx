"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLocalUser } from "@/lib/get-local-user";
import { useVenueForm } from "@/lib/hooks/useVenueForm";
import { venueService } from "@/lib/api";
import { Venue } from "@/types/venue";
import { logError } from "@/lib/utils/error-handler";

// Import form section components
import { BasicInformation } from "@/components/venue-form/basic-information";
import { Amenities } from "@/components/venue-form/amenities";
import { Location } from "@/components/venue-form/location";
import { Media } from "@/components/venue-form/media";
import { SuccessMessage } from "@/components/venue-form/success-message";
import { ErrorMessage } from "@/components/venue-form/error-message";

/**
 * EditVenuePage - Page component for editing an existing venue
 * 
 * This component handles:
 * - Checking if the user is authorized to edit the venue
 * - Loading the existing venue data
 * - Rendering the venue edit form
 * - Form submission and error handling
 */
export default function EditVenuePage() {
  const params = useParams();
  const router = useRouter();
  const venueId = Array.isArray(params.id) ? params.id[0] : (params.id as string);
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // Delete venue state
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  
  // Use our custom form hook
  const {
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
    handleAddressSelect
  } = useVenueForm();

  // Load venue data and check authorization
  useEffect(() => {
    const fetchVenueAndCheckAuth = async () => {
      setIsLoading(true);
      setLoadError(null);
      
      try {
        // Get current user
        const user = getLocalUser();
        if (!user) {
          router.replace("/login");
          return;
        }
        
        // Check if user is a venue manager
        setIsVenueManager(!!user.venueManager);
        
        // Load venue data
        const response = await venueService.getVenueById(venueId, true, false);
        const venue = response.data as Venue;
        
        // Check if user is the owner of the venue
        if (venue.owner && venue.owner.name === user.name) {
          setIsAuthorized(true);
          
          // Populate form data with venue data
          setFormData({
            name: venue.name,
            description: venue.description,
            price: venue.price,
            maxGuests: venue.maxGuests,
            media: venue.media.length > 0 ? venue.media : [{ url: "", alt: "" }],
            meta: {
              wifi: venue.meta?.wifi || false,
              parking: venue.meta?.parking || false,
              breakfast: venue.meta?.breakfast || false,
              pets: venue.meta?.pets || false
            },
            location: {
              address: venue.location?.address || "",
              city: venue.location?.city || "",
              zip: venue.location?.zip || "",
              country: venue.location?.country || "",
              lat: venue.location?.lat,
              lng: venue.location?.lng
            },
            category: venue.category
          });
        } else {
          setIsAuthorized(false);
          setLoadError("You are not authorized to edit this venue");
        }
      } catch (err) {
        logError(err, "EditVenuePage:fetchVenueAndCheckAuth");
        setLoadError("Failed to load venue details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (venueId) {
      fetchVenueAndCheckAuth();
    } else {
      setLoadError("No venue ID found");
      setIsLoading(false);
    }
  }, [venueId, router, setFormData]);

  // Handle form submission
  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      // Prepare venue data for update with proper types
      const venueUpdateData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        maxGuests: formData.maxGuests,
        media: formData.media,
        meta: {
          wifi: formData.meta?.wifi || false,
          parking: formData.meta?.parking || false,
          breakfast: formData.meta?.breakfast || false,
          pets: formData.meta?.pets || false
        },
        location: formData.location,
        category: formData.category
      };
      
      // Update the venue
      await venueService.updateVenue(venueId, venueUpdateData);
      
      // Set success message
      setSuccess("Venue updated successfully!");
      
      // Redirect after a delay
      setTimeout(() => {
        router.push(`/venues/${venueId}`);
      }, 2000);
    } catch (err) {
      logError(err, "EditVenuePage:onSubmitForm");
      setError(err instanceof Error ? err.message : "Failed to update venue");
    }
  };

  // Handle venue deletion
  const handleDeleteVenue = async () => {
    setDeleteLoading(true);
    setDeleteError(null);
    
    try {
      await venueService.deleteVenue(venueId);
      
      // Show a brief success message and clear other messages
      setError(null);
      setSuccess("Venue deleted successfully! Redirecting to profile...");
      
      // Redirect to profile after a delay
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (err) {
      logError(err, "EditVenuePage:handleDeleteVenue");
      setDeleteError(err instanceof Error ? err.message : "Failed to delete venue");
      setDeleteLoading(false);
    }
  };

  if (isLoading) return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardContent className="py-8 text-center">
          Loading venue data...
        </CardContent>
      </Card>
    </div>
  );

  if (loadError) return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardContent className="py-8">
          <div className="text-red-500 mb-4">{loadError}</div>
          <Button onClick={() => router.back()}>Go Back</Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Confirm Deletion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Are you sure you want to delete <strong>{formData.name}</strong>? 
                This action cannot be undone.
              </p>
              {deleteError && <p className="text-red-500 mb-4">{deleteError}</p>}
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteConfirmation(false)}
                  disabled={deleteLoading}
                >
                  Cancel
                </Button>
                <Button 
                  variant="danger" 
                  onClick={handleDeleteVenue}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : "Delete Venue"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Venue</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Error message */}
          {error && (
            <ErrorMessage 
              error={error} 
              isVenueManager={isVenueManager}
            />
          )}
          
          {/* Success message with redirect */}
          {success && (
            <SuccessMessage 
              message={success}
              venueId={venueId}
              redirectDelay={2000}
            />
          )}

          {/* Venue edit form */}
          {isAuthorized && isVenueManager && (
            <form onSubmit={onSubmitForm} className="space-y-6">
              {/* Basic Information Section */}
              <BasicInformation 
                formData={formData}
                handleChange={handleChange}
                isSubmitting={isSubmitting}
              />
              
              {/* Amenities Section */}
              <Amenities 
                formData={formData}
                handleCheckboxChange={handleCheckboxChange}
                isSubmitting={isSubmitting}
              />
              
              {/* Location Section */}
              <Location 
                formData={formData}
                handleChange={handleChange}
                handleAddressSelect={handleAddressSelect}
                isSubmitting={isSubmitting}
              />
              
              {/* Media Section */}
              <Media 
                formData={formData}
                handleMediaChange={handleMediaChange}
                addMediaField={addMediaField}
                removeMediaField={removeMediaField}
                isSubmitting={isSubmitting}
              />
              
              {/* Submit Button */}
              <div className="pt-4 flex gap-4">
                <Button 
                  type="submit" 
                  className="flex-1" 
                  variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating Venue..." : "Update Venue"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
          
          {/* Delete Button - outside of the form */}
          {isAuthorized && isVenueManager && (
            <div className="mt-8 border-t pt-6">
              <div className="flex flex-col">
                <h3 className="text-lg font-medium mb-4 text-red-600">Danger Zone</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Once you delete a venue, there is no going back. Please be certain.
                </p>
                <Button 
                  variant="danger"
                  onClick={() => setShowDeleteConfirmation(true)}
                  className="self-start"
                >
                  Delete This Venue
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 