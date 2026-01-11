export interface FollowRequest {
  userId: number;
  vendorId: number;
}

export interface FollowerDTO {
  followerId: number;
  customerId: number;
  vendorId: number;
  followedAt: string;
  // Add any other fields that might be in the FollowerDTO
}

export interface FollowResponse {
  success: boolean;
  message: string;
  data?: FollowerDTO;
}
