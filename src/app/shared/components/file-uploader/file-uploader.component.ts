import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../../../features/vender/services/post.service';
import { PostModel } from '../../../features/vender/models/post.model';
import { CreatePostDTO } from '../../../features/vender/models/create-post.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss'
})
export class FileUploaderComponent implements OnInit {
  postForm!: FormGroup;
  isSubmitting: boolean = false;
  selectedFiles: File[] = [];
  isDragOver: boolean = false;
  imagePreviewUrls: string[] = [];
  isExpanded: boolean = false;
  currentDate: string = '';
  currentTime: string = '';
  
  // Error handling
  errorMessage: string | null = null;
  successMessage: string | null = null;
  fileErrors: string[] = [];

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.setCurrentDateTime();
    this.postForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(10)]],
      location: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  private setCurrentDateTime(): void {
    const now = new Date();
    this.currentDate = now.toISOString().split('T')[0]; // For display only
    this.currentTime = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }); // For display only
  }

  expandPost(): void {
    this.isExpanded = true;
  }

  collapsePost(): void {
    if (this.postForm.get('content')?.value === '' && this.selectedFiles.length === 0) {
      this.isExpanded = false;
    }
  }

  onContentInput(event: any): void {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
  }

  get hasImages(): boolean {
    return this.selectedFiles.length > 0;
  }

  get canAddMoreImages(): boolean {
    return this.selectedFiles.length < 10;
  }

  onFileSelect(event: any): void {
    const files = event.target.files;
    if (files) {
      this.addFiles(Array.from(files));
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files) {
      this.addFiles(Array.from(files));
    }
  }

  private addFiles(files: File[]): void {
    // Clear previous file errors
    this.fileErrors = [];
    
    // Validate files using the service
    const validation = this.postService.validateImageFiles([...this.selectedFiles, ...files]);
    
    if (!validation.isValid) {
      this.fileErrors = validation.errors;
      return;
    }
    
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    // Limit to maximum 10 images
    const remainingSlots = 10 - this.selectedFiles.length;
    const filesToAdd = imageFiles.slice(0, remainingSlots);
    
    if (filesToAdd.length < imageFiles.length) {
      this.fileErrors.push(`Only ${filesToAdd.length} images were added. Maximum 10 images allowed.`);
    }
    
    this.selectedFiles.push(...filesToAdd);
    
    // Generate preview URLs
    filesToAdd.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviewUrls.push(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  onSubmit(): void {
    if (this.postForm.invalid || this.isSubmitting) {
      return;
    }

    // Clear previous messages
    this.errorMessage = null;
    this.successMessage = null;
    this.fileErrors = [];

    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'User ID not found. Please log in again.';
      return;
    }

    // Create post data using CreatePostDTO structure
    const postData: CreatePostDTO = {
      content: this.postForm.value.content,
      location: this.postForm.value.location,
      date: new Date().toISOString(),
      userId: Number(userId)
    };

    // Validate post data
    const postValidation = this.postService.validatePostData(postData);
    if (!postValidation.isValid) {
      this.errorMessage = postValidation.errors.join(', ');
      return;
    }

    // Validate images
    const imageValidation = this.postService.validateImageFiles(this.selectedFiles);
    if (!imageValidation.isValid) {
      this.fileErrors = imageValidation.errors;
      return;
    }

    this.isSubmitting = true;

    // Use the new structured method for creating posts with images
    this.postService.createPostWithImages(postData, this.selectedFiles).subscribe({
      next: (response: PostModel) => {
        console.log('Post created successfully:', response);
        this.successMessage = 'Post created successfully!';
        this.resetForm();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (error: any) => {
        console.error('Error creating post:', error);
        this.isSubmitting = false;
        
        // Handle different error types
        if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please check your internet connection.';
        } else if (error.status === 400) {
          this.errorMessage = 'Invalid post data. Please check your input.';
        } else if (error.status === 401) {
          this.errorMessage = 'You are not authorized. Please log in again.';
        } else if (error.status === 413) {
          this.errorMessage = 'File size too large. Please reduce image sizes.';
        } else if (error.status === 500) {
          this.errorMessage = 'Server error occurred. Please try again later.';
        } else {
          this.errorMessage = `Error creating post: ${error.status}`;
        }
      }
    });
  }

  private resetForm(): void {
    this.postForm.reset();
    this.selectedFiles = [];
    this.imagePreviewUrls = [];
    this.isSubmitting = false;
    this.isExpanded = false;
    this.errorMessage = null;
    this.fileErrors = [];
    this.setCurrentDateTime(); // Update time for next post
  }


  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.imagePreviewUrls.splice(index, 1);
  }

  clearAllFiles(): void {
    this.selectedFiles = [];
    this.imagePreviewUrls = [];
    this.fileErrors = [];
  }

  // Method to clear error messages manually
  clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.fileErrors = [];
  }
}
