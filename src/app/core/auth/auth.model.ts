export enum CertificationStatus {
  REJECTED = 'REJECTED',

  REQUESTED = 'REQUESTED',

  CERTIFIED = 'CERTIFIED',
}

export enum DocType {
  NATIONAL_ID_CARD = 'NATIONAL_ID_CARD',

  PASSPORT = 'PASSPORT',
}

export class Authentication {
  login?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  isActivated?: boolean;
  imageUrl?: string;
  langKey?: string;
  darkModeEnabled?: boolean;
  createdDate?: Date;
  lastModifiedBy?: string;
  certificationStatus?: CertificationStatus;
  lastModifiedDate?: Date;
  authorities?: string[];
}

export interface LoginResponseDTO {
  accessToken?: string;
  refreshToken?: string;
  refreshTokenExpiresAt?: string;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  entity: string;
  errorKey: string;
}
