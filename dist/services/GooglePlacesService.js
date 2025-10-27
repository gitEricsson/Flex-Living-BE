"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GooglePlacesService = void 0;
class GooglePlacesService {
    static fetchReviews(placeId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!process.env.GOOGLE_PLACES_API_KEY) {
                throw new Error('GOOGLE_PLACES_API_KEY environment variable not set');
            }
            const url = new URL(`${this.API_BASE}/details/json`);
            url.searchParams.append('place_id', placeId);
            url.searchParams.append('fields', 'reviews,rating,user_ratings_total');
            url.searchParams.append('key', process.env.GOOGLE_PLACES_API_KEY);
            const response = yield fetch(url.toString());
            const data = yield response.json();
            if (!data.result) {
                throw new Error('Place not found');
            }
            return {
                reviews: data.result.reviews || [],
                rating: data.result.rating || 0,
                user_ratings_total: data.result.user_ratings_total || 0,
            };
        });
    }
    static normalizeReviews(reviews, listingId, listingName) {
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
    static searchPlace(query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!process.env.GOOGLE_PLACES_API_KEY) {
                throw new Error('GOOGLE_PLACES_API_KEY environment variable not set');
            }
            const url = new URL(`${this.API_BASE}/textsearch/json`);
            url.searchParams.append('query', query);
            url.searchParams.append('key', process.env.GOOGLE_PLACES_API_KEY);
            const response = yield fetch(url.toString());
            const data = yield response.json();
            return data.results || [];
        });
    }
}
exports.GooglePlacesService = GooglePlacesService;
GooglePlacesService.API_BASE = 'https://maps.googleapis.com/maps/api/place';
