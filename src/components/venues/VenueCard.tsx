"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Trophy } from "lucide-react";
import { Venue } from "@/types/venue";

interface VenueCardProps {
  venue: Venue;
}

export default function VenueCard({ venue }: VenueCardProps) {
  // Default placeholder image if no media is available
  const imageUrl =
    venue.media && venue.media.length > 0
      ? venue.media[0].url
      : "https://placehold.co/600x400?text=No+Image";

  const imageAlt =
    venue.media && venue.media.length > 0
      ? venue.media[0].alt
      : `${venue.name} venue image`;

  // Placeholder values for host type and date range
  const hostType = venue.owner?.bio?.toLowerCase().includes("business") ? "Business host" : "Individual host";
  const dateRange = "May 1 – 6"; // Replace with real data if available
  const currency = "NOK"; // Replace with real data if available
  const isGuestFavorite = venue.rating >= 4.9;

  return (
    <Link href={`/venues/${venue.id}`} className="group block">
      <div className="flex flex-col min-h-[360px]">
        {/* Image section */}
        <div className="relative w-full aspect-[6/5] bg-muted rounded-2xl overflow-hidden">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 rounded-2xl"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
            loading="lazy"
            priority={false}
          />
          {/* Guest favorite badge */}
          {isGuestFavorite && (
            <span className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-white/90 text-yellow-600 font-medium px-3 py-1 rounded-full text-xs shadow-sm">
              <Trophy className="h-4 w-4 text-yellow-500" /> Guest favorite
            </span>
          )}
        </div>
        {/* Text section */}
        <div className="flex flex-col gap-0.5 px-1.5 pt-2 pb-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-lg line-clamp-1 text-foreground">
              {venue.name}
            </span>
            {venue.rating > 0 && (
              <span className="flex items-center gap-1 text-sm text-foreground">
                <Star size={15} className="fill-yellow-500 text-yellow-500" />
                {venue.rating.toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground line-clamp-1">
            {venue.location.city}, {venue.location.country}
          </span>
          <span className="text-xs text-muted-foreground line-clamp-1">
            {venue.description || "Sea views"}
          </span>
          <span className="text-xs text-muted-foreground">
            {dateRange} · {hostType}
          </span>
          <div className="flex items-baseline gap-1 mt-1 whitespace-nowrap">
            <span className="font-bold text-lg text-foreground whitespace-nowrap">
              {venue.price.toLocaleString()} {currency}
            </span>
            <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">night</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
