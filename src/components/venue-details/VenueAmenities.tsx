import { Wifi, Car, Utensils, PawPrint } from "lucide-react";
import { VenueMeta } from "@/types/venue";

/**
 * Displays the amenities for a venue.
 * @param meta - VenueMeta object
 */
export function VenueAmenities({ meta }: { meta?: VenueMeta }) {
  if (!meta) return null;
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Amenities</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {meta.wifi && (
          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <Wifi size={20} className="text-primary" />
            <span>WiFi</span>
          </div>
        )}
        {meta.parking && (
          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <Car size={20} className="text-primary" />
            <span>Parking</span>
          </div>
        )}
        {meta.breakfast && (
          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <Utensils size={20} className="text-primary" />
            <span>Breakfast</span>
          </div>
        )}
        {meta.pets && (
          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <PawPrint size={20} className="text-primary" />
            <span>Pets Allowed</span>
          </div>
        )}
      </div>
    </div>
  );
} 