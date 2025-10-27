import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller';

const router = Router();

// GET /api/reviews/hostaway - Returns all normalized Hostaway reviews, optionally filtered by listingId
router.get('/hostaway', ReviewController.getHostawayReviews);

// GET /api/reviews/google - Returns Google reviews for a specific placeId and listingName
router.get('/google', ReviewController.getGoogleReviews);

// GET /api/reviews/google/search - Searches for places using Google Places API
router.get('/google/search', ReviewController.searchGooglePlaces);

// GET /api/reviews/stats - Returns aggregated review statistics
router.get('/stats', ReviewController.getReviewStats);

// PUT /api/reviews/:id/approve - Updates the `isApprovedForDisplay` status of a review
router.put('/:id/approve', ReviewController.updateReviewApprovalStatus);

// GET /api/reviews/properties - Returns all unique properties from reviews
router.get('/properties', ReviewController.getProperties);

export default router;
