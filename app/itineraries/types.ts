import { SafeUser } from "../types";

export type TripStatus = 'planned' | 'active' | 'completed';

export interface Transportation {
  id: string;
  type: 'flight' | 'train' | 'bus' | 'car' | 'ferry';
  provider: string;
  departureTime: string;
  arrivalTime: string;
  departureLocation: string;
  arrivalLocation: string;
  price: number;
  duration: string;
  confirmationCode?: string;
  details?: Record<string, any>;
}

export interface Accommodation {
  id: string;
  listingId: string;
  name: string;
  location: string;
  checkIn: string;
  checkOut: string;
  price: number;
  imageUrl: string;
  rating?: number;
  confirmationCode?: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  location: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  category: string;
  imageUrl: string;
  rating?: number;
  bookingStatus?: 'booked' | 'saved' | 'suggested';
}

export interface ItineraryDay {
  date: string;
  accommodations: Accommodation[];
  transportation: Transportation[];
  activities: Activity[];
}

export interface ItineraryDestination {
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  startDate: string;
  endDate: string;
  days: ItineraryDay[];
}

export interface Itinerary {
  id: string;
  name: string;
  status: TripStatus;
  startDate: string;
  endDate: string;
  destinations: ItineraryDestination[];
  createdAt: string;
  userId: string;
  totalBudget?: number;
  currentSpend?: number;
  coverImage: string;
}

export interface SafeItinerary extends Omit<Itinerary, 'userId'> {
  user: SafeUser;
} 