import { Request, Response } from 'express';
import { ReviewService } from '../services/review.service';
import { ReviewFilter } from '../interfaces/review.interface';
import { mockHostawayReviews } from '../constants/mockHostawayReviews';

const reviewService = new ReviewService();

export class ReviewController {
  public static async getHostawayReviews(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const listingId = req.query.listingId as string;
      const reviews = await reviewService.getHostawayReviews(listingId);

      res.status(200).json(reviews);
    } catch (error) {
      console.error('Error fetching Hostaway reviews:', error);
      res.status(500).json({
        message: 'Internal server error while fetching Hostaway reviews.',
      });
    }
  }

  public static async getGoogleReviews(
    req: Request,
    res: Response
  ): Promise<void> {
    const { placeId, listingName } = req.query;

    if (!placeId || typeof placeId !== 'string') {
      res.status(400).json({
        message: 'Invalid request: placeId is required and must be a string.',
      });
      return;
    }
    if (!listingName || typeof listingName !== 'string') {
      res.status(400).json({
        message:
          'Invalid request: listingName is required and must be a string.',
      });
      return;
    }

    try {
      const reviews = await reviewService.getGoogleReviews(
        placeId,
        listingName
      );
      res.status(200).json(reviews);
    } catch (error) {
      console.error('Error fetching Google reviews:', error);
      res.status(500).json({
        message: 'Internal server error while fetching Google reviews.',
      });
    }
  }

  public static async searchGooglePlaces(
    req: Request,
    res: Response
  ): Promise<void> {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      res.status(400).json({
        message: 'Invalid request: query is required and must be a string.',
      });
      return;
    }

    try {
      const results = await reviewService.searchGooglePlaces(query);
      res.status(200).json(results);
    } catch (error) {
      console.error('Error searching Google places:', error);
      res.status(500).json({
        message: 'Internal server error while searching Google places.',
      });
    }
  }

  public static async getReviewStats(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const filter: ReviewFilter = req.query as ReviewFilter; // Assuming query params match ReviewFilter interface
      const stats = await reviewService.getReviewStats(filter);
      res.status(200).json(stats);
    } catch (error) {
      console.error('Error fetching review statistics:', error);
      res.status(500).json({
        message: 'Internal server error while fetching review statistics.',
      });
    }
  }

  public static async updateReviewApprovalStatus(
    req: Request,
    res: Response
  ): Promise<void> {
    const reviewId = req.params.id; // Changed to string
    const { isApproved } = req.body;

    if (typeof reviewId !== 'string' || typeof isApproved !== 'boolean') {
      res.status(400).json({
        message:
          'Invalid request: review ID must be a string and isApproved must be a boolean.',
      });
      return;
    }

    try {
      const updatedReview = reviewService.updateReviewApprovalStatus(
        Number(reviewId), // Convert to number
        isApproved
      );
      if (updatedReview) {
        res.status(200).json(updatedReview);
      } else {
        res.status(404).json({ message: 'Review not found.' });
      }
    } catch (error) {
      console.error(
        `Error updating approval status for review ${reviewId}:`,
        error
      );
      res.status(500).json({
        message: 'Internal server error while updating review approval status.',
      });
    }
  }

  static async getProperties(req: Request, res: Response) {
    try {
      // Get unique properties from mock data
      const properties = Array.from(
        new Set(
          mockHostawayReviews.result
            .filter(
              (review) => review.listingName && review.listingName.trim() !== ''
            ) // Ensure listingName is not empty or just whitespace
            .map((review) => ({
              id: review.listingName.toLowerCase().replace(/\\s+/g, '-'),
              name: review.listingName,
            }))
        )
      );

      res.json({
        status: 'success',
        data: {
          properties,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch properties',
      });
    }
  }
}
