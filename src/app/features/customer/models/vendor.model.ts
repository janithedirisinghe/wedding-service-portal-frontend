export interface BackendVendor {
  venderId: number;
  businessName: string;
  availability: string;
  location: string;
  BRN: string;
  country: string;
  venType: string;
  bio: string;
  telNo: string;
  profileImageUrl?: string;
  isActive?: boolean;
  verify?: boolean;
  user?: {
    userId: number;
    username: string;
    email: string;
  };
  services?: any[];
  followers?: any[];
}

export interface FollowingResponse {
  success: boolean;
  followingCount: number;
  following: BackendVendor[];
  followingSummaries?: {
    vendorId: number;
    businessName: string;
    profileImageUrl?: string;
    followerCount?: number;
    reviewCount?: number;
    averageRating?: number;
  }[];
  message?: string;
}

// Utility function to validate and fix backend vendor data
export function validateBackendVendor(vendor: any): BackendVendor | null {
  if (!vendor || typeof vendor !== 'object') {
    return null;
  }

  // Check for required fields
  if (!vendor.venderId || !vendor.businessName) {
    return null;
  }

  return {
    venderId: vendor.venderId,
    businessName: vendor.businessName || '',
    availability: vendor.availability || 'available',
    location: vendor.location || vendor.Location || '',
    BRN: vendor.BRN || '',
    country: vendor.country || vendor.Country || '',
    venType: vendor.venType || vendor.VenType || '',
    bio: vendor.bio || '',
    telNo: vendor.telNo || '',
  profileImageUrl: vendor.profileImageUrl || vendor.profile_image_url || '',
  isActive: typeof vendor.isActive === 'boolean' ? vendor.isActive : (vendor.is_active ?? true),
  verify: typeof vendor.verify === 'boolean' ? vendor.verify : (vendor.Verify ?? false),
    user: vendor.user || undefined,
    services: vendor.services || [],
    followers: vendor.followers || []
  };
}

// Utility function to convert backend vendor to frontend vendor
export function convertToFrontendVendor(
  backendVendor: BackendVendor,
  summary?: { followerCount?: number; reviewCount?: number; averageRating?: number; profileImageUrl?: string }
): import('../vendor-search/vendor-search.component').Vendor {
  return {
    id: backendVendor.venderId.toString(),
    businessName: backendVendor.businessName,
    vendorType: backendVendor.venType,
    location: backendVendor.location,
    country: backendVendor.country,
    averageRating: summary?.averageRating ?? 0,
    reviewCount: summary?.reviewCount ?? 0,
    followerCount: summary?.followerCount ?? (backendVendor.followers ? backendVendor.followers.length : 0),
    startingPrice: 0,
    bio: backendVendor.bio,
    availability: backendVendor.availability === 'available' ? 'available' : 'busy',
    isFavorite: true,
    image: summary?.profileImageUrl || backendVendor.profileImageUrl || undefined,
    verify: backendVendor.verify,
    isActive: backendVendor.isActive
  };
}
