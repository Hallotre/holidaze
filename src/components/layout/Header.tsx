"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, User, Menu, X } from "lucide-react";

interface HeaderProps {
  isLoggedIn?: boolean;
  venueManager?: boolean;
  username?: string;
}

export default function Header({
  isLoggedIn = false,
  venueManager = false,
  username = "",
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  // Close mobile menu when navigating to a new page
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/venues/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-card sticky top-0 z-50 shadow-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold">
            Holidaze
          </Link>
        </div>

        {/* Search bar - hide on mobile */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex relative w-full max-w-md mx-4"
        >
          <input
            type="text"
            placeholder="Search venues..."
            className="w-full px-4 py-2 rounded-full border border-input bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        </form>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/venues" className="hover:text-accent-foreground">
            Venues
          </Link>

          {isLoggedIn ? (
            <>
              {venueManager && (
                <Link
                  href="/dashboard/venues"
                  className="hover:text-accent-foreground"
                >
                  My Venues
                </Link>
              )}
              <Link
                href={`/profile/${username}`}
                className="flex items-center hover:text-accent-foreground"
              >
                <User size={18} className="mr-2" />
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hover:text-accent-foreground">
                Login
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-foreground"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-card">
          <form onSubmit={handleSearch} className="p-4 flex">
            <input
              type="text"
              placeholder="Search venues..."
              className="w-full px-4 py-2 rounded-l-lg border border-input bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-r-lg bg-primary text-primary-foreground"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </form>
          <nav className="flex flex-col px-4 pb-4 space-y-4">
            <Link href="/venues" className="py-2 border-b border-border">
              Venues
            </Link>
            {isLoggedIn ? (
              <>
                {venueManager && (
                  <Link
                    href="/dashboard/venues"
                    className="py-2 border-b border-border"
                  >
                    My Venues
                  </Link>
                )}
                <Link
                  href={`/profile/${username}`}
                  className="py-2 border-b border-border"
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="py-2 border-b border-border"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="py-2 text-center rounded-lg bg-primary text-primary-foreground"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
