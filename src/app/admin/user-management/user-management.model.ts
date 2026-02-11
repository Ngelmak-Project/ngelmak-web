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
