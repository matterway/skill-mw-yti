export type Resolver<T> = (value: T) => void;

// Export types used across your skills here
export interface SkillData {
  // Example data
  id: number;
}

export interface PartnerData {
  companyName: string;
  primaryEmail: string;
  TaxId: string;
  contactPersonFirstName: string;
  contactPersonLastName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
  comments: string;
  streetAddress: string;
  officeNumber: string;
  buildingNumber: string;
  city: string;
  country: string;
  postalCode: string;
}
