export interface AdminCustomerDetailsDTO {
  // Primary keys and identifiers
  customerId: number;
  userId: number;
  
  // Basic user info
  firstName: string;
  lastName: string;
  userName: string;
  userEmail: string;
  phoneNumber: string;
  
  // Profile details
  profileImageUrl: string;
  isActive: boolean;
  dateOfBirth: string | null;
  bio: string;
  
  // Location information
  address: string;
  city: string;
  country: string;
  location: string | null;
  
  // Wedding related
  weddingDate: string | null;
  budget: string;
  preferredVendorTypes: string[];
  
  // Statistics
  followerCount: number;
  
  // UI helper fields (not from API)
  isDetailsOpen?: boolean;
}

export interface ToggleCustomerActiveDTO {
  customerId: number;
  isActive: boolean;
}
