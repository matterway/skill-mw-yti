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
  services: Services[];
  streetAddress: string;
  officeNumber: string;
  buildingNumber: string;
  city: string;
  country: string;
  postalCode: string;
  totalDiscount: number;
  subTotal: number;
  total: number;
}
export interface Services {
  id: number;
  description: string;
  totalDays: string;
  discount: string;
  dailyRate: string;
  lineTotal: string;
}

export interface ServiceFormResult {
  button: string;
  data: {[key: string]: string};
}
