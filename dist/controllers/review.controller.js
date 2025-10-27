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
exports.ReviewController = void 0;
const review_service_1 = require("../services/review.service");
const mockHostawayReviews_1 = require("../constants/mockHostawayReviews");
const reviewService = new review_service_1.ReviewService();
class ReviewController {
    static getHostawayReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const listingId = req.query.listingId;
                const reviews = yield reviewService.getHostawayReviews(listingId);
                res.status(200).json(reviews);
            }
            catch (error) {
                console.error('Error fetching Hostaway reviews:', error);
                res.status(500).json({
                    message: 'Internal server error while fetching Hostaway reviews.',
                });
            }
        });
    }
    static getGoogleReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { placeId, listingName } = req.query;
            if (!placeId || typeof placeId !== 'string') {
                res.status(400).json({
                    message: 'Invalid request: placeId is required and must be a string.',
                });
                return;
            }
            if (!listingName || typeof listingName !== 'string') {
                res.status(400).json({
                    message: 'Invalid request: listingName is required and must be a string.',
                });
                return;
            }
            try {
                const reviews = yield reviewService.getGoogleReviews(placeId, listingName);
                res.status(200).json(reviews);
            }
            catch (error) {
                console.error('Error fetching Google reviews:', error);
                res.status(500).json({
                    message: 'Internal server error while fetching Google reviews.',
                });
            }
        });
    }
    static searchGooglePlaces(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query } = req.query;
            if (!query || typeof query !== 'string') {
                res.status(400).json({
                    message: 'Invalid request: query is required and must be a string.',
                });
                return;
            }
            try {
                const results = yield reviewService.searchGooglePlaces(query);
                res.status(200).json(results);
            }
            catch (error) {
                console.error('Error searching Google places:', error);
                res.status(500).json({
                    message: 'Internal server error while searching Google places.',
                });
            }
        });
    }
    static getReviewStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filter = req.query; // Assuming query params match ReviewFilter interface
                const stats = yield reviewService.getReviewStats(filter);
                res.status(200).json(stats);
            }
            catch (error) {
                console.error('Error fetching review statistics:', error);
                res.status(500).json({
                    message: 'Internal server error while fetching review statistics.',
                });
            }
        });
    }
    static updateReviewApprovalStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const reviewId = req.params.id; // Changed to string
            const { isApproved } = req.body;
            if (typeof reviewId !== 'string' || typeof isApproved !== 'boolean') {
                res.status(400).json({
                    message: 'Invalid request: review ID must be a string and isApproved must be a boolean.',
                });
                return;
            }
            try {
                const updatedReview = reviewService.updateReviewApprovalStatus(Number(reviewId), // Convert to number
                isApproved);
                if (updatedReview) {
                    res.status(200).json(updatedReview);
                }
                else {
                    res.status(404).json({ message: 'Review not found.' });
                }
            }
            catch (error) {
                console.error(`Error updating approval status for review ${reviewId}:`, error);
                res.status(500).json({
                    message: 'Internal server error while updating review approval status.',
                });
            }
        });
    }
    static getProperties(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get unique properties from mock data
                const properties = Array.from(new Set(mockHostawayReviews_1.mockHostawayReviews.result
                    .filter((review) => review.listingName && review.listingName.trim() !== '') // Ensure listingName is not empty or just whitespace
                    .map((review) => ({
                    id: review.listingName.toLowerCase().replace(/\\s+/g, '-'),
                    name: review.listingName,
                }))));
                res.json({
                    status: 'success',
                    data: {
                        properties,
                    },
                });
            }
            catch (error) {
                res.status(500).json({
                    status: 'error',
                    message: 'Failed to fetch properties',
                });
            }
        });
    }
}
exports.ReviewController = ReviewController;
