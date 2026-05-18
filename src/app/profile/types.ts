export type ProfileUser = {
  id: string;
  profileId: string;
  username: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  residency: string;
  email: string;
  primaryNumber: string;
  secondaryNumber1: string;
  secondaryNumber2: string;
  role: string;
  roleTitle?: string;
  roleDescription?: string;
  image: string;
  marketingOptIn: boolean;
  locality: string;
  address: {
    country: string;
    state: string;
    city: string;
    postalCode: string;
  };
};