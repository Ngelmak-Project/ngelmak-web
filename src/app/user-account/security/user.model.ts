export interface UserUpdateDTO {
  firstName?: string | null;
  lastName?: string | null;
  langKey?: string | null;
}

export interface PasswordChangeDTO {
  currentPassword?: string | null;
  newPassword?: string | null;
}

export interface LoginUpdateDTO {
  login?: string | null;
}

export interface EmailUpdateDTO {
  email?: string | null;
}
