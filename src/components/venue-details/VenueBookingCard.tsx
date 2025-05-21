import { Star, Users, Clock, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { getLocalUser } from "@/lib/get-local-user";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";

/**
 * Booking card for a venue, including price, rating, and booking form.
 * @param price - Price per night
 * @param rating - Venue rating
 * @param maxGuests - Maximum number of guests
 * @param currency - Currency string
 * @param venueId - The ID of the venue
 */
export function VenueBookingCard({ 
  price, 
  rating, 
  maxGuests, 
  currency = "$",
  venueId
}: { 
  price: number; 
  rating?: number; 
  maxGuests: number; 
  currency?: string;
  venueId: string;
}) {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate total price based on number of nights
  const [totalPrice, setTotalPrice] = useState(price);
  const [nights, setNights] = useState(1);

  // Calculate number of nights and total price when dates change
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      const start = dateRange.from;
      const end = dateRange.to;
      
      // Calculate difference in days
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        setNights(diffDays);
        setTotalPrice(price * diffDays);
      } else {
        setNights(1);
        setTotalPrice(price);
      }
    } else {
      setNights(1);
      setTotalPrice(price);
    }
  }, [dateRange, price]);

  // Booking schema validation
  const bookingSchema = z.object({
    dateFrom: z.string().min(1, "Check-in date is required"),
    dateTo: z.string().min(1, "Check-out date is required"),
    guests: z.number().min(1, "At least 1 guest is required").max(maxGuests, `Maximum ${maxGuests} guests allowed`),
    venueId: z.string().min(1, "Venue ID is required"),
  }).refine((data) => {
    const start = new Date(data.dateFrom);
    const end = new Date(data.dateTo);
    return end > start;
  }, {
    message: "Check-out date must be after check-in date",
    path: ["dateTo"],
  });

  const handleProceedToPayment = async () => {
    setError(null);
    
    if (!dateRange?.from || !dateRange?.to) {
      setError("Please select check-in and check-out dates");
      return;
    }
    
    // Format dates to ISO string
    const checkIn = format(dateRange.from, "yyyy-MM-dd");
    const checkOut = format(dateRange.to, "yyyy-MM-dd");
    
    // Check if user is logged in
    const user = getLocalUser();
    if (!user) {
      setError("You must be logged in to book a venue");
      // Store booking intent in sessionStorage for after login
      sessionStorage.setItem("bookingIntent", JSON.stringify({ 
        venueId, 
        dateFrom: checkIn, 
        dateTo: checkOut, 
        guests 
      }));
      
      // Redirect to login page
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      return;
    }
    
    // Validate booking data
    try {
      const bookingData = {
        dateFrom: checkIn,
        dateTo: checkOut,
        guests,
        venueId
      };
      
      // Validate with zod
      bookingSchema.parse(bookingData);
      
      // Store booking intent in sessionStorage
      sessionStorage.setItem("bookingIntent", JSON.stringify(bookingData));
      
      // Redirect to payment page
      setIsSubmitting(true);
      router.push("/payment");
      
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to process booking. Please try again.");
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border rounded-xl shadow-md p-6 sticky top-8 bg-white">
      {/* Header with price and rating */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="text-2xl font-bold">{currency}{price}</span>
            <span className="text-gray-500 ml-1">/ night</span>
          </div>
          {nights > 1 && (
            <span className="text-sm text-gray-500 mt-1">
              Total: {currency}{totalPrice} for {nights} nights
            </span>
          )}
        </div>
        <div className="bg-pink-50 py-1 px-3 rounded-full flex items-center">
          <Star className="text-pink-500 mr-1" size={16} />
          <span className="font-medium">{rating ?? "New"}</span>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm animate-in fade-in">
          <p className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </p>
        </div>
      )}
      
      {/* Booking form */}
      <div className="rounded-lg border bg-card p-5 mb-6">
        <div className="space-y-5">
          {/* Date selection */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Select dates</label>
            <DateRangePicker 
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              disabled={isSubmitting}
            />
          </div>
          
          {/* Guests selection */}
          <div>
            <label htmlFor="guests" className="block text-sm font-medium mb-2 text-gray-700">
              <span className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-gray-500" />
                Guests
              </span>
            </label>
            <select
              id="guests"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={guests}
              onChange={e => setGuests(Number(e.target.value))}
              disabled={isSubmitting}
            >
              {[...Array(maxGuests)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1} {i === 0 ? "guest" : "guests"}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">This venue can accommodate up to {maxGuests} guests</p>
          </div>
        </div>
      </div>
      
      {/* Trip details summary */}
      {dateRange?.from && dateRange?.to && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Clock className="mr-2 h-4 w-4 text-gray-500" />
            Trip details
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Dates</span>
              <span className="font-medium">
                {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Guests</span>
              <span className="font-medium">{guests} {guests === 1 ? "guest" : "guests"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Duration</span>
              <span className="font-medium">{nights} {nights === 1 ? "night" : "nights"}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Price breakdown */}
      <div className="border-t pt-4 mb-4">
        <div className="flex justify-between mb-3">
          <span>{currency}{price} × {nights} {nights === 1 ? "night" : "nights"}</span>
          <span>{currency}{totalPrice}</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{currency}{totalPrice}</span>
        </div>
      </div>
      
      {/* Proceed to Payment button */}
      <Button
        className="w-full py-6 text-base"
        onClick={handleProceedToPayment}
        disabled={isSubmitting || !dateRange?.from || !dateRange?.to}
      >
        {isSubmitting ? (
          <>
            <span className="mr-2">Processing...</span>
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          </>
        ) : (
          "Continue to Payment"
        )}
      </Button>
      
      <p className="text-center text-sm text-gray-500 mt-4">
        You won&apos;t be charged yet
      </p>
    </div>
  );
} 