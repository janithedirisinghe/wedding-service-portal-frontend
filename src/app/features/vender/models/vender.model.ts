export interface venderDetails{
  vendorId: number;
  businessName: string;
  availability: string | null;
  bio: string;
  telNo: string;
  services: Service[];
  admin: string | null;
  location: string;
  country: string;
  brn: string;
  VenType: string;
  profileImageUrl?: string; // Optional profile image URL
}

export interface Service {
    serviceId: number;
    name: string | null;
    description: string | null;
    pricing: number | null;
  }