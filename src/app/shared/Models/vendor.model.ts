export interface Service {
  serviceId: number;
  name: string;
  description: string;
  pricing: number;
}

export interface Vendor {
  venderId: number;
  businessName: string;
  availability: string | null;
  location: string;
  brn: string;
  country: string;
  VenType: string; // Note: API uses VenType, not venType
  bio: string;
  telNo: string;
  profileImageUrl: string | null;
  isActive: boolean;
  verify: boolean;
  user?: any; // Can be expanded based on User entity if needed
  services?: Service[]; // Array of services
  admin?: any; // Can be expanded based on Admin entity if needed
  followers?: any[]; // Can be expanded based on Follower entity if needed
  chatRooms?: any[]; // Can be expanded based on ChatRoom entity if needed
}
