"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { venueService } from "@/lib/api";
import { Venue } from "@/types/venue";
import VenueCard from "@/components/venues/VenueCard";
import { Loader2 } from "lucide-react";

export default function VenueSearchPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  useEffect(() => {
    async function fetchVenues() {
      if (!query) {
        setVenues([]);
        setLoading(false);
        setError(null);
        return;
      }
      try {
        setLoading(true);
        const response = await venueService.searchVenues(query);
        setVenues(response.data);
        setError(null);
      } catch (err) {
        console.error("Error searching venues:", err);
        setError("Failed to load search results. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchVenues();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Search Venues</h1>
      {query && (
        <p className="text-lg mb-6">
          Search results for <span className="font-semibold">"{query}"</span>
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
          <p className="text-xl">No venues found matching your search.</p>
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