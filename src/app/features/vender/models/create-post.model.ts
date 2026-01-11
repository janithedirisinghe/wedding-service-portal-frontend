export interface CreatePostDTO {
  content: string;
  location: string;
  date: string;
  userId: number;
}

export interface CreatePostRequest {
  content: string;
  location: string;
  date: string;
  userId: number;
  images?: File[]; // For handling multiple image files
}

export interface CreatePostFormData {
  content: string;
  location: string;
  date: string;
  userId: number;
  imageFiles: File[];
}
