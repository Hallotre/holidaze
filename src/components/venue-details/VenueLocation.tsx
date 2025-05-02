import { Location } from "@/types/venue";

/**
 * Displays the location for a venue.
 * @param location - Location object
 */
export function VenueLocation({ location }: { location?: Location }) {
  if (!location) return null;
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Location</h2>
      <div className="p-4 border rounded-lg">
        <p>{location.address || "Address not provided"}</p>
        <p>
          {location.city || ""}
          {location.zip ? `, ${location.zip}` : ""}
          {location.country ? `, ${location.country}` : ""}
        </p>
      </div>
    </div>
  );
} 