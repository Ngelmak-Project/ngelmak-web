import { ITicket } from 'app/entities/models/nk-ticket.model';

export interface IReview {
  id?: number;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  content?: string | null; // Review text or moderator note
  status?: 'OPEN' | 'CLOSED' | 'PENDING' | null; // Status of the review, e.g., APPROVED, REJECTED, PENDING
  visibility?: 'PUBLIC' | 'MODERATOR' | null; // Who can see the review. If MODERATOR, then only Moderators and Admin can see it.
  dueAt?: Date | null; // When the review must be handled before notifications trigger
  ticket?: ITicket | null; // The ticket being reviewed
  replyTo?: IReview | null; // Threading: replies to previous reviews
  author?: number | null; // Who performed the review (user/moderator/admin)
  targetUser?: number | null; // Who the review concerns (the user whose action was reported)
  isAuthor?: boolean; // Add DTO-specific property
}
