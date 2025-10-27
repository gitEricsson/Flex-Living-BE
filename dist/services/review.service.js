"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.ReviewService = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const HostawayService_1 = require("./HostawayService");
const GooglePlacesService_1 = require("./GooglePlacesService");
class ReviewService {
    constructor() {
        this.reviews = [];
        this.approvalStatuses = {};
        // Set path for the approval statuses JSON file
        this.approvalStatusesPath = path.join(process.cwd(), 'approved-reviews.json');
        this.loadApprovalStatuses();
        this.initializeReviews();
    }
    loadApprovalStatuses() {
        try {
            if (fs.existsSync(this.approvalStatusesPath)) {
                const data = fs.readFileSync(this.approvalStatusesPath, 'utf-8');
                this.approvalStatuses = JSON.parse(data);
            }
            else {
                this.approvalStatuses = {};
            }
        }
        catch (error) {
            console.error('Error loading approval statuses:', error);
            this.approvalStatuses = {};
        }
    }
    saveApprovalStatuses() {
        try {
            fs.writeFileSync(this.approvalStatusesPath, JSON.stringify(this.approvalStatuses, null, 2), 'utf-8');
        }
        catch (error) {
            console.error('Error saving approval statuses:', error);
        }
    }
    mergeApprovalStatuses(reviews) {
        return reviews.map((review) => {
            if (this.approvalStatuses.hasOwnProperty(review.id)) {
                return Object.assign(Object.assign({}, review), { isApprovedForDisplay: this.approvalStatuses[review.id] });
            }
            return review;
        });
    }
    initializeReviews() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch and normalize Hostaway reviews
                const hostawayRawReviews = yield HostawayService_1.HostawayService.fetchReviews();
                const normalizedHostawayReviews = HostawayService_1.HostawayService.normalizeReviews(hostawayRawReviews);
                // Merge with persisted approval statuses
                this.reviews = this.mergeApprovalStatuses(normalizedHostawayReviews);
            }
            catch (error) {
                console.error('Error initializing reviews:', error);
            }
        });
    }
    getHostawayReviews(listingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const hostawayRawReviews = yield HostawayService_1.HostawayService.fetchReviews(listingId);
            const normalizedReviews = HostawayService_1.HostawayService.normalizeReviews(hostawayRawReviews);
            // Merge with persisted approval statuses
            return this.mergeApprovalStatuses(normalizedReviews);
        });
    }
    getGoogleReviews(placeId, listingName) {
        return __awaiter(this, void 0, void 0, function* () {
            const googlePlaceDetails = yield GooglePlacesService_1.GooglePlacesService.fetchReviews(placeId);
            return GooglePlacesService_1.GooglePlacesService.normalizeReviews(googlePlaceDetails.reviews, placeId, listingName);
        });
    }
    searchGooglePlaces(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return GooglePlacesService_1.GooglePlacesService.searchPlace(query);
        });
    }
    getNormalizedReviews(filter) {
        let filteredReviews = [...this.reviews];
        if (filter) {
            if (filter.listingId) {
                const normalizedListingId = filter.listingId
                    .toLowerCase()
                    .replace(/\s+/g, '-');
                filteredReviews = filteredReviews.filter((review) => review.listingName.toLowerCase().replace(/\s+/g, '-') ===
                    normalizedListingId);
            }
            if (filter.channel) {
                filteredReviews = filteredReviews.filter((review) => review.channel === filter.channel);
            }
            if (filter.minRating) {
                filteredReviews = filteredReviews.filter((review) => review.overallRating && review.overallRating >= filter.minRating);
            }
            if (filter.maxRating) {
                filteredReviews = filteredReviews.filter((review) => review.overallRating && review.overallRating <= filter.maxRating);
            }
            if (filter.startDate) {
                filteredReviews = filteredReviews.filter((review) => new Date(review.date) >= new Date(filter.startDate));
            }
            if (filter.endDate) {
                filteredReviews = filteredReviews.filter((review) => new Date(review.date) <= new Date(filter.endDate));
            }
            if (filter.status) {
                // Assuming filter.status maps to isApprovedForDisplay
                const isApproved = filter.status === 'published';
                filteredReviews = filteredReviews.filter((review) => review.isApprovedForDisplay === isApproved);
            }
        }
        return filteredReviews;
    }
    updateReviewApprovalStatus(id, // Changed type from string to number
    isApproved) {
        // Update the in-memory review if it exists
        const reviewIndex = this.reviews.findIndex((review) => review.id === Number(id)); // Convert id to number
        if (reviewIndex > -1) {
            this.reviews[reviewIndex].isApprovedForDisplay = isApproved;
        }
        // Update the persisted approval status
        this.approvalStatuses[id] = isApproved;
        this.saveApprovalStatuses();
        if (reviewIndex > -1) {
            return this.reviews[reviewIndex];
        }
        return null;
    }
    getReviewStats(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            let reviewsToAnalyze;
            // If a listingId filter is provided, fetch fresh reviews for that listing
            // This ensures we get the latest data with persisted approval statuses
            if (filter === null || filter === void 0 ? void 0 : filter.listingId) {
                const freshReviews = yield this.getHostawayReviews(filter.listingId);
                reviewsToAnalyze = freshReviews;
            }
            else {
                // Otherwise, use the in-memory reviews
                reviewsToAnalyze = this.getNormalizedReviews(filter);
            }
            // HostawayService already has a calculateStats method, which is more comprehensive.
            // We should either unify the stats calculation or use HostawayService's method if only Hostaway reviews are considered for stats.
            // For now, I'll provide a basic calculation.
            return HostawayService_1.HostawayService.calculateStats(reviewsToAnalyze);
        });
    }
}
exports.ReviewService = ReviewService;
