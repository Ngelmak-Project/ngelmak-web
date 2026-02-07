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
  constructor(
    public login?: string,
    public firstName?: string,
    public lastName?: string,
    public email?: string,
    public activated?: boolean,
    public imageUrl?: string,
    public langKey?: string,
    public createdDate?: Date,
    public lastModifiedBy?: string,
    public certificationStatus?: CertificationStatus,
    public lastModifiedDate?: Date,
    public authorities?: string[],
  ) {}
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  entity: string;
  errorKey: string;
}
