import Image from "next/image";
import { Media } from "@/types/user";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Displays the main image and gallery for a venue with in-frame navigation.
 * @param media - Array of media objects for the venue
 * @param venueName - Name of the venue for alt text
 */
export function VenueImages({ media, venueName }: { media: Media[]; venueName: string }) {
  const [current, setCurrent] = useState(0);

  if (!media || media.length === 0) {
    return (
      <div className="w-full h-[400px] bg-muted flex items-center justify-center rounded-xl overflow-hidden">
        <span className="text-muted-foreground">No image available</span>
      </div>
    );
  }

  const prevImage = () => {
    setCurrent((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };
  const nextImage = () => {
    setCurrent((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  return (
    <div>
      <div className="relative rounded-xl overflow-hidden h-[400px] mb-4 flex items-center justify-center bg-muted border border-border">
        {media.length > 1 && (
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        <Image
          src={media[current].url}
          alt={media[current].alt || `${venueName} - image ${current + 1}`}
          fill
          className="object-contain rounded-xl bg-black"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
        />
        {media.length > 1 && (
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
      {media.length > 1 && (
        <div className="flex gap-2 mt-2 justify-center">
          {media.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`border-2 ${idx === current ? 'border-primary' : 'border-transparent'} rounded-lg overflow-hidden w-16 h-12 focus:outline-none transition-all ring-1 ring-border ${idx === current ? 'ring-2 ring-primary' : ''}`}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={img.url}
                alt={img.alt || `${venueName} - thumb ${idx + 1}`}
                width={64}
                height={48}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 