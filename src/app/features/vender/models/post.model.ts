export interface PostModel {
    postId?: number;
    
    content : string;

    location: string;

    date: string;

    vendorId: number;

    userId?: number | null;

    vendorName?: string;

    vendorProfileImage?: string;

    itemUrls: string[];
}