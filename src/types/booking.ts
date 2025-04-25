import { Profile } from "./user";

// Forward reference for circular dependency
interface VenueRef {
  id: string;
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  rating: number;
  // Using Record instead of any
  [key: string]: string | number | boolean | object | undefined;
}

export interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId?: string;
  venue?: VenueRef;
  customer?: Profile;
  created: string;
  updated: string;
}

export interface BookingCreate {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
}
