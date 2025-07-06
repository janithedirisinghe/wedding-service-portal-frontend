export interface TimelinePostDTO {
  postId: number;
  content: string;
  location?: string;
  date: string;
  itemUrls?: string[];
  
  // Vendor information
  vendorId: number;
  vendorName: string;
  vendorEmail: string;
  vendorProfileImage?: string;
  vendorServiceType: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // UI properties
  isFollowing?: boolean;
}

export interface TimelineFilter {
  page?: number;
  size?: number;
  customerId?: number;
}

export enum TimelineType {
  GENERAL = 'general',
  FOLLOWING = 'following',
  RECENT = 'recent',
  EXPLORE = 'explore',
  RANDOM = 'random'
}
