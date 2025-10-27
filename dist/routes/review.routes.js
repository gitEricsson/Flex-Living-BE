"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("../controllers/review.controller");
const router = (0, express_1.Router)();
// GET /api/reviews/hostaway - Returns all normalized Hostaway reviews, optionally filtered by listingId
router.get('/hostaway', review_controller_1.ReviewController.getHostawayReviews);
// GET /api/reviews/google - Returns Google reviews for a specific placeId and listingName
router.get('/google', review_controller_1.ReviewController.getGoogleReviews);
// GET /api/reviews/google/search - Searches for places using Google Places API
router.get('/google/search', review_controller_1.ReviewController.searchGooglePlaces);
// GET /api/reviews/stats - Returns aggregated review statistics
router.get('/stats', review_controller_1.ReviewController.getReviewStats);
// PUT /api/reviews/:id/approve - Updates the `isApprovedForDisplay` status of a review
router.put('/:id/approve', review_controller_1.ReviewController.updateReviewApprovalStatus);
// GET /api/reviews/properties - Returns all unique properties from reviews
router.get('/properties', review_controller_1.ReviewController.getProperties);
exports.default = router;
