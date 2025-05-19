"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  error: string;
  isVenueManager: boolean;
  onRefreshSettings?: () => void;
}

/**
 * ErrorMessage - Component for displaying form error messages
 * 
 * @param error - The error message to display
 * @param isVenueManager - Whether the user is a venue manager
 * @param onRefreshSettings - Handler for refreshing user settings
 */
export function ErrorMessage({ error, isVenueManager, onRefreshSettings }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
      {error}
      {!isVenueManager && (
        <div className="mt-2 flex flex-col gap-2">
          <p className="text-sm">You need to check the &quot;Venue Manager&quot; option in your profile settings.</p>
          <Link href="/profile" className="bg-blue-600 text-white px-4 py-2 rounded-md text-center hover:bg-blue-700 transition-colors">
            Update Profile Settings
          </Link>
          {onRefreshSettings && (
            <Button 
              type="button" 
              variant="outline"
              className="mt-2"
              onClick={onRefreshSettings}
            >
              Refresh Settings
            </Button>
          )}
        </div>
      )}
    </div>
  );
} 