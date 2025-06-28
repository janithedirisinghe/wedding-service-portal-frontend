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

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.postForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(10)]],
      location: ['', [Validators.required, Validators.minLength(3)]],
      date: ['', [Validators.required]]
    });
  }

  onFileSelect(event: any): void {
    const files = event.target.files;
    if (files) {
      this.selectedFiles = Array.from(files);
    }
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

    const postData: PostModel = {
      ...this.postForm.value,
      vendorId: vendorId
    };

    this.postService.createPost(postData).subscribe({
      next: (response: any) => {
        console.log('Post created successfully:', response);
        this.postForm.reset();
        this.selectedFiles = [];
        this.isSubmitting = false;
        // TODO: Add success notification
      },
      error: (error: any) => {
        console.error('Error creating post:', error);
        this.isSubmitting = false;
        // TODO: Add error notification
      }
    });
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }
}
