"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLocalUser, updateVenueManagerStatus } from "@/lib/get-local-user";
import { profileService } from "@/lib/api";
import { z } from "zod";

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

const profileSchema = z.object({
  bio: z.string().max(160, "Bio must be 160 characters or less").optional(),
  avatarUrl: z.string().url("Invalid avatar URL").optional().or(z.literal("")),
  bannerUrl: z.string().url("Invalid banner URL").optional().or(z.literal("")),
  venueManager: z.boolean().optional(),
});

const API_KEY = process.env.NEXT_PUBLIC_NOROFF_API_KEY || "";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [venuesLoading, setVenuesLoading] = useState(false);
  const [venuesError, setVenuesError] = useState<string | null>(null);
  const router = useRouter();

  // Profile edit state
  const [editState, setEditState] = useState({
    bio: "",
    avatarUrl: "",
    bannerUrl: "",
    venueManager: false,
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);

  // Add state for settings visibility
  const [showSettings, setShowSettings] = useState(false);

  // Fetch profile from API
  async function fetchProfile() {
    setIsLoading(true);
    setError(null);
    const username = typeof window !== "undefined" ? localStorage.getItem("username") : null;
    if (!username) {
      router.replace("/login");
      return;
    }
    try {
      // Using profileService instead of fetch to properly include auth token
      const result = await profileService.getProfileByName(username);
      setProfile(result.data);
      
      // Update localStorage with profile data to ensure consistency
      if (result.data) {
        // Store venueManager status
        localStorage.setItem("venueManager", JSON.stringify(result.data.venueManager || false));
        
        // Store avatar and banner if they exist
        if (result.data.avatar) {
          localStorage.setItem("avatar", JSON.stringify(result.data.avatar));
        }
        if (result.data.banner) {
          localStorage.setItem("banner", JSON.stringify(result.data.banner));
        }
        if (result.data.email) {
          localStorage.setItem("email", result.data.email);
        }
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, [router]);

  // Keep editState in sync with profile
  useEffect(() => {
    if (!profile) return;
    setEditState({
      bio: profile.bio || "",
      avatarUrl: profile.avatar?.url || "",
      bannerUrl: profile.banner?.url || "",
      venueManager: profile.venueManager || false,
    });
  }, [profile]);

  // Fetch user's venues after profile is loaded
  useEffect(() => {
    if (!profile) return;
    setVenuesLoading(true);
    setVenuesError(null);

    // Using profileService instead of fetch to properly include auth token
    profileService.getProfileVenues(profile.name)
      .then((result) => {
        setVenues(result.data);
      })
      .catch((err) => {
        setVenuesError(err?.message || "Failed to load venues");
      })
      .finally(() => setVenuesLoading(false));
  }, [profile]);

  // Add navigation effect for venue scrolling
  useEffect(() => {
    // Only run on the client side
    if (typeof window !== 'undefined' && venues.length > 4) {
      // Handle venue navigation buttons
      const handleVenueNavigation = () => {
        const container = document.querySelector('.venues-container');
        if (!container) return;
        
        const navButtons = document.querySelectorAll('.venue-nav');
        navButtons.forEach(button => {
          button.addEventListener('click', (e) => {
            const direction = (e.currentTarget as HTMLElement).dataset.direction;
            const scrollAmount = container.clientHeight;
            
            if (direction === 'next') {
              container.scrollBy({ top: scrollAmount, behavior: 'smooth' });
            } else {
              container.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
            }
          });
        });
      };
      
      handleVenueNavigation();
      
      // Cleanup
      return () => {
        const navButtons = document.querySelectorAll('.venue-nav');
        navButtons.forEach(button => {
          button.removeEventListener('click', () => {});
        });
      };
    }
  }, [venues.length]);

  async function handleProfileUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEditError(null);
    setEditSuccess(null);
    const parse = profileSchema.safeParse(editState);
    if (!parse.success) {
      setEditError(parse.error.errors[0].message);
      return;
    }
    if (!profile) {
      setEditError("No profile loaded");
      return;
    }
    setEditLoading(true);
    try {
      const updateData = {
        bio: editState.bio || undefined,
        avatar: editState.avatarUrl ? { url: editState.avatarUrl, alt: "" } : undefined,
        banner: editState.bannerUrl ? { url: editState.bannerUrl, alt: "" } : undefined,
        venueManager: editState.venueManager,
      };
      await profileService.updateProfile(profile.name, updateData);
      
      // Update venueManager status in localStorage
      localStorage.setItem("venueManager", JSON.stringify(editState.venueManager));
      
      // Update other profile related data in localStorage if needed
      if (editState.avatarUrl) {
        localStorage.setItem("avatar", JSON.stringify({ url: editState.avatarUrl, alt: "" }));
      }
      if (editState.bannerUrl) {
        localStorage.setItem("banner", JSON.stringify({ url: editState.bannerUrl, alt: "" }));
      }
      
      setEditSuccess("Profile updated successfully");
      await fetchProfile(); // Re-fetch profile after update
    } catch (err: any) {
      setEditError(err?.message || "Failed to update profile");
    } finally {
      setEditLoading(false);
    }
  }

  if (isLoading) return <div className="text-center mt-10">Loading profile...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;
  if (!profile) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* VENUES SECTION - Left side on larger screens */}
        <div className="w-full md:w-3/5 order-2 md:order-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Venues</CardTitle>
              
              {profile.venueManager && (
                <Link href="/venues/register">
                  <Button variant="primary" size="sm" className="ml-auto mr-4">
                    + Add New Venue
                  </Button>
                </Link>
              )}
              
              {/* Venue Navigation - Only show when there are multiple venues */}
              {venues.length > 4 && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="venue-nav" data-direction="prev">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="venue-nav" data-direction="next">
                    Next
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {venuesLoading ? (
                <div className="text-center py-6">Loading venues...</div>
              ) : venuesError ? (
                <div className="text-center text-red-600 py-6">{venuesError}</div>
              ) : venues.length === 0 ? (
                <div className="text-center flex flex-col items-center py-6">
                  <p className="text-gray-500 mb-4">You have not created any venues yet.</p>
                  {profile.venueManager && (
                    <Link href="/venues/register">
                      <Button variant="primary">Register Your First Venue</Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="venues-container overflow-y-auto max-h-[600px] pr-2">
                  <div className="grid gap-4 md:grid-cols-2">
                    {venues.map((venue) => (
                      <Card key={venue.id} className="border border-blue-100">
                        <CardHeader>
                          <CardTitle className="text-base font-semibold truncate">{venue.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                          {venue.media?.[0]?.url && (
                            <img
                              src={venue.media[0].url}
                              alt={venue.media[0].alt || venue.name}
                              className="w-full h-32 object-cover rounded-md border"
                              width={320}
                              height={128}
                              loading="lazy"
                            />
                          )}
                          <div className="text-sm text-gray-700 line-clamp-2">{venue.description}</div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>Price: ${venue.price}</span>
                            <span>•</span>
                            <span>Max Guests: {venue.maxGuests}</span>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline">Edit</Button>
                            <Button size="sm" variant="danger">Delete</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* PROFILE DETAILS - Right side on larger screens */}
        <div className="w-full md:w-2/5 order-1 md:order-2">
          <div className="space-y-6">
            {/* User Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                {/* Banner image if available */}
                {profile.banner?.url && (
                  <img
                    src={profile.banner.url}
                    alt="Profile banner"
                    className="w-full h-32 object-cover rounded-md mb-4"
                    width={400}
                    height={128}
                    loading="lazy"
                  />
                )}
                {/* Avatar image if available */}
                {profile.avatar?.url ? (
                  <img
                    src={profile.avatar.url}
                    alt="Profile avatar"
                    className="w-24 h-24 rounded-full object-cover border -mt-12 bg-white"
                    width={96}
                    height={96}
                    loading="lazy"
                    style={{ zIndex: 1 }}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold border -mt-12">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-lg font-semibold mt-2">{profile.name}</div>
                <div className="text-gray-600">{profile.email}</div>
                {profile.bio && <div className="text-gray-500 text-sm text-center max-w-xs break-words">{profile.bio}</div>}
                {profile.venueManager && (
                  <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    Venue Manager
                  </div>
                )}
                
                <div className="w-full flex flex-col gap-3 mt-4">
                  {/* Settings toggle button */}
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    {showSettings ? 'Hide Settings' : 'Edit Profile Settings'}
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className={`transition-transform ${showSettings ? 'rotate-180' : ''}`}
                    >
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </Button>
                  
                  <Button 
                    className="w-full" 
                    variant="secondary" 
                    onClick={() => {
                      localStorage.removeItem("accessToken");
                      localStorage.removeItem("username");
                      localStorage.removeItem("email");
                      localStorage.removeItem("avatar");
                      localStorage.removeItem("banner");
                      localStorage.removeItem("venueManager");
                      router.push("/login");
                    }}
                  >
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* User Settings Card - Now collapsible */}
            {showSettings && (
              <Card className="animate-in fade-in-50 slide-in-from-top-5 duration-300">
                <CardHeader>
                  <CardTitle>User Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="flex flex-col gap-4" onSubmit={handleProfileUpdate}>
                    <label className="text-sm font-medium">Bio
                      <textarea
                        className="mt-1 w-full border rounded p-2"
                        maxLength={160}
                        value={editState.bio}
                        onChange={e => setEditState(s => ({ ...s, bio: e.target.value }))}
                        placeholder="Tell us about yourself..."
                      />
                    </label>
                    <label className="text-sm font-medium">Avatar URL
                      <input
                        type="url"
                        className="mt-1 w-full border rounded p-2"
                        value={editState.avatarUrl}
                        onChange={e => setEditState(s => ({ ...s, avatarUrl: e.target.value }))}
                        placeholder="https://..."
                      />
                    </label>
                    <label className="text-sm font-medium">Banner URL
                      <input
                        type="url"
                        className="mt-1 w-full border rounded p-2"
                        value={editState.bannerUrl}
                        onChange={e => setEditState(s => ({ ...s, bannerUrl: e.target.value }))}
                        placeholder="https://..."
                      />
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editState.venueManager}
                        onChange={e => {
                          const newValue = e.target.checked;
                          setEditState(s => ({ ...s, venueManager: newValue }));
                          // Update localStorage directly for immediate effect
                          updateVenueManagerStatus(newValue);
                        }}
                      />
                      Venue Manager
                    </label>
                    {editError && <div className="text-red-600 text-sm">{editError}</div>}
                    {editSuccess && <div className="text-green-600 text-sm">{editSuccess}</div>}
                    <Button type="submit" className="mt-2 w-full" variant="positive" disabled={editLoading}>
                      {editLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}