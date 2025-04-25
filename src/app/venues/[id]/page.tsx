"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { venueService } from "@/lib/api";
import { Venue } from "@/types/venue";
import {
  MapPin,
  Wifi,
  Car,
  Utensils,
  PawPrint,
  Star,
  ArrowLeft,
} from "lucide-react";

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
          setVenue(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load venue details");
          setLoading(false);
        });
    }
  }, [venueId]);
  if (loading)
    return (
      <div className="container mx-auto py-8 text-center">
        Loading venue details...
      </div>
    );
  if (error || !venue)
    return (
      <div className="container mx-auto py-8 text-center text-red-500">
        {error || "Venue not found"}
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
        {/* Left column - Images */}
        <div className="lg:col-span-2">
          {/* Main image */}
          <div className="relative rounded-xl overflow-hidden h-[400px] mb-4">
            {venue.media && venue.media.length > 0 ? (
              <Image
                src={venue.media[0].url}
                alt={venue.media[0].alt || venue.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">
                  No image available
                </span>
              </div>
            )}
          </div>

          {/* Image gallery */}
          {venue.media && venue.media.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {venue.media.slice(1, 5).map((image, index) => (
                <div
                  key={index}
                  className="relative h-24 rounded-lg overflow-hidden"
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `${venue.name} - image ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">About this venue</h2>
            <p className="text-muted-foreground">
              {venue.description || "No description available."}
            </p>
          </div>

          {/* Amenities */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {venue.meta?.wifi && (
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <Wifi size={20} className="text-primary" />
                  <span>WiFi</span>
                </div>
              )}
              {venue.meta?.parking && (
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <Car size={20} className="text-primary" />
                  <span>Parking</span>
                </div>
              )}
              {venue.meta?.breakfast && (
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <Utensils size={20} className="text-primary" />
                  <span>Breakfast</span>
                </div>
              )}
              {venue.meta?.pets && (
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <PawPrint size={20} className="text-primary" />
                  <span>Pets Allowed</span>
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Location</h2>
            <div className="p-4 border rounded-lg">
              <p>{venue.location?.address || "Address not provided"}</p>
              <p>
                {venue.location?.city || ""}
                {venue.location?.zip ? `, ${venue.location?.zip}` : ""}
                {venue.location?.country ? `, ${venue.location?.country}` : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Right column - Booking card */}
        <div>
          <div className="border rounded-xl shadow-sm p-6 sticky top-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-2xl font-bold">${venue.price}</span>
                <span className="text-muted-foreground"> / night</span>
              </div>
              <div className="flex items-center">
                <Star className="text-yellow-400 mr-1" size={16} />
                <span>{venue.rating || "0"}</span>
              </div>
            </div>
            <div className="border-t border-b py-4 my-4">
              <div className="mb-4">
                <label
                  htmlFor="check-in"
                  className="block text-sm font-medium mb-1"
                >
                  Check in
                </label>
                <input
                  id="check-in"
                  type="date"
                  className="w-full p-2 border rounded-md"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="check-out"
                  className="block text-sm font-medium mb-1"
                >
                  Check out
                </label>
                <input
                  id="check-out"
                  type="date"
                  className="w-full p-2 border rounded-md"
                  min={
                    new Date(Date.now() + 86400000).toISOString().split("T")[0]
                  }
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="guests"
                  className="block text-sm font-medium mb-1"
                >
                  Guests
                </label>
                <select
                  id="guests"
                  className="w-full p-2 border rounded-md"
                  defaultValue="1"
                >
                  {[...Array(venue.maxGuests)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1} {i === 0 ? "guest" : "guests"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-between mb-2">
              <span>${venue.price} × 1 night</span>
              <span>${venue.price}</span>
            </div>
            <div className="flex justify-between font-bold mb-6">
              <span>Total</span>
              <span>${venue.price}</span>
            </div>
            <button
              className="w-full bg-primary text-primary-foreground py-3 rounded-md hover:bg-primary/90 transition-colors"
              onClick={() =>
                alert("Booking functionality will be implemented soon!")
              }
            >
              Book Now
            </button>{" "}
            <p className="text-center text-sm text-muted-foreground mt-4">
              You won&apos;t be charged yet
            </p>
          </div>
        </div>
      </div>

      {/* Host information */}
      {venue.owner && (
        <div className="mt-8 p-6 border rounded-xl">
          <h2 className="text-xl font-bold mb-4">
            Hosted by {venue.owner.name}
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border">
              {venue.owner.avatar ? (
                <Image
                  src={venue.owner.avatar.url}
                  alt={venue.owner.avatar.alt || venue.owner.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary">
                  {venue.owner.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="text-muted-foreground">
                {venue.owner.bio ||
                  `Contact ${venue.owner.name} for more information about this venue.`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
