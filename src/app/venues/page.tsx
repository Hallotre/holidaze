"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { venueService } from "@/lib/api";
import { Venue } from "@/types/venue";
import VenueCard from "@/components/venues/VenueCard";
import { Loader2 } from "lucide-react";

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    async function fetchVenues() {
      try {
        setLoading(true);

        // Extract filter parameters from URL
        const country = searchParams.get("country");
        const sort = searchParams.get("sort");
        const sortOrder = searchParams.get("sortOrder") as
          | "asc"
          | "desc"
          | undefined;

        // Fetch venues from API
        const response = await venueService.getVenues({
          limit: 50,
          page: 1,
          sort: sort || undefined,
          sortOrder: sortOrder,
        });

        // Apply client-side filtering if country filter is present
        let filteredVenues = response.data;
        if (country) {
          filteredVenues = filteredVenues.filter(
            (venue) =>
              venue.location.country?.toLowerCase() === country.toLowerCase()
          );
        }

        setVenues(filteredVenues);
        setError(null);
      } catch (err) {
        console.error("Error fetching venues:", err);
        setError("Failed to load venues. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchVenues();
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Explore Venues</h1>

      {/* Country filter indicator */}
      {searchParams.get("country") && (
        <p className="text-lg mb-6">
          Showing venues in {searchParams.get("country")}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="py-20 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : venues.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-xl">No venues found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}
    </div>
  );
}
