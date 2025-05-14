"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useRouter
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { profileService } from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import { getLocalUser } from "@/lib/get-local-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserProfile {
  name: string;
  email: string;
  bio?: string;
  avatar?: { url: string; alt: string };
  banner?: { url: string; alt: string };
  venueManager?: boolean;
}

interface Venue {
  id: string;
  name: string;
  description: string;
  media: { url: string; alt: string }[];
  price: number;
  maxGuests: number;
  rating: number;
  created: string;
  updated: string;
  meta: Record<string, any>;
  location: Record<string, any>;
  owner?: { name: string };
}

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter(); // Initialize useRouter
  const username = Array.isArray(params.username)
    ? params.username[0]
    : (params.username as string);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [venuesLoading, setVenuesLoading] = useState(false);
  const [venuesError, setVenuesError] = useState<string | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    async function checkCurrentUser() {
      const currentUser = getLocalUser();
      if (currentUser && currentUser.name === username) {
        setIsCurrentUser(true);
      }
    }
    checkCurrentUser();
  }, [username]);

  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await profileService.getProfileByName(username);
        setProfile(result.data);
      } catch (err: any) {
        setError(err?.message || "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    }

    if (username) {
      fetchProfile();
    }
  }, [username]);

  useEffect(() => {
    if (!profile) return;
    setVenuesLoading(true);
    setVenuesError(null);

    profileService.getProfileVenues(profile.name)
      .then((result) => {
        setVenues(result.data);
      })
      .catch((err) => {
        setVenuesError(err?.message || "Failed to load venues");
      })
      .finally(() => setVenuesLoading(false));
  }, [profile]);

  if (isLoading) return <div className="text-center mt-10">Loading profile...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;
  if (!profile) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back button */}
      <button // Changed from Link to button
        onClick={() => router.back()} // Use router.back()
        className="flex items-center text-primary mb-6 hover:underline cursor-pointer"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        {/* VENUES SECTION - Left side on larger screens */}
        <div className="w-full md:w-2/3 order-2 md:order-1">
          {/* Card component wrapper removed, header styling adjusted */}
          <div className="flex flex-row items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{profile.name}'s Venues</h2>
          </div>
          {/* CardContent wrapper removed */}
          {venuesLoading ? (
            <div className="text-center py-6">Loading venues...</div>
          ) : venuesError ? (
            <div className="text-center text-red-600 py-6">{venuesError}</div>
          ) : venues.length === 0 ? (
            <div className="text-center text-gray-500 py-6">{profile.name} has not created any venues yet.</div>
          ) : (
            <div className="venues-container pr-2">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {venues.map((venue) => (
                  <Link href={`/venues/${venue.id}`} key={venue.id}>
                    {/* Individual venue cards still use Card and CardContent */}
                    <Card key={venue.id} className="border hover:border-primary transition-colors cursor-pointer h-full">
                      <CardContent className="p-3">
                        <div className="relative w-full h-32 mb-3">
                          {venue.media?.[0]?.url ? (
                            <Image
                              src={venue.media[0].url}
                              alt={venue.media[0].alt || venue.name}
                              fill
                              className="object-cover rounded-md"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 rounded-md">
                              No image
                            </div>
                          )}
                        </div>
                        <h3 className="font-semibold truncate">{venue.name}</h3>
                        <div className="text-sm text-gray-700 line-clamp-2 mt-1">{venue.description}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                          <span>${venue.price}/night</span>
                          <span>•</span>
                          <span>Max Guests: {venue.maxGuests}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PROFILE DETAILS - Right side on larger screens (uses Card, CardHeader, CardTitle, CardContent) */}
        <div className="w-full md:w-1/3 order-1 md:order-2">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              {/* Banner image if available */}
              {profile.banner?.url && (
                <div className="relative w-full h-32 mb-4">
                  <Image
                    src={profile.banner.url}
                    alt="Profile banner"
                    fill
                    className="object-cover rounded-md"
                    sizes="(max-width: 768px) 100vw, 384px"
                  />
                </div>
              )}
              
              {/* Avatar image if available */}
              {profile.avatar?.url ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden border -mt-12 bg-white" style={{ zIndex: 1 }}>
                  <Image
                    src={profile.avatar.url}
                    alt="Profile avatar"
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold border -mt-12">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}
              
              <div className="text-lg font-semibold mt-2">{profile.name}</div>
              {profile.email && <div className="text-gray-600">{profile.email}</div>}
              {profile.bio && <div className="text-gray-500 text-sm text-center max-w-xs break-words">{profile.bio}</div>}
              {profile.venueManager && (
                <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Venue Manager
                </div>
              )}
              {isCurrentUser && (
                <Link href="/profile">
                  <Button variant="primary" className="mt-4">Edit Your Profile</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}