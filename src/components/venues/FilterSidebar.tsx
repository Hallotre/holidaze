import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FilterValues = {
  country: string;
  price: [number, number];
  amenities: {
    wifi: boolean;
    parking: boolean;
    breakfast: boolean;
    pets: boolean;
  };
  rating: number | null;
};

interface FilterSidebarProps {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  countryOptions: string[];
  minPrice?: number;
  maxPrice?: number;
  className?: string;
}

export function FilterSidebar({
  values,
  onChange,
  countryOptions,
  minPrice = 0,
  maxPrice = 1000,
  className,
}: FilterSidebarProps) {
  // Handlers
  const handleAmenityChange = (key: keyof FilterValues["amenities"]) => (checked: boolean) => {
    onChange({
      ...values,
      amenities: { ...values.amenities, [key]: checked },
    });
  };
  const handleCountryChange = (country: string) => {
    onChange({ ...values, country });
  };
  const handlePriceChange = (price: [number, number]) => {
    onChange({ ...values, price });
  };
  const handleRatingChange = (rating: string) => {
    onChange({ ...values, rating: rating === "any" ? null : Number(rating) });
  };

  return (
    <aside className={cn("w-full max-w-xs p-6 bg-white border rounded-xl shadow-sm space-y-8", className)}>
      <div>
        <Label htmlFor="country-select" className="mb-2 block">Country</Label>
        <Select value={values.country} onValueChange={handleCountryChange}>
          <SelectTrigger id="country-select" className="w-full">
            <SelectValue placeholder="All countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All countries</SelectItem>
            {countryOptions.map((country) => (
              <SelectItem key={country} value={country}>{country}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 block">Price range (${values.price[0]} - ${values.price[1]})</Label>
        <Slider
          min={minPrice}
          max={maxPrice}
          step={10}
          value={values.price}
          onValueChange={(val) => handlePriceChange(val as [number, number])}
          className="mt-2"
        />
      </div>

      <div>
        <Label className="mb-2 block">Amenities</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox checked={values.amenities.wifi} onCheckedChange={handleAmenityChange("wifi")} id="wifi" />
            <Label htmlFor="wifi">WiFi</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={values.amenities.parking} onCheckedChange={handleAmenityChange("parking")} id="parking" />
            <Label htmlFor="parking">Parking</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={values.amenities.breakfast} onCheckedChange={handleAmenityChange("breakfast")} id="breakfast" />
            <Label htmlFor="breakfast">Breakfast</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={values.amenities.pets} onCheckedChange={handleAmenityChange("pets")} id="pets" />
            <Label htmlFor="pets">Pets Allowed</Label>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="rating-select" className="mb-2 block">Minimum Rating</Label>
        <Select value={values.rating?.toString() || "any"} onValueChange={handleRatingChange}>
          <SelectTrigger id="rating-select" className="w-full">
            <SelectValue placeholder="Any rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any rating</SelectItem>
            {[5, 4, 3, 2, 1].map((r) => (
              <SelectItem key={r} value={r.toString()}>{r}+</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" className="w-full" onClick={() => onChange({
        country: "all",
        price: [minPrice, maxPrice],
        amenities: { wifi: false, parking: false, breakfast: false, pets: false },
        rating: null,
      })}>
        Reset Filters
      </Button>
    </aside>
  );
} 