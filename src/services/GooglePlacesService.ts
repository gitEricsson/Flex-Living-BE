import type {
  GooglePlaceDetails,
  GoogleReview,
} from '../interfaces/GooglePlaces.interface';
import type { NormalizedReview } from '../interfaces/review.interface';

export class GooglePlacesService {
  private static readonly API_BASE =
    'https://maps.googleapis.com/maps/api/place';

  static async fetchReviews(placeId: string): Promise<GooglePlaceDetails> {
    if (!process.env.GOOGLE_PLACES_API_KEY) {
      throw new Error('GOOGLE_PLACES_API_KEY environment variable not set');
    }

    const url = new URL(`${this.API_BASE}/details/json`);
    url.searchParams.append('place_id', placeId);
    url.searchParams.append('fields', 'reviews,rating,user_ratings_total');
    url.searchParams.append('key', process.env.GOOGLE_PLACES_API_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!data.result) {
      throw new Error('Place not found');
    }

    return {
      reviews: data.result.reviews || [],
      rating: data.result.rating || 0,
      user_ratings_total: data.result.user_ratings_total || 0,
    };
  }

  static normalizeReviews(
    reviews: GoogleReview[],
    listingId: string,
    listingName: string
  ): NormalizedReview[] {
    return reviews.map((review) => ({
      id: review.time, // Using review.time as a number for ID, assuming it's unique enough for mock
      listingName: listingName,
      guestName: review.author_name,
      channel: 'Google',
      overallRating: review.rating,
      publicReview: review.text,
      cleanlinessRating: null, // Google Reviews don't provide these granular ratings
      communicationRating: null,
      respectHouseRulesRating: null,
      location: null,
      noise: null,
      amenities: null,
      decor: null,
      modern_amenities: null,
      value: null,
      submittedAt: new Date(review.time * 1000).toISOString(), // Original timestamp
      date: new Date(review.time * 1000).toISOString().split('T')[0], // YYYY-MM-DD format
      isApprovedForDisplay: false, // Default to false
    }));
  }

  static async searchPlace(query: string) {
    if (!process.env.GOOGLE_PLACES_API_KEY) {
      throw new Error('GOOGLE_PLACES_API_KEY environment variable not set');
    }

    const url = new URL(`${this.API_BASE}/textsearch/json`);
    url.searchParams.append('query', query);
    url.searchParams.append('key', process.env.GOOGLE_PLACES_API_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    return data.results || [];
  }
}
