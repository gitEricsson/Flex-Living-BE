import { HostawayReview } from "./review.interface";
export interface HostawayReviewCategory {
  category: string;
  rating: number;
}

export interface HostawayApiResponse {
  status: string;
  result: HostawayReview[];
}
