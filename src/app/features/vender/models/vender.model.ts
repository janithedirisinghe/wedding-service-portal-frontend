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
    advancePercentage: number;
    bookBeforeDays: number;
    cancellationPolicy: string;
    coverImageUrl: string | null;
    createdAt: string | null;
    discountPercent: number;
    isAvailable: boolean;
    isDeleted: boolean;
    pricingModel: string;
    serviceAreaType: string;
    status: string;
    updatedAt: string;
}