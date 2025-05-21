"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { profileService, venueService } from "@/lib/api";
import { Venue } from "@/types/venue";
import { Building, MapPin, Users, Star, PlusCircle, Edit, Trash2, AlertTriangle, Loader2 } from "lucide-react";

export default function VenuesDashboardPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [venueToDelete, setVenueToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get username from localStorage
    const storedUsername = typeof window !== "undefined" ? localStorage.getItem("username") : null;
    if (!storedUsername) {
      router.replace("/login");
      return;
    }

    // Fetch user's venues
    const fetchVenues = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await profileService.getProfileVenues(storedUsername);
        setVenues(result.data);
      } catch (err) {
        console.error("Error fetching venues:", err);
        setError("Failed to load your venues. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVenues();
  }, [router]);

  // Handle venue deletion
  const handleDeleteVenue = async (venueId: string) => {
    if (!venueId) return;
    
    setDeleteLoading(true);
    setDeleteError(null);
    setDeleteSuccess(null);
    
    try {
      await venueService.deleteVenue(venueId);
      
      // Remove the venue from the list
      setVenues(prevVenues => prevVenues.filter(venue => venue.id !== venueId));
      
      // Clear the venueToDelete state to close the confirmation dialog
      setVenueToDelete(null);
      
      // Set success message
      setDeleteSuccess("Venue deleted successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setDeleteSuccess(null);
      }, 3000);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete venue");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Calculate venue statistics
  const totalVenues = venues.length;
  const totalCapacity = venues.reduce((total, venue) => total + (venue.maxGuests || 0), 0);
  const averageRating = venues.length > 0 
    ? venues.reduce((total, venue) => total + (venue.rating || 0), 0) / venues.length 
    : 0;
  
  // Get most common location
  const locationCounts = venues.reduce((acc, venue) => {
    if (venue.location && typeof venue.location === 'object' && 'city' in venue.location) {
      const city = String(venue.location.city);
      acc[city] = (acc[city] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const mostCommonLocation = Object.entries(locationCounts).reduce(
    (max, [city, count]) => (count > max.count ? { city, count } : max),
    { city: "None", count: 0 }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
        <p className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Success notification */}
      {deleteSuccess && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md z-50 animate-in slide-in-from-right">
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {deleteSuccess}
          </p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {venueToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Confirm Deletion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Are you sure you want to delete <strong>{venues.find(v => v.id === venueToDelete)?.name}</strong>? 
                This action cannot be undone.
              </p>
              {deleteError && <p className="text-red-500 mb-4">{deleteError}</p>}
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setVenueToDelete(null)}
                  disabled={deleteLoading}
                >
                  Cancel
                </Button>
                <Button 
                  variant="danger" 
                  onClick={() => handleDeleteVenue(venueToDelete)}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : "Delete Venue"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Venues Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your venues and track performance</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/venues/register">
            <Button variant="primary">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Venue
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Building className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-xl mb-1">{totalVenues}</CardTitle>
            <CardDescription>Total Venues</CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Users className="h-8 w-8 text-blue-500 mb-2" />
            <CardTitle className="text-xl mb-1">{totalCapacity}</CardTitle>
            <CardDescription>Total Capacity</CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Star className="h-8 w-8 text-amber-500 mb-2" />
            <CardTitle className="text-xl mb-1">{averageRating.toFixed(1)}</CardTitle>
            <CardDescription>Average Rating</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Venues List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Venues</CardTitle>
          <CardDescription>
            All venues you&apos;ve registered on Holidaze
          </CardDescription>
        </CardHeader>
        <CardContent>
          {venues.length === 0 ? (
            <div className="text-center py-12">
              <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No venues yet</h3>
              <p className="text-gray-500 mb-6">Get started by adding your first venue listing</p>
              <Link href="/venues/register">
                <Button variant="primary">
                  Register Your First Venue
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {venues.map((venue) => (
                <div key={venue.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    {/* Venue Image */}
                    <div className="w-full md:w-1/4 h-48 md:h-auto relative">
                      {venue.media?.[0]?.url ? (
                        <Image
                          src={venue.media[0].url}
                          alt={venue.media[0].alt || venue.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Building className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* Venue Details */}
                    <div className="p-4 md:p-6 flex-1">
                      <div className="flex flex-col md:flex-row md:items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">
                            <Link href={`/venues/${venue.id}`} className="hover:underline">
                              {venue.name}
                            </Link>
                          </h3>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1 mb-2">
                            {venue.location && typeof venue.location === 'object' && 'city' in venue.location && 'country' in venue.location && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{venue.location.city}, {venue.location.country}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center ml-4">
                              <Users className="h-4 w-4 mr-1" />
                              <span>Max guests: {venue.maxGuests}</span>
                            </div>
                            
                            {venue.rating > 0 && (
                              <div className="flex items-center ml-4">
                                <Star className="h-4 w-4 mr-1 text-amber-500" />
                                <span>{venue.rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full text-sm">
                          ${venue.price}/night
                        </div>
                      </div>
                      
                      <p className="text-gray-600 my-3 line-clamp-2">{venue.description}</p>
                      
                      <div className="flex flex-wrap gap-3 mt-auto">
                        <Link href={`/venues/${venue.id}`}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                        <Link href={`/venues/${venue.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => setVenueToDelete(venue.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Insights Section */}
      {venues.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Venue Insights</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Most common location:</span>
                  <span className="font-medium">
                    {mostCommonLocation.city} ({mostCommonLocation.count} venues)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average price per night:</span>
                  <span className="font-medium">
                    ${venues.reduce((sum, venue) => sum + venue.price, 0) / venues.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average capacity:</span>
                  <span className="font-medium">
                    {(totalCapacity / venues.length).toFixed(1)} guests
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <div className="mt-0.5 text-green-500">•</div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Add high-quality photos</span> to increase bookings by up to 40%
                  </p>
                </li>
                <li className="flex gap-2">
                  <div className="mt-0.5 text-green-500">•</div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Respond quickly</span> to booking inquiries to improve your acceptance rate
                  </p>
                </li>
                <li className="flex gap-2">
                  <div className="mt-0.5 text-green-500">•</div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Detailed descriptions</span> help guests make informed decisions
                  </p>
                </li>
                <li className="flex gap-2">
                  <div className="mt-0.5 text-green-500">•</div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Competitive pricing</span> based on location and amenities attracts more bookings
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex justify-center mt-8">
        <Link href="/profile">
          <Button variant="secondary" className="mx-2">Back to Profile</Button>
        </Link>
        <Link href="/profile/dashboard">
          <Button variant="primary" className="mx-2">View Booking Dashboard</Button>
        </Link>
      </div>
    </div>
  );
} 