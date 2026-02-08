import { ContactStatus } from '../enumerations/contact-status.model';

export interface IContactMessage {
  id?: number | null;
  email?: string | null; // optional if user is logged in
  subject?: string | null;
  message?: string | null;
  createdAt?: Date | null;
  status?: ContactStatus | null; // NEW, IN_PROGRESS, CLOSED
  userId?: number | null; // optional if anonymous allowed
}

export interface IContactMessageDTO {
  id?: number | null;
  email?: string | null; // optional if user is logged in
  subject?: string | null;
  message?: string | null;
  createdAt?: Date | null;
  status?: ContactStatus | null; // NEW, IN_PROGRESS, CLOSED
  userId?: number | null; // optional if anonymous allowed
}
