import type {
  HostawayReview,
  NormalizedReview,
  ReviewStats,
  ReviewCategory,
} from '../interfaces/review.interface';
import { mockHostawayReviews } from '../constants/mockHostawayReviews';

export class HostawayService {
  static async fetchReviews(listingId?: string): Promise<HostawayReview[]> {
    let reviewsToReturn = mockHostawayReviews.result;

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
  }

  static normalizeReviews(reviews: HostawayReview[]): NormalizedReview[] {
    return reviews.map((review) => {
      const cleanlinessRating =
        review.reviewCategory?.find((cat) => cat.category === 'cleanliness')
          ?.rating ?? null;
      const communicationRating =
        review.reviewCategory?.find((cat) => cat.category === 'communication')
          ?.rating ?? null;
      const respectHouseRulesRating =
        review.reviewCategory?.find(
          (cat) => cat.category === 'respect_house_rules'
        )?.rating ?? null;
      const location =
        review.reviewCategory?.find((cat) => cat.category === 'location')
          ?.rating ?? null;
      const noise =
        review.reviewCategory?.find((cat) => cat.category === 'noise')
          ?.rating ?? null;
      const amenities =
        review.reviewCategory?.find((cat) => cat.category === 'amenities')
          ?.rating ?? null;
      const decor =
        review.reviewCategory?.find((cat) => cat.category === 'decor')
          ?.rating ?? null;
      const modernAmenities =
        review.reviewCategory?.find(
          (cat) => cat.category === 'modern_amenities'
        )?.rating ?? null;
      const value =
        review.reviewCategory?.find((cat) => cat.category === 'value')
          ?.rating ?? null;

      const categoryRatings: (number | null)[] = [
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

      const overallRating =
        categoryRatings.length > 0
          ? Math.round(
              (categoryRatings as number[]).reduce(
                (sum, rating) => sum + rating,
                0
              ) / categoryRatings.length
            )
          : review.rating ?? 0; // Fallback to main rating if categories are not present, default to 0

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

  static calculateStats(reviews: NormalizedReview[]): ReviewStats {
    const totalReviews = reviews.length;

    const ratings = reviews
      .filter((r) => r.overallRating !== null)
      .map((r) => r.overallRating as number);

    const averageRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;

    const totalApprovedReviews = reviews.filter(
      (r) => r.isApprovedForDisplay
    ).length;
    const totalPendingReviews = reviews.filter(
      (r) => !r.isApprovedForDisplay
    ).length;

    const categoryStats: Record<string, { total: number; count: number }> = {};

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
        categoryStats['respect_house_rules'] = categoryStats[
          'respect_house_rules'
        ] || { total: 0, count: 0 };
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
        categoryStats['modern_amenities'] = categoryStats[
          'modern_amenities'
        ] || {
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
