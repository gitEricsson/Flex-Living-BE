export interface ReviewCategory {
  category: string;
  rating: number;
}

export interface HostawayReview {
  id: number;
  type: 'host-to-guest' | 'guest-to-host';
  status: 'published' | 'draft' | 'archived';
  rating: number | null;
  publicReview: string;
  reviewCategory: ReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
}

export interface NormalizedReview {
  id: number; // Changed from string to number
  listingName: string;
  guestName: string;
  channel: string; // e.g., "Hostaway"
  overallRating: number | null;
  publicReview: string;
  cleanlinessRating: number | null;
  communicationRating: number | null;
  respectHouseRulesRating: number | null;
  location: number | null;
  noise: number | null;
  amenities: number | null;
  decor: number | null;
  modern_amenities: number | null;
  value: number | null;
  submittedAt: string; // Original timestamp from Hostaway
  date: string; // YYYY-MM-DD format for easier filtering
  isApprovedForDisplay: boolean; // Managed by the dashboard
}

export interface ReviewFilter {
  listingId?: string;
  channel?: 'hostaway' | 'google';
  minRating?: number;
  maxRating?: number;
  startDate?: string;
  endDate?: string;
  status?: 'published' | 'draft' | 'archived'; // This status might be better as isApprovedForDisplay: boolean
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  totalApprovedReviews: number; // Added
  totalPendingReviews: number; // Added
  topCategories: { category: string; rating: number }[]; // Added
}
