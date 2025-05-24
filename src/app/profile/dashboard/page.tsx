"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { profileService, venueService, bookingService } from "@/lib/api";
import { Booking } from "@/types/booking";
import { Calendar, MapPin, Users, CreditCard, CalendarClock, Activity, LayoutGrid, Briefcase } from "lucide-react";

// Format date to display in a readable format
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Calculate nights between two dates
function calculateNights(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Calculate total amount spent on bookings
function calculateTotalSpent(bookings: Booking[]): number {
  return bookings.reduce((total, booking) => {
    const nights = calculateNights(booking.dateFrom, booking.dateTo);
    const price = booking.venue?.price || 0;
    return total + (nights * price);
  }, 0);
}

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [venueBookings, setVenueBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVenueBookingsLoading, setIsVenueBookingsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [venueBookingsError, setVenueBookingsError] = useState<string | null>(null);
  const router = useRouter();
  
  // Toggle between user bookings and venue manager bookings
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [viewMode, setViewMode] = useState<'user' | 'manager'>('user');
  
  useEffect(() => {
    // Get username and venue manager status from localStorage
    const storedUsername = typeof window !== "undefined" ? localStorage.getItem("username") : null;
    const storedVenueManager = typeof window !== "undefined" ? localStorage.getItem("venueManager") : null;
    
    // Parse venue manager status
    if (storedVenueManager) {
      try {
        setIsVenueManager(JSON.parse(storedVenueManager));
      } catch (err) {
        console.error("Error parsing venue manager status:", err);
      }
    }
    
    if (!storedUsername) {
      router.replace("/login");
      return;
    }

    // Fetch user bookings with venue details included
    const fetchUserBookings = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Use direct API call to ensure venue data is included
        const apiUrl = `https://v2.api.noroff.dev/holidaze/profiles/${storedUsername}/bookings?_venue=true`;
        
        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'X-Noroff-API-Key': process.env.NEXT_PUBLIC_NOROFF_API_KEY || ''
          }
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const result = await response.json();
        
        // Process each booking to ensure venue data is present
        const bookingsWithVenues = await Promise.all(
          result.data.map(async (booking: Booking) => {
            // If there's no venue data or it's incomplete, fetch it
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
    
    // Fetch venue bookings for venue managers
    const fetchVenueBookings = async () => {
      if (!isVenueManager) {
        setIsVenueBookingsLoading(false);
        return;
      }
      
      setIsVenueBookingsLoading(true);
      setVenueBookingsError(null);
      
      try {
        // First get the user's venues
        const venuesResult = await profileService.getProfileVenues(storedUsername);
        const userVenues = venuesResult.data;
        
        if (!userVenues || userVenues.length === 0) {
          setVenueBookings([]);
          setIsVenueBookingsLoading(false);
          return;
        }
        
        // For each venue, get bookings with customer details included
        const venueBookingsPromises = userVenues.map(async (venue: { id: string }) => {
          try {
            // Use _customer=true to include customer details and full venue info
            const venueDetailsResult = await venueService.getVenueById(venue.id, true, true);
            const venueDetails = venueDetailsResult.data;
            
            // Check if the venue has bookings
            if (venueDetails.bookings && Array.isArray(venueDetails.bookings)) {
              // For each booking, ensure we have customer details
              const bookingsWithDetails = await Promise.all(
                venueDetails.bookings.map(async (booking: Booking) => {
                  // If customer details are missing, fetch them
                  if (!booking.customer && booking.id) {
                    try {
                      const bookingDetailsResult = await bookingService.getBookingById(booking.id, true, true);
                      return {
                        ...bookingDetailsResult.data,
                        venue: venueDetails
                      };
                    } catch (err) {
                      console.error(`Error fetching booking details for booking ${booking.id}:`, err);
                      return {
                        ...booking,
                        venue: venueDetails
                      };
                    }
                  }
                  return {
                    ...booking,
                    venue: venueDetails
                  };
                })
              );
              
              return bookingsWithDetails;
            }
            return [];
          } catch (err) {
            console.error(`Error fetching bookings for venue ${venue.id}:`, err);
            return [];
          }
        });
        
        const venueBookingsArrays = await Promise.all(venueBookingsPromises);
        const allVenueBookings = venueBookingsArrays.flat();
        
        // Sort bookings by date
        const sortedVenueBookings = allVenueBookings.sort((a: Booking, b: Booking) => {
          const dateA = new Date(a.dateFrom);
          const dateB = new Date(b.dateFrom);
          return dateA.getTime() - dateB.getTime();
        });
        
        setVenueBookings(sortedVenueBookings);
      } catch (err) {
        console.error("Error fetching venue bookings:", err);
        setVenueBookingsError("Failed to load bookings for your venues.");
      } finally {
        setIsVenueBookingsLoading(false);
      }
    };
    
    fetchUserBookings();
    fetchVenueBookings();
  }, [router, isVenueManager]);

  // Helper to determine if a booking is in the past
  const isPastBooking = (dateFrom: string) => {
    const bookingDate = new Date(dateFrom);
    const today = new Date();
    return bookingDate < today;
  };

  // Get current bookings based on view mode
  const currentBookings = viewMode === 'user' ? bookings : venueBookings;
  const isCurrentLoading = viewMode === 'user' ? isLoading : isVenueBookingsLoading;
  const currentError = viewMode === 'user' ? error : venueBookingsError;

  // Group bookings by status (upcoming/past)
  const upcomingBookings = currentBookings.filter(booking => !isPastBooking(booking.dateFrom));
  const pastBookings = currentBookings.filter(booking => isPastBooking(booking.dateFrom));

  // Calculate statistics
  const totalBookings = currentBookings.length;
  const totalUpcoming = upcomingBookings.length;
  const totalPast = pastBookings.length;
  
  // User booking stats
  const totalSpent = viewMode === 'user' ? calculateTotalSpent(bookings) : 0;
  const totalNights = viewMode === 'user' 
    ? bookings.reduce((total, booking) => total + calculateNights(booking.dateFrom, booking.dateTo), 0)
    : 0;
  
  // Venue manager booking stats
  const totalRevenue = viewMode === 'manager' ? calculateTotalSpent(venueBookings) : 0;
  const totalGuestNights = viewMode === 'manager'
    ? venueBookings.reduce((total, booking) => total + calculateNights(booking.dateFrom, booking.dateTo), 0)
    : 0;
  const totalGuests = viewMode === 'manager'
    ? venueBookings.reduce((total, booking) => total + booking.guests, 0)
    : 0;

  // Get most visited city for user view
  const cityCounts = bookings.reduce((acc, booking) => {
    if (booking.venue?.location && typeof booking.venue.location === 'object' && 'city' in booking.venue.location) {
      const city = String(booking.venue.location.city);
      acc[city] = (acc[city] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const mostVisitedCity = Object.entries(cityCounts).reduce(
    (max, [city, count]) => (count > max.count ? { city, count } : max),
    { city: "None", count: 0 }
  );

  // Get most popular venue for manager view
  const venueCounts = venueBookings.reduce((acc, booking) => {
    if (booking.venue?.name) {
      const venueName = booking.venue.name;
      acc[venueName] = (acc[venueName] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const mostPopularVenue = Object.entries(venueCounts).reduce(
    (max, [venue, count]) => (count > max.count ? { venue, count } : max),
    { venue: "None", count: 0 }
  );

  if (isCurrentLoading) {
    return <div className="text-center py-8">Loading your dashboard...</div>;
  }

  if (currentError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
        <p className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {currentError}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Booking Dashboard</h1>
          <p className="text-gray-500 mt-1">
            {viewMode === 'user' 
              ? 'Overview of your venue bookings and statistics' 
              : 'Manage bookings at venues you own'}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          {isVenueManager && (
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button 
                className={`px-4 py-2 rounded-md flex items-center gap-2 ${viewMode === 'user' 
                  ? 'bg-white shadow-sm text-primary' 
                  : 'text-gray-600'}`}
                onClick={() => setViewMode('user')}
              >
                <LayoutGrid size={18} />
                <span className="hidden sm:inline">My Bookings</span>
              </button>
              <button 
                className={`px-4 py-2 rounded-md flex items-center gap-2 ${viewMode === 'manager' 
                  ? 'bg-white shadow-sm text-primary' 
                  : 'text-gray-600'}`}
                onClick={() => setViewMode('manager')}
              >
                <Briefcase size={18} />
                <span className="hidden sm:inline">Venue Bookings</span>
              </button>
            </div>
          )}
          <Link href={viewMode === 'user' ? "/venues" : "/profile"}>
            <Button variant="primary">
              {viewMode === 'user' ? 'Book New Venue' : 'Manage Venues'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Calendar className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-xl mb-1">{totalBookings}</CardTitle>
            <CardDescription>Total Bookings</CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <CalendarClock className="h-8 w-8 text-blue-500 mb-2" />
            <CardTitle className="text-xl mb-1">{totalUpcoming}</CardTitle>
            <CardDescription>Upcoming {viewMode === 'user' ? 'Stays' : 'Bookings'}</CardDescription>
          </CardContent>
        </Card>
        
        {viewMode === 'user' ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <CreditCard className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle className="text-xl mb-1">${totalSpent.toFixed(2)}</CardTitle>
              <CardDescription>Total Spent</CardDescription>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <CreditCard className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle className="text-xl mb-1">${totalRevenue.toFixed(2)}</CardTitle>
              <CardDescription>Total Revenue</CardDescription>
            </CardContent>
          </Card>
        )}
        
        {viewMode === 'user' ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Activity className="h-8 w-8 text-purple-500 mb-2" />
              <CardTitle className="text-xl mb-1">{totalNights}</CardTitle>
              <CardDescription>Total Nights</CardDescription>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Users className="h-8 w-8 text-purple-500 mb-2" />
              <CardTitle className="text-xl mb-1">{totalGuests}</CardTitle>
              <CardDescription>Total Guests</CardDescription>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Booking Timeline</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
                <span className="text-2xl font-bold text-blue-600">{totalPast}</span>
                <span className="text-sm text-gray-500">Past {viewMode === 'user' ? 'Stays' : 'Bookings'}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg">
                <span className="text-2xl font-bold text-green-600">{totalUpcoming}</span>
                <span className="text-sm text-gray-500">Upcoming {viewMode === 'user' ? 'Stays' : 'Bookings'}</span>
              </div>
            </div>
            {currentBookings.length > 0 && (
              <p className="text-sm text-gray-600">
                Next booking: {upcomingBookings.length > 0 
                  ? formatDate(upcomingBookings[0].dateFrom) 
                  : "No upcoming bookings"}
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{viewMode === 'user' ? 'Travel Insights' : 'Venue Insights'}</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {viewMode === 'user' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Most visited city:</span>
                  <span className="font-medium">{mostVisitedCity.city} ({mostVisitedCity.count} times)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average stay duration:</span>
                  <span className="font-medium">
                    {totalBookings > 0 ? (totalNights / totalBookings).toFixed(1) : 0} nights
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average cost per night:</span>
                  <span className="font-medium">
                    ${totalNights > 0 ? (totalSpent / totalNights).toFixed(2) : 0}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Most popular venue:</span>
                  <span className="font-medium">{mostPopularVenue.venue} ({mostPopularVenue.count} bookings)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average booking length:</span>
                  <span className="font-medium">
                    {totalBookings > 0 ? (totalGuestNights / totalBookings).toFixed(1) : 0} nights
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average guests per booking:</span>
                  <span className="font-medium">
                    {totalBookings > 0 ? (totalGuests / totalBookings).toFixed(1) : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average revenue per booking:</span>
                  <span className="font-medium">
                    ${totalBookings > 0 ? (totalRevenue / totalBookings).toFixed(2) : 0}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            {viewMode === 'user' ? 'Recent Bookings' : 'Recent Venue Bookings'}
          </CardTitle>
          <CardDescription>
            {viewMode === 'user' 
              ? 'Your most recent bookings across all venues' 
              : 'Recent bookings at venues you manage'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentBookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                {viewMode === 'user'
                  ? "You haven't made any bookings yet."
                  : "Your venues don't have any bookings yet."}
              </p>
              {viewMode === 'user' ? (
                <Link href="/venues">
                  <Button variant="primary">Find Venues to Book</Button>
                </Link>
              ) : (
                <Link href="/venues/register">
                  <Button variant="primary">Register a New Venue</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {currentBookings.slice(0, 5).map((booking) => {
                // Helper function to safely access venue location
                const getLocationText = () => {
                  if (booking.venue?.location && typeof booking.venue.location === 'object') {
                    const location = booking.venue.location as { city?: string; country?: string };
                    const city = location.city || 'Unknown city';
                    const country = location.country || 'Unknown country';
                    return `${city}, ${country}`;
                  }
                  return 'Location not available';
                };

                // Calculate booking details
                const nights = calculateNights(booking.dateFrom, booking.dateTo);
                const price = booking.venue?.price || 0;
                const totalPrice = (price * nights).toFixed(2);
                
                // Get image URL if available
                const imageUrl = booking.venue?.media && 
                                Array.isArray(booking.venue.media) && 
                                booking.venue.media.length > 0 && 
                                booking.venue.media[0]?.url;
                
                return (
                  <div key={booking.id} className="border rounded-lg overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      {/* Venue Image */}
                      <div className="w-full sm:w-1/4 h-40 sm:h-auto relative">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={booking.venue?.name || "Venue"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 25vw"
                            onError={(e) => {
                              // Replace with fallback
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                const fallback = document.createElement('div');
                                fallback.className = 'w-full h-full bg-gray-200 flex items-center justify-center';
                                fallback.innerHTML = '<p class="text-gray-500">Image not available</p>';
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <p className="text-gray-500">No image</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Booking Details */}
                      <div className="p-4 sm:p-6 flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold">
                            {booking.venueId ? (
                              <Link href={`/venues/${booking.venueId}`} className="hover:underline">
                                {booking.venue?.name || "Unknown Venue"}
                              </Link>
                            ) : (
                              <span>{booking.venue?.name || "Unknown Venue"}</span>
                            )}
                          </h3>
                          
                          {viewMode === 'manager' && booking.customer && (
                            <div className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                              Booked by: {booking.customer.name}
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                            <span>{getLocationText()}</span>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <CreditCard className="h-4 w-4 mr-2" />
                            <span>
                              ${price} per night × {nights} nights
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center border-t pt-4">
                          <div>
                            <span className="text-sm font-medium">
                              Total: ${totalPrice}
                            </span>
                            <span className="text-xs text-gray-500 block mt-1">
                              Created: {formatDate(booking.created)}
                            </span>
                          </div>
                          {booking.venueId && (
                            <Link href={`/venues/${booking.venueId}`}>
                              <Button variant="outline" size="sm">View Venue</Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {currentBookings.length > 5 && (
                <div className="text-center mt-4">
                  <Button variant="outline" onClick={() => alert('This feature is not yet implemented')}>
                    View All {viewMode === 'user' ? 'Your Bookings' : 'Venue Bookings'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Action Buttons */}
      <div className="flex justify-center mt-8">
        <Link href="/profile">
          <Button variant="secondary" className="mx-2">Back to Profile</Button>
        </Link>
        {viewMode === 'user' ? (
          <Link href="/venues">
            <Button variant="primary" className="mx-2">Explore Venues</Button>
          </Link>
        ) : (
          <Link href="/venues/register">
            <Button variant="primary" className="mx-2">Add New Venue</Button>
          </Link>
        )}
      </div>
    </div>
  );
} 