"use client";

import Image from "next/image";
import Link from "next/link";
import { Wifi, Car, Coffee, PawPrint, Star } from "lucide-react";
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

  return (
    <Link href={`/venues/${venue.id}`} className="group">
      <article className="h-full flex flex-col rounded-lg overflow-hidden border border-border bg-card transition-all hover:shadow-md">
        {/* Image */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {venue.rating > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-full text-sm">
              <Star size={14} className="fill-yellow-500 text-yellow-500" />
              <span>{venue.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold line-clamp-1">{venue.name}</h3>
          </div>

          <p className="text-sm text-muted-foreground mb-2">
            {venue.location.city}, {venue.location.country}
          </p>

          <p className="text-sm line-clamp-2 mb-4 flex-grow">
            {venue.description}
          </p>

          {/* Amenities */}
          <div className="flex gap-3 mb-3">
            {venue.meta.wifi && (
              <Wifi size={16} className="text-muted-foreground" />
            )}
            {venue.meta.parking && (
              <Car size={16} className="text-muted-foreground" />
            )}
            {venue.meta.breakfast && (
              <Coffee size={16} className="text-muted-foreground" />
            )}
            {venue.meta.pets && (
              <PawPrint size={16} className="text-muted-foreground" />
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold">${venue.price}</span>
              <span className="text-muted-foreground text-sm"> / night</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {venue.maxGuests} guest{venue.maxGuests !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
