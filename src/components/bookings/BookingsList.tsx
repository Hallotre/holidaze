"use client";

import { useState, useEffect } from "react";
import { venueService, profileService } from "@/lib/api";
import { Booking } from "@/types/booking";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users, AlertTriangle } from "lucide-react";

// Define a formatDate function inline since there are import issues
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Location type definition
interface VenueLocation {
  city?: string;
  country?: string;
  address?: string;
  zip?: string;
  lat?: number;
  lng?: number;
}

// Calculate nights between two dates
function calculateNights(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function BookingsList({ username }: { username: string }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Use profileService instead of direct fetch to ensure consistent API key handling
        const result = await profileService.getProfileBookings(username);
        
        // Ensure each booking has complete venue data
        const bookingsWithVenues = await Promise.all(
          result.data.map(async (booking: Booking) => {
            if (booking.venueId && (!booking.venue || !booking.venue.media || !booking.venue.location)) {
              try {
                const venueResult = await venueService.getVenueById(booking.venueId, true, false);
                
                return {
                  ...booking,
                  venue: venueResult.data
                };
              } catch {
                return booking;
              }
            }
            return booking;
          })
        );
        
        // Sort bookings by date, with upcoming bookings first
        const sortedBookings = bookingsWithVenues.sort((a: Booking, b: Booking) => {
          const dateA = new Date(a.dateFrom);
          const dateB = new Date(b.dateFrom);
          return dateA.getTime() - dateB.getTime();
        });
        
        setBookings(sortedBookings);
      } catch {
        setError("Failed to load your bookings. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (username) {
      fetchBookings();
    }
  }, [username]);

  // Helper to determine if a booking is in the past
  const isPastBooking = (dateFrom: string) => {
    const bookingDate = new Date(dateFrom);
    const today = new Date();
    return bookingDate < today;
  };

  // Group bookings by status (upcoming/past)
  const upcomingBookings = bookings.filter(booking => !isPastBooking(booking.dateFrom));
  const pastBookings = bookings.filter(booking => isPastBooking(booking.dateFrom));

  if (isLoading) {
    return <div className="text-center py-8">Loading your bookings...</div>;
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

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">You haven&apos;t made any bookings yet.</p>
        <Link href="/venues">
          <Button variant="primary">Find Venues to Book</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upcoming Bookings */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
        {upcomingBookings.length === 0 ? (
          <p className="text-gray-500">You don&apos;t have any upcoming bookings.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} isUpcoming={true} />
            ))}
          </div>
        )}
      </div>

      {/* Past Bookings */}
      {pastBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Past Bookings</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {pastBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} isUpcoming={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Individual booking card component
function BookingCard({ booking, isUpcoming }: { booking: Booking; isUpcoming: boolean }) {
  const [venueImage, setVenueImage] = useState<string | null>(null);
  const [venueData, setVenueData] = useState(booking.venue);
  const [isLoadingVenue, setIsLoadingVenue] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchVenueDetails = async () => {
      if (!booking.venue && booking.venueId) {
        setIsLoadingVenue(true);
        
        try {
          const result = await venueService.getVenueById(booking.venueId, true, false);
          setVenueData(result.data);
          
          if (result.data?.media && Array.isArray(result.data.media) && result.data.media.length > 0) {
            setVenueImage(result.data.media[0].url);
          }
        } catch {
          // Error handling without logging
        } finally {
          setIsLoadingVenue(false);
        }
      } else if (booking.venue) {
        setVenueData(booking.venue);
        
        if (booking.venue.media && Array.isArray(booking.venue.media) && booking.venue.media.length > 0) {
          setVenueImage(booking.venue.media[0].url);
        }
      }
    };
    
    fetchVenueDetails();
  }, [booking.id, booking.venue, booking.venueId]);
  
  // Calculate booking duration in nights
  const nights = calculateNights(booking.dateFrom, booking.dateTo);
  
  // Get venue information, with fallbacks
  const venueName = venueData?.name || booking.venue?.name || "Unknown Venue";
  const price = venueData?.price || booking.venue?.price || 0;
  
  // Venue location info
  const location = venueData?.location || booking.venue?.location;
  let city = "Unknown city";
  let country = "Unknown country";
  
  if (location && typeof location === 'object') {
    const typedLocation = location as VenueLocation;
    city = typedLocation.city || "Unknown city";
    country = typedLocation.country || "Unknown country";
  }
  
  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow ${isUpcoming ? 'border-primary/20' : 'opacity-80'}`}>
      <div className="relative h-40">
        {isLoadingVenue ? (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Loading venue details...</p>
          </div>
        ) : venueImage ? (
          <Image
            src={venueImage}
            alt={venueName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => {
              setVenueImage(null);
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
        
        {isUpcoming && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
            Upcoming
          </div>
        )}
      </div>
      
      <CardContent className="pt-4">
        <h3 className="font-semibold text-lg mb-2">
          {booking.venueId ? (
            <Link href={`/venues/${booking.venueId}`} className="hover:underline">
              {venueName}
            </Link>
          ) : (
            <span>{venueName}</span>
          )}
        </h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {formatDate(booking.dateFrom)} — {formatDate(booking.dateTo)}
            </span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span>{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{city}, {country}</span>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs uppercase font-medium text-gray-500">
              {nights} {nights === 1 ? 'night' : 'nights'} {price > 0 ? `($${price}/night)` : ''}
            </span>
            
            {booking.venueId && (
              <Link href={`/venues/${booking.venueId}`}>
                <Button variant="outline" size="sm" className="float-right">
                  View Venue
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}