export interface CustomerDetails {
  customerId: number;
  
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  phoneNumber: string;
  bio?: string;
  profileImageUrl?: string; // Profile image URL

  // Address Information
  address?: string;
  city?: string;
  country?: string;
  location?: string; // Keep for backward compatibility

  // Wedding Information
  weddingDate?: Date;
  budget?: string; // Budget ranges as string

  // Vendor Preferences
  preferredVendorTypes?: string[];

  // User Information
  userName?: string;
  userEmail: string;
}

export interface CustomerStats {
  favoritesCount: number;
  reviewsCount: number;
  bookingsCount: number;
}
