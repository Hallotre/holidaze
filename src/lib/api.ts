import axios from 'axios';
import { LoginCredentials, RegisterCredentials, Profile, ProfileUpdate } from '../types/user';
import { Booking, BookingCreate } from '../types/booking';
import { Venue, VenueCreate } from '../types/venue';

// Define the API base URL with a fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://v2.api.noroff.dev';
// Define specific endpoint URLs
const API_VENUES_URL = `${API_BASE_URL}/holidaze/venues`;
const API_BOOKINGS_URL = `${API_BASE_URL}/holidaze/bookings`;
const API_AUTH_URL = `${API_BASE_URL}/holidaze/auth`;
const API_PROFILES_URL = `${API_BASE_URL}/holidaze/profiles`;

// Response type for paginated data
interface ApiResponse<T> {
  data: T;
  meta: {
    isFirstPage: boolean;
    isLastPage: boolean;
    currentPage: number;
    previousPage: number | null;
    nextPage: number | null;
    pageCount: number;
    totalCount: number;
  };
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Noroff-API-Key': process.env.NEXT_PUBLIC_NOROFF_API_KEY || ''
  }
});

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    // Safely access localStorage only in browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const venueService = {
  getVenues: async (params: { limit?: number; page?: number; sort?: string; sortOrder?: 'asc' | 'desc' } = {}) => {
    const { limit = 100, page = 1, sort, sortOrder } = params;
    let url = `${API_VENUES_URL}?limit=${limit}&page=${page}`;
    
    if (sort) {
      url += `&sort=${sort}`;
      if (sortOrder) {
        url += `&sortOrder=${sortOrder}`;
      }
    }
    
    const response = await api.get<ApiResponse<Venue[]>>(url);
    return response.data;
  },

  getVenueById: async (id: string, includeOwner = true, includeBookings = false) => {
    let url = `${API_VENUES_URL}/${id}`;
    const params = [];
    
    if (includeOwner) params.push('_owner=true');
    if (includeBookings) params.push('_bookings=true');
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    const response = await api.get(url);
    return response.data;
  },

  searchVenues: async (query: string) => {
    const response = await api.get(`${API_VENUES_URL}/search?q=${query}`);
    return response.data;
  },

  createVenue: async (venue: VenueCreate) => {
    const response = await api.post(API_VENUES_URL, venue);
    return response.data;
  },

  updateVenue: async (id: string, venue: Partial<Venue>) => {
    const response = await api.put(`${API_VENUES_URL}/${id}`, venue);
    return response.data;
  },

  deleteVenue: async (id: string) => {
    await api.delete(`${API_VENUES_URL}/${id}`);
    return true;
  }
};

export const bookingService = {
  getBookings: async (params: { limit?: number; page?: number; sort?: string; sortOrder?: 'asc' | 'desc' } = {}) => {
    const { limit = 100, page = 1, sort, sortOrder } = params;
    let url = `${API_BOOKINGS_URL}?limit=${limit}&page=${page}`;
    
    if (sort) {
      url += `&sort=${sort}`;
      if (sortOrder) {
        url += `&sortOrder=${sortOrder}`;
      }
    }
    
    const response = await api.get<ApiResponse<Booking[]>>(url);
    return response.data;
  },

  getBookingById: async (id: string, includeVenue = true, includeCustomer = false) => {
    let url = `${API_BOOKINGS_URL}/${id}`;
    const params = [];
    
    if (includeVenue) params.push('_venue=true');
    if (includeCustomer) params.push('_customer=true');
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    const response = await api.get(url);
    return response.data;
  },

  createBooking: async (booking: BookingCreate) => {
    const response = await api.post(API_BOOKINGS_URL, booking);
    return response.data;
  },

  updateBooking: async (id: string, booking: Partial<Booking>) => {
    const response = await api.put(`${API_BOOKINGS_URL}/${id}`, booking);
    return response.data;
  },

  deleteBooking: async (id: string) => {
    await api.delete(`${API_BOOKINGS_URL}/${id}`);
    return true;
  }
};

export const profileService = {
  getProfiles: async (params: { limit?: number; page?: number; sort?: string; sortOrder?: 'asc' | 'desc' } = {}) => {
    const { limit = 100, page = 1, sort, sortOrder } = params;
    let url = `${API_PROFILES_URL}?limit=${limit}&page=${page}`;
    
    if (sort) {
      url += `&sort=${sort}`;
      if (sortOrder) {
        url += `&sortOrder=${sortOrder}`;
      }
    }
    
    const response = await api.get<ApiResponse<Profile[]>>(url);
    return response.data;
  },

  getProfileByName: async (name: string, includeVenues = false, includeBookings = false) => {
    let url = `${API_PROFILES_URL}/${name}`;
    const params = [];
    
    if (includeVenues) params.push('_venues=true');
    if (includeBookings) params.push('_bookings=true');
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    const response = await api.get(url);
    return response.data;
  },

  getProfileVenues: async (name: string) => {
    const response = await api.get(`${API_PROFILES_URL}/${name}/venues`);
    return response.data;
  },

  getProfileBookings: async (name: string) => {
    const response = await api.get(`${API_PROFILES_URL}/${name}/bookings?_venue=true`);
    return response.data;
  },
  
  updateProfile: async (name: string, profileData: ProfileUpdate) => {
    const response = await api.put(`${API_PROFILES_URL}/${name}`, profileData);
    return response.data;
  },

  searchProfiles: async (query: string) => {
    const response = await api.get(`${API_PROFILES_URL}/search?q=${query}`);
    return response.data;
  }
};

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post(`${API_AUTH_URL}/login`, credentials);
    return response.data;
  },

  register: async (user: RegisterCredentials) => {
    const response = await api.post(`${API_AUTH_URL}/register`, user);
    return response.data;
  }
};

export default api;
