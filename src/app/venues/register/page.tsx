"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLocalUser, refreshLocalUserSettings } from "@/lib/get-local-user";
import { useVenueForm } from "@/lib/hooks/useVenueForm";
import { logError } from "@/lib/utils/error-handler";

// Import form section components
import { BasicInformation } from "@/components/venue-form/basic-information";
import { Amenities } from "@/components/venue-form/amenities";
import { Location } from "@/components/venue-form/location";
import { Media } from "@/components/venue-form/media";
import { SuccessMessage } from "@/components/venue-form/success-message";
import { ErrorMessage } from "@/components/venue-form/error-message";

/**
 * RegisterVenuePage - Page component for venue registration
 * 
 * This component handles:
 * - Checking if the user is a venue manager
 * - Rendering the venue registration form
 * - Form submission and error handling
 */
export default function RegisterVenuePage() {
  const router = useRouter();
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [createdVenueId, setCreatedVenueId] = useState<string | undefined>(undefined);
  
  // Use our custom form hook
  const {
    formData,
    isSubmitting,
    error,
    success,
    handleChange,
    handleCheckboxChange,
    handleMediaChange,
    addMediaField,
    removeMediaField,
    handleAddressSelect,
    handleSubmit
  } = useVenueForm();

  // Check if user is a venue manager
  useEffect(() => {
    try {
      // Use the refreshed user settings to ensure we have the latest data
      const user = refreshLocalUserSettings();
      if (!user) {
        router.replace("/login");
        return;
      }
      
      if (!user.venueManager) {
        setIsVenueManager(false);
      } else {
        setIsVenueManager(true);
      }
    } catch (err) {
      logError(err, "RegisterVenuePage:checkVenueManager");
    }
  }, [router]);

  // Handle form submission with venue ID callback
  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    await handleSubmit(e, (venueId) => {
      setCreatedVenueId(venueId);
    });
  };

  // Handle refreshing user settings
  const handleRefreshSettings = () => {
    refreshLocalUserSettings();
    const user = getLocalUser();
    if (user && user.venueManager) {
      setIsVenueManager(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register New Venue</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Error message */}
          {error && (
            <ErrorMessage 
              error={error} 
              isVenueManager={isVenueManager} 
              onRefreshSettings={handleRefreshSettings}
            />
          )}
          
          {/* Success message with redirect */}
          {success && (
            <SuccessMessage 
              message={success}
              venueId={createdVenueId}
              redirectDelay={3000}
            />
          )}

          {/* Venue registration form */}
          {isVenueManager && (
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
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering Venue..." : "Register Venue"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}