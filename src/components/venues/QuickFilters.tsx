import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const popularCountries = [
  "Norway",
  "Sweden",
  "Denmark",
  "Finland",
  "Iceland",
];

interface QuickFilterProps {
  onFilterApplied?: () => void;
}

export function QuickFilters({ onFilterApplied }: QuickFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const applyCountryFilter = (country: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("country", country);
    params.delete("page");
    router.push(`/venues?${params.toString()}`);
    setActiveFilter(country);
    if (onFilterApplied) onFilterApplied();
  };

  const applySpecialFilter = (filterType: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    
    // Reset any existing special filters
    params.delete("sort");
    params.delete("sortOrder");
    params.delete("maxPrice");
    params.delete("page");
    
    if (filterType === "budget") {
      params.set("sort", "price");
      params.set("sortOrder", "asc");
      params.set("maxPrice", "100"); // Set a reasonable budget threshold
    } else if (filterType === "top-rated") {
      params.set("sort", "rating");
      params.set("sortOrder", "desc");
    }
    
    router.push(`/venues?${params.toString()}`);
    setActiveFilter(filterType);
    if (onFilterApplied) onFilterApplied();
  };

  const clearFilters = () => {
    router.push("/venues");
    setActiveFilter(null);
    if (onFilterApplied) onFilterApplied();
  };

  const activeCountry = searchParams.get("country");
  const activeSort = searchParams.get("sort");
  const activeSortOrder = searchParams.get("sortOrder");
  const activeMaxPrice = searchParams.get("maxPrice");

  // Determine if we have active budget filter
  const hasBudgetFilter = activeSort === "price" && activeSortOrder === "asc" && activeMaxPrice === "100";
  // Determine if we have active top-rated filter
  const hasTopRatedFilter = activeSort === "rating" && activeSortOrder === "desc";

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
                className={`px-3 py-1 cursor-pointer ${
                  activeCountry === country 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "hover:bg-muted"
                }`}
                onClick={() => applyCountryFilter(country)}
              >
                {country}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-medium mb-2">Special Filters</h2>
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={hasBudgetFilter ? "default" : "outline"}
              className={`px-3 py-1 cursor-pointer ${
                hasBudgetFilter 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "hover:bg-muted"
              }`}
              onClick={() => applySpecialFilter("budget")}
            >
              Budget-friendly
            </Badge>
            <Badge 
              variant={hasTopRatedFilter ? "default" : "outline"}
              className={`px-3 py-1 cursor-pointer ${
                hasTopRatedFilter 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "hover:bg-muted"
              }`}
              onClick={() => applySpecialFilter("top-rated")}
            >
              Top-rated
            </Badge>
            
            {(activeCountry || hasBudgetFilter || hasTopRatedFilter) && (
              <Button 
                variant="ghost" 
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