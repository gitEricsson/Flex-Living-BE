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
exports.HostawayService = void 0;
const mockHostawayReviews_1 = require("../constants/mockHostawayReviews");
class HostawayService {
    static fetchReviews(listingId) {
        return __awaiter(this, void 0, void 0, function* () {
            let reviewsToReturn = mockHostawayReviews_1.mockHostawayReviews.result;
            if (listingId) {
                const slugifiedListingId = listingId.toLowerCase().replace(/\s+/g, '-');
                reviewsToReturn = reviewsToReturn.filter((r) => {
                    const reviewListingSlug = r.listingName
                        .toLowerCase()
                        .replace(/\s+/g, '-');
                    return reviewListingSlug === slugifiedListingId;
                });
            }
            return reviewsToReturn;
        });
    }
    static normalizeReviews(reviews) {
        return reviews.map((review) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
            const cleanlinessRating = (_c = (_b = (_a = review.reviewCategory) === null || _a === void 0 ? void 0 : _a.find((cat) => cat.category === 'cleanliness')) === null || _b === void 0 ? void 0 : _b.rating) !== null && _c !== void 0 ? _c : null;
            const communicationRating = (_f = (_e = (_d = review.reviewCategory) === null || _d === void 0 ? void 0 : _d.find((cat) => cat.category === 'communication')) === null || _e === void 0 ? void 0 : _e.rating) !== null && _f !== void 0 ? _f : null;
            const respectHouseRulesRating = (_j = (_h = (_g = review.reviewCategory) === null || _g === void 0 ? void 0 : _g.find((cat) => cat.category === 'respect_house_rules')) === null || _h === void 0 ? void 0 : _h.rating) !== null && _j !== void 0 ? _j : null;
            const location = (_m = (_l = (_k = review.reviewCategory) === null || _k === void 0 ? void 0 : _k.find((cat) => cat.category === 'location')) === null || _l === void 0 ? void 0 : _l.rating) !== null && _m !== void 0 ? _m : null;
            const noise = (_q = (_p = (_o = review.reviewCategory) === null || _o === void 0 ? void 0 : _o.find((cat) => cat.category === 'noise')) === null || _p === void 0 ? void 0 : _p.rating) !== null && _q !== void 0 ? _q : null;
            const amenities = (_t = (_s = (_r = review.reviewCategory) === null || _r === void 0 ? void 0 : _r.find((cat) => cat.category === 'amenities')) === null || _s === void 0 ? void 0 : _s.rating) !== null && _t !== void 0 ? _t : null;
            const decor = (_w = (_v = (_u = review.reviewCategory) === null || _u === void 0 ? void 0 : _u.find((cat) => cat.category === 'decor')) === null || _v === void 0 ? void 0 : _v.rating) !== null && _w !== void 0 ? _w : null;
            const modernAmenities = (_z = (_y = (_x = review.reviewCategory) === null || _x === void 0 ? void 0 : _x.find((cat) => cat.category === 'modern_amenities')) === null || _y === void 0 ? void 0 : _y.rating) !== null && _z !== void 0 ? _z : null;
            const value = (_2 = (_1 = (_0 = review.reviewCategory) === null || _0 === void 0 ? void 0 : _0.find((cat) => cat.category === 'value')) === null || _1 === void 0 ? void 0 : _1.rating) !== null && _2 !== void 0 ? _2 : null;
            const categoryRatings = [
                cleanlinessRating,
                communicationRating,
                respectHouseRulesRating,
                location,
                noise,
                amenities,
                decor,
                modernAmenities,
                value,
            ].filter((rating) => rating !== null);
            const overallRating = categoryRatings.length > 0
                ? Math.round(categoryRatings.reduce((sum, rating) => sum + rating, 0) / categoryRatings.length)
                : (_3 = review.rating) !== null && _3 !== void 0 ? _3 : 0; // Fallback to main rating if categories are not present, default to 0
            return {
                id: review.id, // Hostaway review IDs are numbers
                listingName: review.listingName,
                guestName: review.guestName,
                channel: 'Hostaway', // All reviews from this service are Hostaway
                overallRating,
                publicReview: review.publicReview,
                cleanlinessRating,
                communicationRating,
                respectHouseRulesRating,
                location,
                noise,
                amenities,
                decor,
                modern_amenities: modernAmenities,
                value,
                submittedAt: review.submittedAt,
                date: review.submittedAt.split(' ')[0], // YYYY-MM-DD format
                isApprovedForDisplay: false, // Default to false, managers will approve
            };
        });
    }
    static calculateStats(reviews) {
        const totalReviews = reviews.length;
        const ratings = reviews
            .filter((r) => r.overallRating !== null)
            .map((r) => r.overallRating);
        const averageRating = ratings.length > 0
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length
            : 0;
        const totalApprovedReviews = reviews.filter((r) => r.isApprovedForDisplay).length;
        const totalPendingReviews = reviews.filter((r) => !r.isApprovedForDisplay).length;
        const categoryStats = {};
        reviews.forEach((review) => {
            if (review.cleanlinessRating !== null) {
                categoryStats['cleanliness'] = categoryStats['cleanliness'] || {
                    total: 0,
                    count: 0,
                };
                categoryStats['cleanliness'].total += review.cleanlinessRating;
                categoryStats['cleanliness'].count += 1;
            }
            if (review.communicationRating !== null) {
                categoryStats['communication'] = categoryStats['communication'] || {
                    total: 0,
                    count: 0,
                };
                categoryStats['communication'].total += review.communicationRating;
                categoryStats['communication'].count += 1;
            }
            if (review.respectHouseRulesRating !== null) {
                categoryStats['respect_house_rules'] = categoryStats['respect_house_rules'] || { total: 0, count: 0 };
                categoryStats['respect_house_rules'].total +=
                    review.respectHouseRulesRating;
                categoryStats['respect_house_rules'].count += 1;
            }
            if (review.location !== null) {
                categoryStats['location'] = categoryStats['location'] || {
                    total: 0,
                    count: 0,
                };
                categoryStats['location'].total += review.location;
                categoryStats['location'].count += 1;
            }
            if (review.noise !== null) {
                categoryStats['noise'] = categoryStats['noise'] || {
                    total: 0,
                    count: 0,
                };
                categoryStats['noise'].total += review.noise;
                categoryStats['noise'].count += 1;
            }
            if (review.amenities !== null) {
                categoryStats['amenities'] = categoryStats['amenities'] || {
                    total: 0,
                    count: 0,
                };
                categoryStats['amenities'].total += review.amenities;
                categoryStats['amenities'].count += 1;
            }
            if (review.decor !== null) {
                categoryStats['decor'] = categoryStats['decor'] || {
                    total: 0,
                    count: 0,
                };
                categoryStats['decor'].total += review.decor;
                categoryStats['decor'].count += 1;
            }
            if (review.modern_amenities !== null) {
                categoryStats['modern_amenities'] = categoryStats['modern_amenities'] || {
                    total: 0,
                    count: 0,
                };
                categoryStats['modern_amenities'].total += review.modern_amenities;
                categoryStats['modern_amenities'].count += 1;
            }
            if (review.value !== null) {
                categoryStats['value'] = categoryStats['value'] || {
                    total: 0,
                    count: 0,
                };
                categoryStats['value'].total += review.value;
                categoryStats['value'].count += 1;
            }
        });
        const topCategories = Object.keys(categoryStats)
            .map((category) => ({
            category,
            rating: categoryStats[category].total / categoryStats[category].count,
        }))
            .sort((a, b) => b.rating - a.rating); // Sort by highest rating first
        return {
            totalReviews,
            averageRating: parseFloat(averageRating.toFixed(1)), // Keep one decimal place
            totalApprovedReviews,
            totalPendingReviews,
            topCategories: topCategories.slice(0, 2), // Return top 2 categories
        };
    }
}
exports.HostawayService = HostawayService;
