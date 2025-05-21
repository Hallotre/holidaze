"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { DateRange } from "react-day-picker";
import { PaymentForm } from "@/components/payment/PaymentForm";
import { venueService, bookingService } from "@/lib/api";
import { getLocalUser } from "@/lib/get-local-user";
import { Venue } from "@/types/venue";
import { BookingCreate } from "@/types/booking";

export default function PaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [bookingDetails, setBookingDetails] = useState<{
    venueId: string;
    dateFrom: string;
    dateTo: string;
    guests: number;
  } | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [nights, setNights] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [creatingBooking, setCreatingBooking] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = getLocalUser();
    if (!user) {
      router.replace("/login");
      return;
    }

    // Get booking details from session storage
    const bookingIntent = sessionStorage.getItem("bookingIntent");
    if (!bookingIntent) {
      setError("No booking details found. Please start a new booking.");
      setLoading(false);
      return;
    }

    try {
      const details = JSON.parse(bookingIntent);
      setBookingDetails(details);

      // Set date range for payment form
      if (details.dateFrom && details.dateTo) {
        const from = new Date(details.dateFrom);
        const to = new Date(details.dateTo);
        setDateRange({ from, to });

        // Calculate number of nights
        const diffTime = Math.abs(to.getTime() - from.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setNights(diffDays > 0 ? diffDays : 1);
      }

      // Fetch venue details
      venueService
        .getVenueById(details.venueId)
        .then((data) => {
          setVenue(data.data);
          
          // Calculate total price
          if (data.data.price) {
            const price = data.data.price;
            setTotalPrice(price * (nights > 0 ? nights : 1));
          }
          
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching venue:", err);
          setError("Failed to load venue details.");
          setLoading(false);
        });
    } catch (err) {
      console.error("Error parsing booking intent:", err);
      setError("Invalid booking details. Please start a new booking.");
      setLoading(false);
    }
  }, [router, nights]);

  // Handle back button click
  const handleBack = () => {
    if (venue) {
      router.push(`/venues/${venue.id}`);
    } else {
      router.push("/venues");
    }
  };

  // Handle payment completion
  const handlePaymentComplete = async () => {
    if (!bookingDetails) {
      setError("Booking details not found");
      return;
    }

    try {
      setCreatingBooking(true);

      // Create the actual booking in the API
      const bookingData: BookingCreate = {
        dateFrom: bookingDetails.dateFrom,
        dateTo: bookingDetails.dateTo,
        guests: bookingDetails.guests,
        venueId: bookingDetails.venueId
      };

      // Submit booking to API
      const response = await bookingService.createBooking(bookingData);
      
      // Verify booking was created successfully
      if (!response.data || !response.data.id) {
        throw new Error("Booking creation failed - no booking ID returned");
      }

      // Clear booking intent from session storage
      sessionStorage.removeItem("bookingIntent");
      
      // Store booking success message for the profile page
      sessionStorage.setItem("bookingSuccess", JSON.stringify({
        message: "Your booking was successfully created!",
        id: response.data.id,
        venueId: bookingDetails.venueId,
        venueName: venue?.name || "Venue"
      }));
      
      // Redirect to profile page
      router.push("/profile");
    } catch (error) {
      console.error("Error creating booking:", error);
      
      // Handle different error types
      let errorMessage = "Failed to create booking. Please try again.";
      
      if (error instanceof Error) {
        // Network errors, API errors
        if (error.message.includes("401") || error.message.includes("auth")) {
          errorMessage = "Authentication failed. Please log in again and try again.";
        } else if (error.message.includes("403")) {
          errorMessage = "You don't have permission to create this booking.";
        } else if (error.message.includes("404")) {
          errorMessage = "The venue couldn't be found. It may have been removed.";
        } else if (error.message.includes("409") || error.message.includes("conflict")) {
          errorMessage = "This venue is already booked for the selected dates.";
        } else if (error.message.includes("429")) {
          errorMessage = "Too many requests. Please wait a moment and try again.";
        } else if (error.message.includes("500")) {
          errorMessage = "Server error. Please try again later.";
        }
      }
      
      setError(errorMessage);
      setCreatingBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-20 text-center">
        <Loader2 className="animate-spin h-8 w-8 mx-auto text-pink-600 mb-4" />
        <p>Loading payment details...</p>
      </div>
    );
  }

  if (creatingBooking) {
    return (
      <div className="container mx-auto py-20 text-center">
        <Loader2 className="animate-spin h-8 w-8 mx-auto text-pink-600 mb-4" />
        <p>Creating your booking...</p>
      </div>
    );
  }

  if (error || !venue || !bookingDetails || !dateRange?.from || !dateRange?.to) {
    return (
      <div className="container mx-auto py-20 text-center">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="mb-6">{error || "Something went wrong with your booking. Please try again."}</p>
          <button
            onClick={() => router.push("/venues")}
            className="text-pink-600 hover:underline"
          >
            Browse venues
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <PaymentForm
        venueId={venue.id}
        venueName={venue.name}
        dateRange={dateRange}
        guests={bookingDetails.guests}
        nights={nights}
        totalPrice={totalPrice}
        currency="$"
        onBack={handleBack}
        onComplete={handlePaymentComplete}
      />
    </div>
  );
} 