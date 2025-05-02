import { Media, Profile } from './user';
import { Booking } from './booking';

export interface Location {
  address?: string;
  city?: string;
  country?: string;
  zip?: string;
  continent?: string;
  lat?: number;
  lng?: number;
}

export interface VenueMeta {
  wifi: boolean;
  parking: boolean;
  breakfast: boolean;
  pets: boolean;
}

export type VenueCategory =
  | "apartment"
  | "house"
  | "cabin"
  | "villa"
  | "hotel"
  | "unique"
  | "bnb"
  | "resort"
  | "camping"
  | "other";

export interface Venue {
  id: string;
  name: string;
  description: string;
  media: Media[];
  price: number;
  maxGuests: number;
  rating: number;
  location: Location;
  meta: VenueMeta;
  owner?: Profile;
  created: string;
  updated: string;
  bookings?: Booking[];
  category?: VenueCategory;
}

export interface VenueCreate {
  name: string;
  description: string;
  media?: Media[];
  price: number;
  maxGuests: number;
  rating?: number;
  meta?: {
    wifi?: boolean;
    parking?: boolean;
    breakfast?: boolean;
    pets?: boolean;
  };
  location?: {
    address?: string;
    city?: string;
    zip?: string;
    country?: string;
    continent?: string;
    lat?: number;
    lng?: number;
  };
  category?: VenueCategory;
}

export interface VenueFilters {
  country?: string;
  guests?: number;
  priceMin?: number;
  priceMax?: number;
  wifi?: boolean;
  parking?: boolean;
  breakfast?: boolean;
  pets?: boolean;
  category?: VenueCategory;
}
