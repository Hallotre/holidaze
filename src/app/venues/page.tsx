"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { venueService } from "@/lib/api";
import { Venue } from "@/types/venue";
import VenueCard from "@/components/venues/VenueCard";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { FilterSidebar, FilterValues } from "@/components/venues/FilterSidebar";
import { QuickFilters } from "@/components/venues/QuickFilters";

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]); // Will hold venues for the current page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number | null>(null); // Will hold total after ALL filters
  const searchParams = useSearchParams();
  const router = useRouter();

  // Pagination state
  const pageParam = Number(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(pageParam);
  const limit = 20; // venues per page

  useEffect(() => {
    setCurrentPage(pageParam); // keep state in sync with URL
  }, [pageParam]);

  useEffect(() => {
    async function loadAndFilterVenues() {
      setLoading(true);
      setError(null);
      try {
        const sort = searchParams.get("sort") || undefined; // Ensure undefined if null
        const sortOrder = searchParams.get("sortOrder") as "asc" | "desc" | undefined;
        const query = searchParams.get("q");

        let venuesFromApi: Venue[] = [];

        if (query) {
          // searchVenues doesn't support sorting or pagination in the current api.ts
          // It's assumed to return all venues matching the query.
          const response = await venueService.searchVenues(query);
          venuesFromApi = response.data; // Assuming response.data is Venue[]
        } else {
          // Fetch venues if no search query. API-side sorting is applied here.
          // Changed limit from 1000 to 100 to avoid 400 error.
          const response = await venueService.getVenues({ 
            sort, 
            sortOrder,
            limit: 100, // Fetch up to 100 venues for client-side filtering
            // page: 1 // Defaults to 1 in getVenues if not specified
          });
          venuesFromApi = response.data;
        }

        // Apply all client-side filters
        const country = searchParams.get("country");
        const maxPriceStr = searchParams.get("maxPrice");
        const wifi = searchParams.get("wifi") === "true";
        const parking = searchParams.get("parking") === "true";
        const breakfast = searchParams.get("breakfast") === "true";
        const pets = searchParams.get("pets") === "true";

        let clientFilteredList = venuesFromApi;

        if (country) {
          clientFilteredList = clientFilteredList.filter((venue: Venue) => 
            venue.location?.country?.toLowerCase() === country.toLowerCase()
          );
        }
        
        if (maxPriceStr) {
          const maxPriceNum = Number(maxPriceStr);
          if (!isNaN(maxPriceNum)) {
            clientFilteredList = clientFilteredList.filter((venue: Venue) => 
              venue.price <= maxPriceNum
            );
          }
        }

        if (wifi) {
          clientFilteredList = clientFilteredList.filter((venue: Venue) => venue.meta?.wifi);
        }
        if (parking) {
          clientFilteredList = clientFilteredList.filter((venue: Venue) => venue.meta?.parking);
        }
        if (breakfast) {
          clientFilteredList = clientFilteredList.filter((venue: Venue) => venue.meta?.breakfast);
        }
        if (pets) {
          clientFilteredList = clientFilteredList.filter((venue: Venue) => venue.meta?.pets);
        }
        
        // If there was a search query and client-side sorting is desired (as API search doesn't sort)
        // This is an example if sorting needs to be re-applied client side after search
        // For now, we rely on API sort for non-search, and no sort for search
        // if (query && sort) { ... client side sort logic ... }

        setTotal(clientFilteredList.length); // Total count after all filters

        // Client-side pagination
        const startIndex = (currentPage - 1) * limit;
        const endIndex = startIndex + limit;
        setVenues(clientFilteredList.slice(startIndex, endIndex));
        
        setError(null);
      } catch (err) {
        console.error("Error loading or filtering venues:", err);
        setError("Failed to load venues. Please try again later.");
        setVenues([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }
    loadAndFilterVenues();
  }, [searchParams, currentPage, limit]);

  // Pagination controls
  const totalPages = total ? Math.ceil(total / limit) : null;
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("page", newPage.toString());
    router.push(`/venues?${params.toString()}`);
  };

  // Helper to generate pagination range with ellipsis
  function getPaginationRange(current: number, totalPagesToUse: number, delta = 2) {
    const range: (number | string)[] = [];
    const left = Math.max(2, current - delta);
    const right = Math.min(totalPagesToUse - 1, current + delta);

    range.push(1);
    if (left > 2) range.push('...');
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPagesToUse - 1) range.push('...');
    if (totalPagesToUse > 1) range.push(totalPagesToUse);
    return range;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Explore Venues</h1>
      
      {/* Quick Filters Section */}
      <QuickFilters />
      
      <div className="grid grid-cols-1 gap-8">
        {/* Main Content */}
        <div>
          {/* Search query indicator */}
          {searchParams.get("q") && (
            <p className="text-lg mb-6">
              Search results for <span className="font-semibold">&ldquo;{searchParams.get("q")}&rdquo;</span>
            </p>
          )}
          
          {/* Country filter indicator */}
          {searchParams.get("country") && (
            <p className="text-lg mb-6">
              Venues in <span className="font-semibold">{searchParams.get("country")}</span>
            </p>
          )}
          
          {/* Budget filter indicator */}
          {searchParams.get("maxPrice") && searchParams.get("sort") === "price" && (
            <p className="text-lg mb-6">
              Budget-friendly venues under <span className="font-semibold">${searchParams.get("maxPrice")}</span>
            </p>
          )}
          
          {/* Top-rated filter indicator */}
          {searchParams.get("sort") === "rating" && searchParams.get("sortOrder") === "desc" && (
            <p className="text-lg mb-6">
              Top-rated venues
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
              <p className="text-xl">No venues found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                {venues.map((venue) => (
                  <VenueCard key={venue.id} venue={venue} />
                ))}
              </div>
              {/* Pagination controls */}
              {totalPages && totalPages > 1 && (
                <nav className="flex justify-center items-center gap-2 mt-10" aria-label="Pagination">
                  <button
                    className="px-3 py-1 rounded border bg-muted text-foreground disabled:opacity-50"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    aria-label="Previous page"
                  >
                    Previous
                  </button>
                  {totalPages && getPaginationRange(currentPage, totalPages).map((item, idx) => // Added null check for totalPages
                    typeof item === 'number' ? (
                      <button
                        key={item}
                        className={`px-3 py-1 rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2
                          ${item === currentPage
                            ? 'bg-primary text-gray-900 ring-2 ring-primary/80 ring-offset-2 shadow-md z-10'
                            : 'bg-muted text-foreground hover:bg-primary/10'}
                        `}
                        onClick={() => handlePageChange(item)}
                        aria-current={item === currentPage ? 'page' : undefined}
                        aria-label={`Page ${item}`}
                        disabled={item === currentPage}
                      >
                        {item}
                      </button>
                    ) : (
                      <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground select-none">…</span>
                    )
                  )}
                  <button
                    className="px-3 py-1 rounded border bg-muted text-foreground disabled:opacity-50"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={totalPages ? currentPage >= totalPages : true} // Added null check for totalPages
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
