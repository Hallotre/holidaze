"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  // Detect login state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      const user = localStorage.getItem("username");
      setIsLoggedIn(!!token);
      setUsername(user || "");
    }
  }, [pathname]);

  // Close mobile menu when navigating to a new page
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast("Please enter a search term.", { description: "Search cannot be empty." });
      return;
    }
    try {
      router.push(`/venues/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } catch (error) {
      toast("Search failed.", { description: "An error occurred while searching. Please try again." });
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-gradient-to-r from-blue-50 to-purple-50 sticky top-0 z-50 shadow-sm border-b border-blue-100">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Holidaze
          </Link>
        </div>

        {/* Search bar - hide on mobile */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex w-full max-w-md mx-4 relative"
        >
          <div className="relative w-full flex items-center">
            <span className="absolute left-3 text-pink-400">
              <Search size={18} />
            </span>
            <Input
              type="text"
              placeholder="Search venues..."
              className="w-full pl-10 pr-3 border-pink-200 focus:border-pink-400 focus:ring-pink-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search venues"
            />
            <Button
              type="submit"
              size="sm"
              className="ml-2"
              aria-label="Search"
            >
              Search
            </Button>
          </div>
        </form>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          <Link href="/venues">
            <Button 
              variant="outline" 
              className="border-2 border-pink-300 text-pink-600 hover:bg-pink-50"
            >
              Venues
            </Button>
          </Link>
          {isLoggedIn ? (
            <>
              <Link href="/profile">
                <Button 
                  variant="outline" 
                  className="border-2 border-pink-300 text-pink-600 hover:bg-pink-50 flex items-center"
                >
                  <User size={18} className="mr-2 text-pink-500" /> Profile
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button 
                  variant="outline" 
                  className="border-2 border-pink-300 text-pink-600 hover:bg-pink-50"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button 
                  variant="primary" 
                  className="border-2 border-pink-700"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <Button
          onClick={toggleMenu}
          variant="outline"
          size="sm"
          className="md:hidden text-pink-600 border-pink-300 hover:bg-pink-50"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-blue-50 to-white border-t border-blue-100">
          <form onSubmit={handleSearch} className="p-4 flex gap-2">
            <div className="relative w-full flex items-center">
              <span className="absolute left-3 text-pink-400">
                <Search size={18} />
              </span>
              <Input
                type="text"
                placeholder="Search venues..."
                className="w-full pl-10 pr-3 border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search venues"
              />
            </div>
            <Button type="submit" aria-label="Search">
              Search
            </Button>
          </form>
          <nav className="flex flex-col px-4 pb-4 space-y-2">
            <Link href="/venues">
              <Button 
                variant="outline" 
                className="w-full justify-start border-2 border-pink-300 text-pink-600 hover:bg-pink-50"
              >
                Venues
              </Button>
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/profile">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-2 border-pink-300 text-pink-600 hover:bg-pink-50"
                  >
                    Profile
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-2 border-pink-300 text-pink-600 hover:bg-pink-50"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    variant="primary" 
                    className="w-full justify-start border-2 border-pink-700"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
