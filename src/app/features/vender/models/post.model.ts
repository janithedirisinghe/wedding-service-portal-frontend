export interface PostModel {
    postId?: number;
    
    content : string;

    location: string;

    date: string;

    vendorId: number;

    itemUrls: string[];
}