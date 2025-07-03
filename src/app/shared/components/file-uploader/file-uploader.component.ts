import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../../../features/vender/services/post.service';
import { PostModel } from '../../../features/vender/models/post.model';
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
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    // Limit to maximum 10 images
    const remainingSlots = 10 - this.selectedFiles.length;
    const filesToAdd = imageFiles.slice(0, remainingSlots);
    
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

    this.isSubmitting = true;

    const vendorId = this.authService.getUserId();
    if (!vendorId) {
      console.error('Vendor ID not found');
      this.isSubmitting = false;
      return;
    }

    // Use current date timestamp as the backend expects
    const postData = {
      ...this.postForm.value,
      vendorId: vendorId,
      date: new Date().toISOString() // Send current timestamp as date
    };

    const formData = new FormData();
    formData.append('post', new Blob([JSON.stringify(postData)], { type: 'application/json' }));

    this.selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    this.postService.createPost(formData).subscribe({
      next: (response: any) => {
        console.log('Post created successfully:', response);
        this.resetForm();
        // TODO: Add success notification
      },
      error: (error: any) => {
        console.error('Error creating post:', error);
        this.isSubmitting = false;
        // TODO: Add error notification
      }
    });
  }

  private resetForm(): void {
    this.postForm.reset();
    this.selectedFiles = [];
    this.imagePreviewUrls = [];
    this.isSubmitting = false;
    this.isExpanded = false;
    this.setCurrentDateTime(); // Update time for next post
  }


  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.imagePreviewUrls.splice(index, 1);
  }

  clearAllFiles(): void {
    this.selectedFiles = [];
    this.imagePreviewUrls = [];
  }
}
