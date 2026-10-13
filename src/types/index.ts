export type TourismCategory = 
  | 'All' 
  | 'Hill Station' 
  | 'Heritage & Temples' 
  | 'Coastal & Beach' 
  | 'Nature & Wildlife' 
  | 'Cultural & Culinary';

export interface VerifiedTourismInfo {
  idealDuration: string;
  bestSeason: string;
  nearestAirport: string;
  nearestRailway: string;
  weatherHighlight: string;
  localCuisine: string[];
  cultureHighlights: string[];
}

export interface TourPackage {
  id: string;
  name: string;
  duration: string;
  pricePerPerson: number;
  inclusions: string[];
  highlights: string[];
  isGroupAvailable?: boolean;
}

export interface Destination {
  id: string;
  name: string;
  tagline: string;
  district: string;
  region: string;
  category: TourismCategory;
  isHiddenGem: boolean;
  isTrending: boolean;
  isPopular: boolean;
  heroImage: string;
  fallbackImage?: string;
  galleryImages: string[];
  description: string;
  verifiedInfo: VerifiedTourismInfo;
  attractions: string[];
  estimatedCostPerPerson: number;
  rating: number;
  reviewCount: number;
  availablePackages: TourPackage[];
}

export interface AccommodationOption {
  id: string;
  name: string;
  pricePerNight: number;
  rating: number;
  badge: string;
}

export interface TransportationOption {
  id: string;
  name: string;
  pricePerDay: number;
  capacity: string;
  badge: string;
}

export interface CaretakerGuideOption {
  id: string;
  name: string;
  pricePerDay: number;
  description: string;
  type: 'caretaker' | 'guide' | 'both' | 'none';
}

export interface AddOnActivity {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
}

export interface ServiceCatalog {
  accommodations: AccommodationOption[];
  transportations: TransportationOption[];
  caretakerGuides: CaretakerGuideOption[];
  addOns: AddOnActivity[];
}

export interface PromotionConfig {
  code: string;
  discountPercent: number;
  minBookingAmount: number;
  maxDiscountAmount: number;
  active: boolean;
  startDate: string;
  endDate: string;
  title: string;
  description: string;
}

export type CompanionType = 'solo' | 'family' | 'friends' | 'group' | 'meet_travellers';
export type ArrangementType = 'curated' | 'self_planned';
export type AssistanceType = 'caretaker' | 'guide' | 'both' | 'none';
export type BookingStatus = 'PENDING_CONFIRMATION' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PAYMENT_PENDING' | 'PAID' | 'PAY_ON_ARRIVAL';

export interface BookingPricing {
  baseAmount: number;
  servicesAmount: number;
  assistCost?: number;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  promoCodeApplied?: string;
  taxAmount: number;
  finalPayableAmount: number;
  isEstimated: boolean;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  destinationId: string;
  destinationName: string;
  travelDates: {
    startDate: string;
    returnDate: string;
    durationDays: number;
  };
  travellers: {
    adults: number;
    children: number;
    total: number;
  };
  companionType: CompanionType;
  groupDepartureId?: string | null;
  arrangementPreference: ArrangementType;
  selectedPackageId?: string | null;
  selectedPackageName?: string;
  caretakerGuidePreference: AssistanceType;
  caretakerGuideCost: number;
  selectedServices: {
    accommodation?: {
      name: string;
      pricePerNight: number;
      nights?: number;
      total?: number;
    };
    transportation?: {
      name: string;
      pricePerDay: number;
      days?: number;
      total?: number;
    };
    sightseeingActivities?: {
      name: string;
      pricePerPerson: number;
      total?: number;
    }[];
  };
  pricing: BookingPricing;
  specialRequests?: string;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  destinationId: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  title: string;
  content: string;
  travelDate: string;
  companionType: string;
  photoUrl?: string | null;
  isVerifiedBooking: boolean;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  createdAt: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: 'traveler' | 'admin';
  avatar: string;
  hasCompletedBookings?: boolean;
  createdAt: string;
}
