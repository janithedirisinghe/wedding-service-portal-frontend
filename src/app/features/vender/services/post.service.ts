import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PostModel } from "../models/post.model";
import { CreatePostDTO, CreatePostRequest } from "../models/create-post.model";

@Injectable({
  providedIn: 'root'
})
export class PostService {
    private baseUrl = 'http://localhost:8080';

    constructor(private http: HttpClient){}

    createPost(postFormData: FormData): Observable<PostModel> {
    return this.http.post<PostModel>(`${this.baseUrl}/posts`, postFormData, {
      withCredentials: true
    });
}

    /**
     * Create a new post with images
     * @param postData - The post data (content, location, date, userId)
     * @param images - Array of image files to upload
     * @returns Observable containing the created post
     */
    createPostWithImages(postData: CreatePostDTO, images: File[]): Observable<PostModel> {
        const formData = new FormData();
        
        // Add post data as JSON blob (to match @RequestPart("post"))
        const postBlob = new Blob([JSON.stringify(postData)], { type: 'application/json' });
        formData.append('post', postBlob);
        
        // Add images to FormData (to match @RequestPart("images"))
        images.forEach((image) => {
            formData.append('images', image, image.name);
        });
        
        return this.http.post<PostModel>(`${this.baseUrl}/posts`, formData, {
            withCredentials: true
        });
    }

    /**
     * Create a post using the existing FormData method (for backward compatibility)
     * @param postFormData - FormData containing post data and images
     * @returns Observable containing the created post
     */
    createPostFormData(postFormData: FormData): Observable<PostModel> {
        return this.http.post<PostModel>(`${this.baseUrl}/posts`, postFormData, {
            withCredentials: true
        });
    }

    /**
     * Validate image files before upload
     * @param files - Array of files to validate
     * @returns Object with validation result and errors
     */
    validateImageFiles(files: File[]): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];
        const maxFileSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const maxFiles = 10;

        if (files.length === 0) {
            errors.push('At least one image is required');
        }

        if (files.length > maxFiles) {
            errors.push(`Maximum ${maxFiles} images allowed`);
        }

        files.forEach((file, index) => {
            if (!allowedTypes.includes(file.type)) {
                errors.push(`File ${index + 1}: Invalid file type. Allowed types: JPEG, PNG, GIF, WebP`);
            }

            if (file.size > maxFileSize) {
                errors.push(`File ${index + 1}: File size too large. Maximum size: 5MB`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate post data before submission
     * @param postData - The post data to validate
     * @returns Object with validation result and errors
     */
    validatePostData(postData: CreatePostDTO): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!postData.content || postData.content.trim().length < 10) {
            errors.push('Content must be at least 10 characters long');
        }

        if (!postData.location || postData.location.trim().length < 3) {
            errors.push('Location must be at least 3 characters long');
        }

        if (!postData.userId || postData.userId <= 0) {
            errors.push('Valid user ID is required');
        }

        if (!postData.date) {
            errors.push('Date is required');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

getPostsByVendorId(userId: number): Observable<PostModel[]> {
    return this.http.get<PostModel[]>(`${this.baseUrl}/posts/vendor/${userId}`, {
      withCredentials: true
    });
}

getPostsByVendorIdByVenderId(venderId: number): Observable<PostModel[]> {
    return this.http.get<PostModel[]>(`${this.baseUrl}/posts/vendorId/${venderId}`, {
      withCredentials: true
    });
}

}
