"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card mt-auto border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Holidaze</h3>
            <p className="text-muted-foreground">
              Find and book unique accommodations around the world.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/venues"
                  className="text-muted-foreground hover:text-foreground"
                >
                  All Venues
                </Link>
              </li>
              <li>
                <Link
                  href="/venues?sort=price&sortOrder=asc"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Budget-friendly
                </Link>
              </li>
              <li>
                <Link
                  href="/venues?sort=rating&sortOrder=desc"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Top-rated
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Host</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard/venues"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Manage Venues
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/bookings"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Manage Bookings
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/create"
                  className="text-muted-foreground hover:text-foreground"
                >
                  List Your Venue
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-muted-foreground">
          <p>&copy; {currentYear} Holidaze. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
