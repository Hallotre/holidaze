import { Star } from "lucide-react";
import { useState } from "react";

/**
 * Booking card for a venue, including price, rating, and booking form.
 * @param price - Price per night
 * @param rating - Venue rating
 * @param maxGuests - Maximum number of guests
 * @param currency - Currency string
 */
export function VenueBookingCard({ price, rating, maxGuests, currency = "$" }: { price: number; rating?: number; maxGuests: number; currency?: string }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  // TODO: Add booking logic and validation

  return (
    <div className="border rounded-xl shadow-sm p-6 sticky top-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-2xl font-bold">{currency}{price}</span>
          <span className="text-muted-foreground"> / night</span>
        </div>
        <div className="flex items-center">
          <Star className="text-yellow-400 mr-1" size={16} />
          <span>{rating ?? "0"}</span>
        </div>
      </div>
      <div className="border-t border-b py-4 my-4">
        <div className="mb-4">
          <label htmlFor="check-in" className="block text-sm font-medium mb-1">Check in</label>
          <input
            id="check-in"
            type="date"
            className="w-full p-2 border rounded-md"
            min={new Date().toISOString().split("T")[0]}
            value={checkIn}
            onChange={e => setCheckIn(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="check-out" className="block text-sm font-medium mb-1">Check out</label>
          <input
            id="check-out"
            type="date"
            className="w-full p-2 border rounded-md"
            min={checkIn || new Date(Date.now() + 86400000).toISOString().split("T")[0]}
            value={checkOut}
            onChange={e => setCheckOut(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="guests" className="block text-sm font-medium mb-1">Guests</label>
          <select
            id="guests"
            className="w-full p-2 border rounded-md"
            value={guests}
            onChange={e => setGuests(Number(e.target.value))}
          >
            {[...Array(maxGuests)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1} {i === 0 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-between mb-2">
        <span>{currency}{price} × 1 night</span>
        <span>{currency}{price}</span>
      </div>
      <div className="flex justify-between font-bold mb-6">
        <span>Total</span>
        <span>{currency}{price}</span>
      </div>
      <button
        className="w-full bg-primary text-primary-foreground py-3 rounded-md hover:bg-primary/90 transition-colors"
        onClick={() => alert("Booking functionality will be implemented soon!")}
      >
        Book Now
      </button>
      <p className="text-center text-sm text-muted-foreground mt-4">
        You won&apos;t be charged yet
      </p>
    </div>
  );
} 