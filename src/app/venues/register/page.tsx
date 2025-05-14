"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { venueService } from "@/lib/api";
import { getLocalUser, refreshLocalUserSettings } from "@/lib/get-local-user";
import { VenueCreate, VenueCategory } from "@/types/venue";
import Link from "next/link";
import { z } from "zod";

const venueSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(50, "Name cannot exceed 50 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(1, "Price must be at least 1"),
  maxGuests: z.number().min(1, "Maximum guests must be at least 1").max(100, "Maximum guests cannot exceed 100"),
  category: z.enum([
    "apartment", "house", "cabin", "villa", "hotel", 
    "unique", "bnb", "resort", "camping", "other"
  ]).optional(),
  media: z.array(
    z.object({
      url: z.string().url("Invalid image URL"),
      alt: z.string().optional()
    })
  ).optional(),
  meta: z.object({
    wifi: z.boolean().optional(),
    parking: z.boolean().optional(),
    breakfast: z.boolean().optional(),
    pets: z.boolean().optional()
  }).optional(),
  location: z.object({
    address: z.string().optional(),
    city: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().optional(),
    continent: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional()
  }).optional()
});

export default function RegisterVenuePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isVenueManager, setIsVenueManager] = useState(false);
  const router = useRouter();

  // Initialize state for form inputs
  const [formData, setFormData] = useState<VenueCreate>({
    name: "",
    description: "",
    price: 0,
    maxGuests: 1,
    category: "apartment",
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
      continent: "",
      lat: undefined,
      lng: undefined
    }
  });

  // Check if user is a venue manager
  useEffect(() => {
    // Use the refreshed user settings to ensure we have the latest data
    const user = refreshLocalUserSettings();
    if (!user) {
      router.replace("/login");
      return;
    }
    
    if (!user.venueManager) {
      setIsVenueManager(false);
      setError("You need to be a venue manager to register venues. Please update your profile.");
    } else {
      setIsVenueManager(true);
    }
  }, [router]);

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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      setIsSubmitting(true);
      
      // Validate form data
      const validatedData = venueSchema.parse(formData);
      
      // Clean up data before submission (remove empty fields)
      const cleanedMedia = formData.media?.filter(item => item.url.trim() !== "") || [];
      const submissionData: VenueCreate = {
        ...validatedData,
        media: cleanedMedia.length ? cleanedMedia : undefined
      };
      
      // Submit venue data
      const response = await venueService.createVenue(submissionData);
      setSuccess(`Venue "${response.data.name}" has been successfully registered!`);
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        price: 0,
        maxGuests: 1,
        category: "apartment",
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
          continent: "",
          lat: undefined,
          lng: undefined
        }
      });
      
      // Redirect to the new venue page after a short delay
      setTimeout(() => {
        router.push(`/venues/${response.data.id}`);
      }, 2000);
      
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const firstError = err.errors[0];
        setError(`Validation error: ${firstError.message}`);
      } else {
        setError(err?.message || "Failed to register venue");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions: VenueCategory[] = [
    "apartment", "house", "cabin", "villa", "hotel", 
    "unique", "bnb", "resort", "camping", "other"
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register New Venue</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
              {error}
              {!isVenueManager && (
                <div className="mt-2 flex flex-col gap-2">
                  <p className="text-sm">You need to check the "Venue Manager" option in your profile settings.</p>
                  <Link href="/profile" className="bg-blue-600 text-white px-4 py-2 rounded-md text-center hover:bg-blue-700 transition-colors">
                    Update Profile Settings
                  </Link>
                  <Button 
                    type="button" 
                    variant="outline"
                    className="mt-2"
                    onClick={() => {
                      refreshLocalUserSettings();
                      const user = getLocalUser();
                      if (user && user.venueManager) {
                        setIsVenueManager(true);
                        setError(null);
                      } else {
                        setError("Still not recognized as a venue manager. Try logging out and back in.");
                      }
                    }}
                  >
                    Refresh Settings
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6">
              {success}
            </div>
          )}

          {isVenueManager && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Venue Name *
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full border rounded p-2"
                      placeholder="Beach House Retreat"
                    />
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description *
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="mt-1 w-full border rounded p-2"
                      placeholder="Describe your venue in detail"
                    />
                  </label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Price per Night (USD) *
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="1"
                        className="mt-1 w-full border rounded p-2"
                      />
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Maximum Guests *
                      <input
                        type="number"
                        name="maxGuests"
                        value={formData.maxGuests}
                        onChange={handleChange}
                        required
                        min="1"
                        max="100"
                        className="mt-1 w-full border rounded p-2"
                      />
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="mt-1 w-full border rounded p-2"
                    >
                      {categoryOptions.map(option => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              
              {/* Amenities Section */}
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
                    />
                    Pets Allowed
                  </label>
                </div>
              </div>
              
              {/* Location Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Location</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Address
                    <input
                      type="text"
                      name="location.address"
                      value={formData.location?.address || ""}
                      onChange={handleChange}
                      className="mt-1 w-full border rounded p-2"
                      placeholder="123 Beach Avenue"
                    />
                  </label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      City
                      <input
                        type="text"
                        name="location.city"
                        value={formData.location?.city || ""}
                        onChange={handleChange}
                        className="mt-1 w-full border rounded p-2"
                        placeholder="Miami"
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
                      />
                    </label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Country
                      <input
                        type="text"
                        name="location.country"
                        value={formData.location?.country || ""}
                        onChange={handleChange}
                        className="mt-1 w-full border rounded p-2"
                        placeholder="USA"
                      />
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Continent
                      <input
                        type="text"
                        name="location.continent"
                        value={formData.location?.continent || ""}
                        onChange={handleChange}
                        className="mt-1 w-full border rounded p-2"
                        placeholder="North America"
                      />
                    </label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Latitude
                      <input
                        type="number"
                        name="location.lat"
                        value={formData.location?.lat || ""}
                        onChange={handleChange}
                        step="any"
                        className="mt-1 w-full border rounded p-2"
                        placeholder="25.7617"
                      />
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Longitude
                      <input
                        type="number"
                        name="location.lng"
                        value={formData.location?.lng || ""}
                        onChange={handleChange}
                        step="any"
                        className="mt-1 w-full border rounded p-2"
                        placeholder="-80.1918"
                      />
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Media Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Media</h3>
                <p className="text-sm text-gray-500">Add images of your venue (at least one recommended)</p>
                
                {formData.media?.map((item, index) => (
                  <div key={index} className="space-y-2 border p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Image {index + 1}</h4>
                      {formData.media!.length > 1 && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeMediaField(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Image URL
                        <input
                          type="url"
                          value={item.url || ""}
                          onChange={(e) => handleMediaChange(index, "url", e.target.value)}
                          className="mt-1 w-full border rounded p-2"
                          placeholder="https://example.com/image.jpg"
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
                        />
                      </label>
                    </div>
                  </div>
                ))}
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addMediaField}
                  className="w-full"
                >
                  Add Another Image
                </Button>
              </div>
              
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