export interface SuggestedVendorDTO {
  vendorId: number;
  businessName: string;
  venType: string;
  location: string;
  country: string;
  bio: string;
  telNo: string;
  userEmail: string;
  averageRating: number;
  reviewCount: number;
  minServicePrice: number;
  maxServicePrice: number;
  services: ServiceDTO[];
  matchReason: string;
  popularityScore: number;
  locationMatch: string;
}

export interface ServiceDTO {
  serviceId: number;
  serviceName: string;
  description: string;
  price: number;
  duration: string;
}

export interface VendorSuggestionResponseDTO {
  suggestedVendors: SuggestedVendorDTO[];
  totalSuggestions: number;
  message: string;
  appliedFilters: string[];
}
