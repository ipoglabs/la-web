export type ProfileUser = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  residency: string;
  email: string;
  primaryNumber: string;
  secondaryNumber1: string;
  secondaryNumber2: string;
  role: string;
  image: string;
  marketingOptIn: boolean;
  locality: string;
  address: {
    postalCode: string;
  };
};