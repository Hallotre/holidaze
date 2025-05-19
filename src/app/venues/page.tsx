"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { venueService } from "@/lib/api";
import { Venue } from "@/types/venue";
import VenueCard from "@/components/venues/VenueCard";
import { Loader2 } from "lucide-react";
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
        const sort = searchParams.get("sort") || "created"; // Default to sorting by created date
        const sortOrder = searchParams.get("sortOrder") as "asc" | "desc" | undefined || "desc"; // Default to descending order
        const query = searchParams.get("q");
        
        // Get all filters up front for better organization
        const country = searchParams.get("country");
        const maxPriceStr = searchParams.get("maxPrice");
        const wifi = searchParams.get("wifi") === "true";
        const parking = searchParams.get("parking") === "true";
        const breakfast = searchParams.get("breakfast") === "true";
        const pets = searchParams.get("pets") === "true";
        
        // Track if any filter is active
        const hasActiveFilters = !!(country || maxPriceStr || wifi || parking || breakfast || pets);

        let venuesFromApi: Venue[] = [];
        let totalCount = 0;

        if (query) {
          // searchVenues doesn't support sorting or pagination in the current api.ts
          // It's assumed to return all venues matching the query.
          const response = await venueService.searchVenues(query);
          venuesFromApi = response.data; // Assuming response.data is Venue[]
          totalCount = venuesFromApi.length;
          
          // Apply any additional filters when search is active
          if (hasActiveFilters) {
            venuesFromApi = applyClientFilters(venuesFromApi, {
              country, maxPriceStr, wifi, parking, breakfast, pets
            });
            totalCount = venuesFromApi.length;
          }
        } else {
          // For API-supported filters, we'll use the server-side filtering
          // For this example, we're using pagination directly from the API
          const response = await venueService.getVenues({ 
            sort, 
            sortOrder,
            limit, // Use the page limit for server-side pagination
            page: currentPage // Use current page for pagination
          });
          
          venuesFromApi = response.data;
          
          // Set total count from API metadata for pagination
          if (response.meta && typeof response.meta.totalCount === 'number') {
            totalCount = response.meta.totalCount;
          } else {
            totalCount = venuesFromApi.length;
          }
          
          // Apply any client-side filters that the API doesn't support
          if (hasActiveFilters) {
            venuesFromApi = applyClientFilters(venuesFromApi, {
              country, maxPriceStr, wifi, parking, breakfast, pets
            });
            // Client-side filtering adjusts the total count
            totalCount = hasActiveFilters ? venuesFromApi.length : totalCount;
          }
        }

        setTotal(totalCount);
        setVenues(venuesFromApi);
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

  // Helper function to apply client-side filters
  function applyClientFilters(venues: Venue[], filters: {
    country?: string | null;
    maxPriceStr?: string | null;
    wifi?: boolean;
    parking?: boolean;
    breakfast?: boolean;
    pets?: boolean;
  }) {
    let filtered = [...venues];
    
    if (filters.country) {
      filtered = filtered.filter((venue) => 
        venue.location?.country?.toLowerCase() === filters.country?.toLowerCase()
      );
    }
    
    if (filters.maxPriceStr) {
      const maxPrice = Number(filters.maxPriceStr);
      if (!isNaN(maxPrice)) {
        filtered = filtered.filter((venue) => venue.price <= maxPrice);
      }
    }
    
    if (filters.wifi) {
      filtered = filtered.filter((venue) => venue.meta?.wifi);
    }
    
    if (filters.parking) {
      filtered = filtered.filter((venue) => venue.meta?.parking);
    }
    
    if (filters.breakfast) {
      filtered = filtered.filter((venue) => venue.meta?.breakfast);
    }
    
    if (filters.pets) {
      filtered = filtered.filter((venue) => venue.meta?.pets);
    }
    
    return filtered;
  }

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
          
          {/* Filter summary - Show which filters are active */}
          {(searchParams.get("wifi") === "true" || 
            searchParams.get("parking") === "true" || 
            searchParams.get("breakfast") === "true" || 
            searchParams.get("pets") === "true") && (
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-sm font-medium">Active filters:</span>
              {searchParams.get("wifi") === "true" && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  WiFi
                </span>
              )}
              {searchParams.get("parking") === "true" && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Parking
                </span>
              )}
              {searchParams.get("breakfast") === "true" && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Breakfast
                </span>
              )}
              {searchParams.get("pets") === "true" && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Pets allowed
                </span>
              )}
            </div>
          )}
          
          {/* Latest venues indicator - show only when no specific sort is in URL params */}
          {(!searchParams.get("sort") || searchParams.get("sort") === "created") && 
           (!searchParams.get("sortOrder") || searchParams.get("sortOrder") === "desc") && 
           !searchParams.get("q") && !searchParams.get("country") && !searchParams.get("maxPrice") && (
            <p className="text-lg mb-6">
              Latest venues
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
