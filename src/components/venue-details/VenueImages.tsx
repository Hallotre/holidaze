import Image from "next/image";
import { Media } from "@/types/user";

/**
 * Displays the main image and gallery for a venue.
 * @param media - Array of media objects for the venue
 * @param venueName - Name of the venue for alt text
 */
export function VenueImages({ media, venueName }: { media: Media[]; venueName: string }) {
  if (!media || media.length === 0) {
    return (
      <div className="w-full h-[400px] bg-muted flex items-center justify-center rounded-xl overflow-hidden">
        <span className="text-muted-foreground">No image available</span>
      </div>
    );
  }
  return (
    <>
      <div className="relative rounded-xl overflow-hidden h-[400px] mb-4">
        <Image
          src={media[0].url}
          alt={media[0].alt || venueName}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
        />
      </div>
      {media.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {media.slice(1, 5).map((image, index) => (
            <div key={index} className="relative h-24 rounded-lg overflow-hidden">
              <Image
                src={image.url}
                alt={image.alt || `${venueName} - image ${index + 2}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 20vw"
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
} 