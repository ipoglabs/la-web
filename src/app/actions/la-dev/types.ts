export interface LaDevUser {
  id: string;
  userId: string;
  fullName: string;
  email?: string;
  isEmailVerified: boolean;
  primaryNumber?: string;
  isPrimaryNumberVerified: boolean;
  dateOfBirth?: string;
  locality?: string;
  provider: string;
  accountStatus: string;
  isFullyRegistered: boolean;
  isNewUser: boolean;
  createdAt: string;
}
