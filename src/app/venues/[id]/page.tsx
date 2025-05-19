"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { venueService } from "@/lib/api";
import { Venue } from "@/types/venue";
import {
  MapPin,
  Star,
  ArrowLeft,
} from "lucide-react";
import { VenueImages } from "@/components/venue-details/VenueImages";
import { VenueDescription } from "@/components/venue-details/VenueDescription";
import { VenueAmenities } from "@/components/venue-details/VenueAmenities";
import { VenueLocation } from "@/components/venue-details/VenueLocation";
import { VenueBookingCard } from "@/components/venue-details/VenueBookingCard";
import { VenueHostInfo } from "@/components/venue-details/VenueHostInfo";

export default function VenueDetailPage() {
  const params = useParams();
  const venueId = Array.isArray(params.id)
    ? params.id[0]
    : (params.id as string);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (venueId) {
      venueService
        .getVenueById(venueId)
        .then((data) => {
          setVenue(data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("VenueDetailPage: API error:", err);
          setError("Failed to load venue details: " + (err?.message || err?.toString() || "Unknown error"));
          setLoading(false);
        });
    } else {
      setError("No venue ID found in URL params.");
      setLoading(false);
    }
  }, [venueId]);
  if (loading)
    return (
      <div className="container mx-auto py-8 text-center">
        Loading venue details...<br />
      </div>
    );
  if (error || !venue)
    return (
      <div className="container mx-auto py-8 text-center text-red-500">
        {error || "Venue not found"}
        <br />
        <span className="text-xs text-muted-foreground">venueId: {venueId?.toString() || "(none)"}</span>
      </div>
    );
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Back button */}
      <Link
        href="/venues"
        className="flex items-center text-primary mb-6 hover:underline"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to all venues
      </Link>

      {/* Venue header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          {venue.name || "Venue"}
        </h1>
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <MapPin size={18} />
          <span>
            {venue.location?.city || "N/A"}, {venue.location?.country || "N/A"}
          </span>
          <div className="flex items-center ml-4">
            <Star size={18} className="text-yellow-400" />
            <span className="ml-1">{venue.rating || "0"} rating</span>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Images and details */}
        <div className="lg:col-span-2">
          <VenueImages media={venue.media} venueName={venue.name} />
          <VenueDescription description={venue.description} />
          <VenueAmenities meta={venue.meta} />
          <VenueLocation location={venue.location} />
        </div>
        {/* Right column - Booking card */}
        <div>
          <VenueBookingCard price={venue.price} rating={venue.rating} maxGuests={venue.maxGuests} currency="$" />
        </div>
      </div>
      {/* Host information */}
      <VenueHostInfo owner={venue.owner} />
    </div>
  );
}
