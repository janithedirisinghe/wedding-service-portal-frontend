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
  message?: string;
}

// Utility function to validate and fix backend vendor data
function validateBackendVendor(vendor: any): BackendVendor | null {
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
    user: vendor.user || undefined,
    services: vendor.services || [],
    followers: vendor.followers || []
  };
}

// Utility function to convert backend vendor to frontend vendor
export function convertToFrontendVendor(backendVendor: BackendVendor): import('../vendor-search/vendor-search.component').Vendor {
  return {
    id: backendVendor.venderId.toString(),
    businessName: backendVendor.businessName,
    vendorType: backendVendor.venType,
    location: backendVendor.location,
    country: backendVendor.country,
    rating: 4.5, // Default rating since it's not in backend model
    reviewCount: 0, // Default review count
    followerCount: backendVendor.followers ? backendVendor.followers.length : 0,
    startingPrice: 0, // Default starting price
    bio: backendVendor.bio,
    availability: backendVendor.availability === 'available' ? 'available' : 'busy',
    isFavorite: true // Since this is for favorites, it's always true
  };
}
