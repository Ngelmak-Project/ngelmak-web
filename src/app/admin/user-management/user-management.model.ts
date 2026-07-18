import { CertificationStatus } from 'app/core/auth/auth.model';

export interface IUser {
  id: number;
  login: string;
  email: string;
  firstName?: string;
  lastName?: string;
  activated: boolean;
  blocked: boolean;
  langKey?: string;
  imageUrl?: string;
  lastModifiedDate?: string; // ISO 8601 format
  createdDate?: string;
  deletedDate?: string | null;
  certifiedDate?: string | null;
  certificationStatus: CertificationStatus;
  docType?: DocType;
  timezone?: string;
  darkModeEnabled: boolean;
  authorities: Authority[];
}

export interface Authority {
  name: string;
}

export enum DocType {
  PASSPORT = 'PASSPORT',
  ID_CARD = 'ID_CARD',
  DRIVER_LICENSE = 'DRIVER_LICENSE',
}

/**
 * The ContactStatus enumeration.
 */
export enum ContactStatus {
  NEW,
  IN_PROGRESS,
  CLOSED,
}

export interface IContactMessage {
  id?: number;
  name?: string; // optional if anonymous allowed
  email?: string; // optional if anonymous allowed, but useful for support to reply
  subject?: string;
  message?: string;
  sentAt?: Date;
  status?: ContactStatus | string; // NEW, IN_PROGRESS, CLOSED
}
