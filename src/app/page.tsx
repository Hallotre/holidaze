"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLocalUser } from "@/lib/get-local-user";
import { useRouter } from "next/navigation";

export default function HomePage() {
  // State for authentication and venue manager status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVenueManager, setIsVenueManager] = useState(false);
  const router = useRouter();

  // Check authentication status on client-side
  useEffect(() => {
    const user = getLocalUser();
    if (user) {
      setIsAuthenticated(true);
      setIsVenueManager(!!user.venueManager);
    }
  }, []);

  // Handle "Become a Host" button click
  const handleBecomeHost = () => {
    if (!isAuthenticated) {
      // Not logged in, redirect to register
      router.push("/register");
    } else if (isVenueManager) {
      // Already a venue manager, redirect to venues dashboard
      router.push("/profile/venues-dashboard");
    } else {
      // Logged in but not a venue manager, redirect to profile page
      // where they can update their settings
      router.push("/profile");
    }
  };

  // Popular destinations with Unsplash images
  const destinations = [
    {
      name: "Paris",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "New York",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      name: "Tokyo",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2094&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      name: "London",
      image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      name: "Cape Town",
      image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      name: "Berlin",
      image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      name: "Los Angeles",
      image: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      name: "Bangkok",
      image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1950&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
            alt="Colorful vacation destinations"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 via-purple-500/30 to-pink-500/40 z-10"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-20 py-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
            Find Your Perfect Stay
          </h1>
          <p className="text-xl md:text-2xl text-white mb-10 max-w-2xl mx-auto drop-shadow">
            Discover and book unique accommodations around the world with
            Holidaze
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link href="/venues">
              <Button size="lg" className="text-lg font-medium bg-pink-600 hover:bg-pink-700 transition-colors w-full">
                Browse Venues
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg font-medium bg-white text-pink-600 hover:bg-white/90 border-2 border-pink-600"
              onClick={handleBecomeHost}
            >
              {isVenueManager ? "Manage Your Venues" : "Become a Host"}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Why Choose Holidaze
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Experience the best in travel accommodations with our unique services
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="items-center text-center p-6 border-none bg-gradient-to-br from-purple-50 to-blue-50 hover:shadow-xl transition-all duration-300">
              <CardContent className="flex flex-col items-center pt-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-600"
                  >
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1-1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Unique Venues</h3>
                <p className="text-gray-600">
                  Discover one-of-a-kind places to stay, from cozy cabins to
                  luxurious villas.
                </p>
              </CardContent>
            </Card>

            <Card className="items-center text-center p-6 border-none bg-gradient-to-br from-pink-50 to-orange-50 hover:shadow-xl transition-all duration-300">
              <CardContent className="flex flex-col items-center pt-6">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-pink-600"
                  >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Easy Booking</h3>
                <p className="text-gray-600">
                  Simple and secure booking process with instant confirmations.
                </p>
              </CardContent>
            </Card>

            <Card className="items-center text-center p-6 border-none bg-gradient-to-br from-teal-50 to-blue-50 hover:shadow-xl transition-all duration-300">
              <CardContent className="flex flex-col items-center pt-6">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-teal-600"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M8 13h2" />
                    <path d="M8 17h2" />
                    <path d="M14 13h2" />
                    <path d="M14 17h2" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Verified Hosts</h3>
                <p className="text-gray-600">
                  All our hosts are verified to ensure quality and safety for your
                  stay.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Popular Destinations
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Explore our most-booked destinations and find your next adventure
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map(({ name, image }) => (
              <Link
                key={name}
                href={`/venues?q=${encodeURIComponent(name)}`}
                aria-label={`Search venues in ${name}`}
                className="group relative h-64 overflow-hidden rounded-xl block focus:outline-none focus:ring-2 focus:ring-primary"
                tabIndex={0}
              >
                {/* Unsplash image as background */}
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-cover w-full h-full absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 p-4 z-20 text-white">
                  <h3 className="text-xl font-bold drop-shadow-lg">{name}</h3>
                  <p className="drop-shadow">Explore venues</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        {/* CTA Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=2070&auto=format&fit=crop"
            alt="Colorful coastal vacation house"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/70 to-violet-500/70 z-10"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            {isVenueManager ? "Manage your venues" : "Ready to host your venue?"}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white">
            {isVenueManager 
              ? "Access your dashboard to manage bookings and update your venues" 
              : "Join our community of hosts and start earning by sharing your space with travelers"}
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="text-lg font-medium bg-white text-violet-600 hover:bg-white/90 border-2 border-white"
            onClick={handleBecomeHost}
          >
            {isVenueManager ? "Go to Dashboard" : "Become a Host Today"}
          </Button>
        </div>
      </section>
    </div>
  );
}
