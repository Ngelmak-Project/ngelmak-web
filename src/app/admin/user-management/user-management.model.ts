import { CertificationStatus } from "app/core/auth/auth.model";

export interface UserManagementModel {
  id: number;
  login?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  activated?: boolean;
  blocked?: boolean;
  imageUrl?: string;
  langKey?: string;
  darkModeEnabled?: boolean;
  createdDate?: Date;
  lastModifiedBy?: string;
  certificationStatus?: CertificationStatus;
  lastModifiedDate?: Date;
  authorities?: string[];
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
