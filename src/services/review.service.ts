import * as fs from 'fs';
import * as path from 'path';
import { HostawayService } from './HostawayService';
import { GooglePlacesService } from './GooglePlacesService';
import {
  NormalizedReview,
  HostawayReview,
  ReviewFilter,
  ReviewStats,
} from '../interfaces/review.interface';
import {
  GooglePlaceDetails,
  GoogleReview,
} from '../interfaces/GooglePlaces.interface';

interface PersistedApprovalStatus {
  [reviewId: number]: boolean;
}

export class ReviewService {
  private reviews: NormalizedReview[] = [];
  private approvalStatusesPath: string;
  private approvalStatuses: PersistedApprovalStatus = {};

  constructor() {
    // Set path for the approval statuses JSON file
    this.approvalStatusesPath = path.join(
      process.cwd(),
      'approved-reviews.json'
    );
    this.loadApprovalStatuses();
    this.initializeReviews();
  }

  private loadApprovalStatuses(): void {
    try {
      if (fs.existsSync(this.approvalStatusesPath)) {
        const data = fs.readFileSync(this.approvalStatusesPath, 'utf-8');
        this.approvalStatuses = JSON.parse(data);
      } else {
        this.approvalStatuses = {};
      }
    } catch (error) {
      console.error('Error loading approval statuses:', error);
      this.approvalStatuses = {};
    }
  }

  private saveApprovalStatuses(): void {
    try {
      fs.writeFileSync(
        this.approvalStatusesPath,
        JSON.stringify(this.approvalStatuses, null, 2),
        'utf-8'
      );
    } catch (error) {
      console.error('Error saving approval statuses:', error);
    }
  }

  private mergeApprovalStatuses(
    reviews: NormalizedReview[]
  ): NormalizedReview[] {
    return reviews.map((review) => {
      if (this.approvalStatuses.hasOwnProperty(review.id)) {
        return {
          ...review,
          isApprovedForDisplay: this.approvalStatuses[review.id],
        };
      }
      return review;
    });
  }

  private async initializeReviews() {
    try {
      // Fetch and normalize Hostaway reviews
      const hostawayRawReviews: HostawayReview[] =
        await HostawayService.fetchReviews();
      const normalizedHostawayReviews: NormalizedReview[] =
        HostawayService.normalizeReviews(hostawayRawReviews);

      // Merge with persisted approval statuses
      this.reviews = this.mergeApprovalStatuses(normalizedHostawayReviews);
    } catch (error) {
      console.error('Error initializing reviews:', error);
    }
  }

  public async getHostawayReviews(
    listingId?: string
  ): Promise<NormalizedReview[]> {
    const hostawayRawReviews: HostawayReview[] =
      await HostawayService.fetchReviews(listingId);
    const normalizedReviews =
      HostawayService.normalizeReviews(hostawayRawReviews);
    // Merge with persisted approval statuses
    return this.mergeApprovalStatuses(normalizedReviews);
  }

  public async getGoogleReviews(
    placeId: string,
    listingName: string
  ): Promise<NormalizedReview[]> {
    const googlePlaceDetails: GooglePlaceDetails =
      await GooglePlacesService.fetchReviews(placeId);
    return GooglePlacesService.normalizeReviews(
      googlePlaceDetails.reviews,
      placeId,
      listingName
    );
  }

  public async searchGooglePlaces(query: string) {
    return GooglePlacesService.searchPlace(query);
  }

  public getNormalizedReviews(filter?: ReviewFilter): NormalizedReview[] {
    let filteredReviews = [...this.reviews];

    if (filter) {
      if (filter.listingId) {
        const normalizedListingId = filter.listingId
          .toLowerCase()
          .replace(/\s+/g, '-');
        filteredReviews = filteredReviews.filter(
          (review) =>
            review.listingName.toLowerCase().replace(/\s+/g, '-') ===
            normalizedListingId
        );
      }
      if (filter.channel) {
        filteredReviews = filteredReviews.filter(
          (review) => review.channel === filter.channel
        );
      }
      if (filter.minRating) {
        filteredReviews = filteredReviews.filter(
          (review) =>
            review.overallRating && review.overallRating >= filter.minRating!
        );
      }
      if (filter.maxRating) {
        filteredReviews = filteredReviews.filter(
          (review) =>
            review.overallRating && review.overallRating <= filter.maxRating!
        );
      }
      if (filter.startDate) {
        filteredReviews = filteredReviews.filter(
          (review) => new Date(review.date) >= new Date(filter.startDate!)
        );
      }
      if (filter.endDate) {
        filteredReviews = filteredReviews.filter(
          (review) => new Date(review.date) <= new Date(filter.endDate!)
        );
      }
      if (filter.status) {
        // Assuming filter.status maps to isApprovedForDisplay
        const isApproved = filter.status === 'published';
        filteredReviews = filteredReviews.filter(
          (review) => review.isApprovedForDisplay === isApproved
        );
      }
    }

    return filteredReviews;
  }

  public updateReviewApprovalStatus(
    id: number, // Changed type from string to number
    isApproved: boolean
  ): NormalizedReview | null {
    // Update the in-memory review if it exists
    const reviewIndex = this.reviews.findIndex(
      (review) => review.id === Number(id)
    ); // Convert id to number
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

  public async getReviewStats(filter?: ReviewFilter): Promise<ReviewStats> {
    let reviewsToAnalyze: NormalizedReview[];

    // If a listingId filter is provided, fetch fresh reviews for that listing
    // This ensures we get the latest data with persisted approval statuses
    if (filter?.listingId) {
      const freshReviews = await this.getHostawayReviews(filter.listingId);
      reviewsToAnalyze = freshReviews;
    } else {
      // Otherwise, use the in-memory reviews
      reviewsToAnalyze = this.getNormalizedReviews(filter);
    }

    // HostawayService already has a calculateStats method, which is more comprehensive.
    // We should either unify the stats calculation or use HostawayService's method if only Hostaway reviews are considered for stats.
    // For now, I'll provide a basic calculation.
    return HostawayService.calculateStats(reviewsToAnalyze);
  }
}
