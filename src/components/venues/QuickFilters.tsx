import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

const popularCountries = [
  "Norway",
  "France",
  "Spain",
  "Italy",
  "Greece",
];

const amenities = [
  { key: "wifi", label: "WiFi" },
  { key: "parking", label: "Parking" },
  { key: "breakfast", label: "Breakfast" },
  { key: "pets", label: "Pets Allowed" },
];

interface QuickFilterProps {
  onFilterApplied?: () => void;
}

export function QuickFilters({ onFilterApplied }: QuickFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<string | null>(null); // This state seems unused and can be removed if not used by other logic.

  const toggleQueryParam = (paramName: string, paramValue: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    const currentValue = params.get(paramName);

    if (currentValue === paramValue) {
      params.delete(paramName);
    } else {
      params.set(paramName, paramValue);
    }

    params.delete("page"); // Reset to page 1 when filters change
    router.push(`/venues?${params.toString()}`);
    if (onFilterApplied) onFilterApplied();
  };

  // toggleCountryFilter can now use toggleQueryParam
  const toggleCountryFilter = (country: string) => {
    toggleQueryParam("country", country);
  };

  // toggleMetaFilter can also use toggleQueryParam
  const toggleMetaFilter = (metaKey: string) => {
    // Meta filters are boolean, so we toggle between "true" and removing the param
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (params.get(metaKey) === "true") {
      params.delete(metaKey);
    } else {
      params.set(metaKey, "true");
    }
    params.delete("page");
    router.push(`/venues?${params.toString()}`);
    if (onFilterApplied) onFilterApplied();
  };

  const toggleSpecialFilter = (filterType: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    const activeSort = params.get("sort");
    const activeSortOrder = params.get("sortOrder");
    const activeMaxPrice = params.get("maxPrice");
    
    // Check if this filter is already active
    const hasBudgetFilter = activeSort === "price" && activeSortOrder === "asc" && activeMaxPrice === "100";
    const hasTopRatedFilter = activeSort === "rating" && activeSortOrder === "desc";
    
    // Clear any existing special filters first
    params.delete("sort");
    params.delete("sortOrder");
    params.delete("maxPrice");
    params.delete("page");
    
    // If the filter wasn't already active, apply it (toggle on)
    // If it was active, we've already cleared it (toggle off)
    if (filterType === "budget" && !hasBudgetFilter) {
      params.set("sort", "price");
      params.set("sortOrder", "asc");
      params.set("maxPrice", "100");
    } else if (filterType === "top-rated" && !hasTopRatedFilter) {
      params.set("sort", "rating");
      params.set("sortOrder", "desc");
    }
    
    router.push(`/venues?${params.toString()}`);
    if (onFilterApplied) onFilterApplied();
  };

  const clearFilters = () => {
    router.push("/venues");
    setActiveFilter(null);
    if (onFilterApplied) onFilterApplied();
  };

  const activeCountry = searchParams.get("country");
  const activeWifi = searchParams.get("wifi") === "true";
  const activeParking = searchParams.get("parking") === "true";
  const activeBreakfast = searchParams.get("breakfast") === "true";
  const activePets = searchParams.get("pets") === "true";

  const activeSort = searchParams.get("sort");
  const activeSortOrder = searchParams.get("sortOrder");
  const activeMaxPrice = searchParams.get("maxPrice");

  // Determine if we have active budget filter
  const hasBudgetFilter = activeSort === "price" && activeSortOrder === "asc" && activeMaxPrice === "100";
  // Determine if we have active top-rated filter
  const hasTopRatedFilter = activeSort === "rating" && activeSortOrder === "desc";

  const hasActiveFilters = activeCountry || hasBudgetFilter || hasTopRatedFilter || activeWifi || activeParking || activeBreakfast || activePets;

  return (
    <div className="mb-8">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-medium mb-2">Popular Destinations</h2>
          <div className="flex flex-wrap gap-2">
            {popularCountries.map((country) => (
              <Badge
                key={country}
                variant={activeCountry === country ? "default" : "outline"}
                className={`px-3 py-1.5 ${
                  activeCountry === country 
                    ? "bg-pink-600 text-white border-pink-600" 
                    : "hover:bg-pink-50 border-pink-300"
                }`}
                onClick={() => toggleCountryFilter(country)}
                role="checkbox"
                aria-checked={activeCountry === country}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCountryFilter(country);
                  }
                }}
              >
                {country}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-2">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity) => (
              <Badge
                key={amenity.key}
                variant={searchParams.get(amenity.key) === "true" ? "default" : "outline"}
                className={`px-3 py-1.5 ${
                  searchParams.get(amenity.key) === "true"
                    ? "bg-pink-600 text-white border-pink-600"
                    : "hover:bg-pink-50 border-pink-300"
                }`}
                onClick={() => toggleMetaFilter(amenity.key)}
                role="checkbox"
                aria-checked={searchParams.get(amenity.key) === "true"}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleMetaFilter(amenity.key);
                  }
                }}
              >
                {amenity.label}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-medium mb-2">Special Filters</h2>
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={hasBudgetFilter ? "default" : "outline"}
              className={`px-3 py-1.5 ${
                hasBudgetFilter 
                  ? "bg-pink-600 text-white border-pink-600" 
                  : "hover:bg-pink-50 border-pink-300"
              }`}
              onClick={() => toggleSpecialFilter("budget")}
              role="checkbox"
              aria-checked={hasBudgetFilter}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleSpecialFilter("budget");
                }
              }}
            >
              Budget-friendly
            </Badge>
            <Badge 
              variant={hasTopRatedFilter ? "default" : "outline"}
              className={`px-3 py-1.5 ${
                hasTopRatedFilter 
                  ? "bg-pink-600 text-white border-pink-600" 
                  : "hover:bg-pink-50 border-pink-300"
              }`}
              onClick={() => toggleSpecialFilter("top-rated")}
              role="checkbox"
              aria-checked={hasTopRatedFilter}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleSpecialFilter("top-rated");
                }
              }}
            >
              Top-rated
            </Badge>
            
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
                className="h-8 text-sm"
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}