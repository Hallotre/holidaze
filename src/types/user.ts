export interface Media {
  url: string;
  alt: string;
}

export interface Profile {
  name: string;
  email: string;
  bio?: string;
  avatar?: Media;
  banner?: Media;
  venueManager: boolean;
  _count?: {
    venues: number;
    bookings: number;
  };
}

export interface ProfileUpdate {
  bio?: string;
  avatar?: Media;
  banner?: Media;
  venueManager?: boolean;
}

export interface AuthState {
  profile: Profile | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  avatar?: Media;
  venueManager: boolean;
}
