/**
 * Displays the description for a venue.
 * @param description - The venue description
 */
export function VenueDescription({ description }: { description?: string }) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">About this venue</h2>
      <p className="text-muted-foreground">{description || "No description available."}</p>
    </div>
  );
} 