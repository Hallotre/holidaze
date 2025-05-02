"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-blue-100/50 to-purple-100/50 mt-auto border-t border-blue-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Card className="shadow-none border-none bg-transparent p-0">
            <CardContent className="p-0">
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Holidaze</h3>
              <p className="text-gray-600">
                Find and book unique accommodations around the world.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-none border-none bg-transparent p-0">
            <CardContent className="p-0">
              <h4 className="font-medium mb-4 text-blue-700">Explore</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/venues"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    All Venues
                  </Link>
                </li>
                <li>
                  <Link
                    href="/venues?sort=price&sortOrder=asc"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Budget-friendly
                  </Link>
                </li>
                <li>
                  <Link
                    href="/venues?sort=rating&sortOrder=desc"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Top-rated
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="shadow-none border-none bg-transparent p-0">
            <CardContent className="p-0">
              <h4 className="font-medium mb-4 text-pink-600">Host</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/dashboard/venues"
                    className="text-gray-600 hover:text-pink-600 transition-colors"
                  >
                    Manage Venues
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/bookings"
                    className="text-gray-600 hover:text-pink-600 transition-colors"
                  >
                    Manage Bookings
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/create"
                    className="text-gray-600 hover:text-pink-600 transition-colors"
                  >
                    List Your Venue
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="shadow-none border-none bg-transparent p-0">
            <CardContent className="p-0">
              <h4 className="font-medium mb-4 text-purple-600">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/help"
                    className="text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="border-t border-blue-100 mt-8 pt-6 text-center text-gray-600">
          <p>&copy; {currentYear} Holidaze. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
