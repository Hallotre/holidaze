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
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Pagination state
  const pageParam = Number(searchParams.get("page")) || 1;
  const [page, setPage] = useState(pageParam);
  const limit = 20; // venues per page

  useEffect(() => {
    setPage(pageParam); // keep state in sync with URL
  }, [pageParam]);

  useEffect(() => {
    async function fetchVenues() {
      try {
        setLoading(true);
        const sort = searchParams.get("sort");
        const sortOrder = searchParams.get("sortOrder") as "asc" | "desc" | undefined;
        const query = searchParams.get("q");
        const country = searchParams.get("country");
        const maxPrice = searchParams.get("maxPrice");
        
        let filteredVenues: Venue[] = [];
        let totalCount = null;
        
        if (query) {
          const response = await venueService.searchVenues(query);
          filteredVenues = response.data;
          totalCount = response.meta?.totalCount || null;
        } else {
          const response = await venueService.getVenues({
            limit,
            page,
            sort: sort || undefined,
            sortOrder: sortOrder,
          });
          filteredVenues = response.data;
          totalCount = response.meta?.totalCount || null;
        }
        
        // Apply client-side filtering for country if needed
        if (country) {
          filteredVenues = filteredVenues.filter(venue => 
            venue.location?.country?.toLowerCase() === country.toLowerCase()
          );
        }
        
        // Apply client-side filtering for max price if needed
        if (maxPrice) {
          const maxPriceNum = Number(maxPrice);
          if (!isNaN(maxPriceNum)) {
            filteredVenues = filteredVenues.filter(venue => 
              venue.price <= maxPriceNum
            );
          }
        }
        
        setVenues(filteredVenues);
        setTotal(totalCount);
        setError(null);
      } catch (err) {
        console.error("Error fetching venues:", err);
        setError("Failed to load venues. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchVenues();
  }, [searchParams, page]);

  // Pagination controls
  const totalPages = total ? Math.ceil(total / limit) : null;
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("page", newPage.toString());
    router.push(`/venues?${params.toString()}`);
  };

  // Helper to generate pagination range with ellipsis
  function getPaginationRange(current: number, total: number, delta = 2) {
    const range: (number | string)[] = [];
    const left = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);

    range.push(1);
    if (left > 2) range.push('...');
    for (let i = left; i <= right; i++) range.push(i);
    if (right < total - 1) range.push('...');
    if (total > 1) range.push(total);
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
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    aria-label="Previous page"
                  >
                    Previous
                  </button>
                  {getPaginationRange(page, totalPages).map((item, idx) =>
                    typeof item === 'number' ? (
                      <button
                        key={item}
                        className={`px-3 py-1 rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2
                          ${item === page
                            ? 'bg-primary text-gray-900 ring-2 ring-primary/80 ring-offset-2 shadow-md z-10'
                            : 'bg-muted text-foreground hover:bg-primary/10'}
                        `}
                        onClick={() => handlePageChange(item)}
                        aria-current={item === page ? 'page' : undefined}
                        aria-label={`Page ${item}`}
                        disabled={item === page}
                      >
                        {item}
                      </button>
                    ) : (
                      <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground select-none">…</span>
                    )
                  )}
                  <button
                    className="px-3 py-1 rounded border bg-muted text-foreground disabled:opacity-50"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
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
