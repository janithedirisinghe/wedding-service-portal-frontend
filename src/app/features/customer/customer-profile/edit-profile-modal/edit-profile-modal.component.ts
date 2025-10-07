import { Component, EventEmitter, Input, OnInit, OnChanges, Output, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerDetails } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { VendorTypeService, VendorType } from '../../../admin/services/vendor-type.service';

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.scss']
})
export class EditProfileModalComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() profile: CustomerDetails | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() profileUpdated = new EventEmitter<CustomerDetails>();

  editForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  userId: number | null = null;
  selectedProfileImage: File | null = null;
  profileImagePreview: string | null = null;
  vendorTypes: VendorType[] = [];
  loadingVendorTypes: boolean = false;

  budgetOptions = [
    'Under Rs 5,000',
    'Rs 5,000 - Rs 10,000',
    'Rs 10,000 - Rs 15,000',
    'Rs 15,000 - Rs 25,000',
    'Rs 25,000 - Rs 50,000',
    'Over Rs 50,000'
  ];

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private authService: AuthService,
    private vendorTypeService: VendorTypeService
  ) {
    this.editForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadVendorTypes();
    if (this.profile) {
      this.populateForm();
    }
  }

  ngOnChanges(): void {
    if (this.profile) {
      this.populateForm();
    }
  }

  loadVendorTypes(): void {
    this.loadingVendorTypes = true;
    this.vendorTypeService.getActiveVendorTypes().subscribe({
      next: (vendorTypes: VendorType[]) => {
        this.vendorTypes = vendorTypes;
        this.loadingVendorTypes = false;
        console.log('Loaded vendor types:', vendorTypes);
      },
      error: (error) => {
        console.error('Error loading vendor types:', error);
        this.loadingVendorTypes = false;
        // Fallback to hardcoded options if API fails
        this.vendorTypes = [
          { vendorTypeName: 'Photography', isActive: true },
          { vendorTypeName: 'Videography', isActive: true },
          { vendorTypeName: 'Catering', isActive: true },
          { vendorTypeName: 'Venue', isActive: true },
          { vendorTypeName: 'Decoration', isActive: true },
          { vendorTypeName: 'Music/DJ', isActive: true },
          { vendorTypeName: 'Flowers', isActive: true },
          { vendorTypeName: 'Transportation', isActive: true },
          { vendorTypeName: 'Wedding Cake', isActive: true },
          { vendorTypeName: 'Planning Services', isActive: true }
        ];
      }
    });
  }

  // Keyboard navigation support
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (!this.isOpen) return;
    
    if (event.key === 'Escape') {
      this.onClose();
    } else if (event.key === 'Enter' && event.ctrlKey) {
      // Ctrl+Enter to submit
      event.preventDefault();
      if (this.editForm.valid) {
        this.onSubmit();
      }
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      bio: ['', [Validators.maxLength(500)]],
      address: ['', [Validators.maxLength(100)]],
      city: ['', [Validators.maxLength(50)]],
      country: ['', [Validators.maxLength(50)]],
      weddingDate: [''],
      budget: [''],
      preferredVendorTypes: [[]]
    });
  }

  private populateForm(): void {
    if (this.profile) {
      this.editForm.patchValue({
        firstName: this.profile.firstName || '',
        lastName: this.profile.lastName || '',
        phoneNumber: this.profile.phoneNumber || '',
        bio: this.profile.bio || '',
        address: this.profile.address || '',
        city: this.profile.city || '',
        country: this.profile.country || '',
        weddingDate: this.profile.weddingDate ? new Date(this.profile.weddingDate).toISOString().split('T')[0] : '',
        budget: this.profile.budget || '',
        preferredVendorTypes: this.profile.preferredVendorTypes || []
      });
      
      // Set profile image preview if exists
      if (this.profile.profileImageUrl) {
        this.profileImagePreview = this.profile.profileImageUrl;
      }
    }
  }

  onProfileImageSelect(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      // Validate file size (max 1MB to match backend limits)
      const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
      if (file.size > maxSizeInBytes) {
        this.errorMessage = `Profile image size should not exceed 1MB. Current file size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`;
        // Reset file input
        const fileInput = event.target as HTMLInputElement;
        fileInput.value = '';
        return;
      }

      // Validate file type more strictly
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        this.errorMessage = 'Please select a valid image file (JPEG, PNG, GIF, or WebP)';
        // Reset file input
        const fileInput = event.target as HTMLInputElement;
        fileInput.value = '';
        return;
      }

      this.selectedProfileImage = file;
      this.errorMessage = '';

      console.log('Selected image:', {
        name: file.name,
        size: file.size,
        type: file.type,
        sizeInMB: (file.size / (1024 * 1024)).toFixed(2)
      });

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.errorMessage = 'Please select a valid image file';
      // Reset file input
      const fileInput = event.target as HTMLInputElement;
      fileInput.value = '';
    }
  }

  removeProfileImage(): void {
    this.selectedProfileImage = null;
    this.profileImagePreview = this.profile?.profileImageUrl || null;
    
    // Reset file input
    const fileInput = document.getElementById('profileImageInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  hasProfileImageChanged(): boolean {
    return this.selectedProfileImage !== null;
  }

  onVendorTypeChange(event: any, vendorType: VendorType): void {
    const currentTypes = this.editForm.get('preferredVendorTypes')?.value || [];
    if (event.target.checked) {
      if (!currentTypes.includes(vendorType.vendorTypeName)) {
        this.editForm.patchValue({
          preferredVendorTypes: [...currentTypes, vendorType.vendorTypeName]
        });
      }
    } else {
      this.editForm.patchValue({
        preferredVendorTypes: currentTypes.filter((type: string) => type !== vendorType.vendorTypeName)
      });
    }
  }

  isVendorTypeSelected(vendorType: VendorType): boolean {
    const selectedTypes = this.editForm.get('preferredVendorTypes')?.value || [];
    return selectedTypes.includes(vendorType.vendorTypeName);
  }

  onSubmit(): void {
    if (this.editForm.valid && this.profile) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = this.editForm.value;
      const updateData: Partial<CustomerDetails> = {
        ...formData,
        weddingDate: formData.weddingDate ? new Date(formData.weddingDate) : undefined
      };
      
      this.userId = this.authService.getUserId();
      
      console.log('Submit form data:', {
        userId: this.userId,
        updateData,
        hasImage: !!this.selectedProfileImage,
        imageName: this.selectedProfileImage?.name,
        imageSize: this.selectedProfileImage?.size
      });

      if (!this.userId) {
        this.isLoading = false;
        this.errorMessage = 'User authentication error. Please log in again.';
        return;
      }

      // Choose service method based on whether image is selected
      const updateObservable = this.selectedProfileImage 
        ? this.customerService.updateCustomerProfileWithImage(this.userId, updateData, this.selectedProfileImage)
        : this.customerService.updateCustomerProfile(this.userId, updateData);

      updateObservable.subscribe({
        next: (updatedProfile: CustomerDetails) => {
          console.log('Profile updated successfully:', updatedProfile);
          this.isLoading = false;
          this.successMessage = 'Profile updated successfully!';
          this.profileUpdated.emit(updatedProfile);
          
          // Close modal after a brief delay to show success message
          setTimeout(() => {
            this.onClose();
          }, 1500);
        },
        error: (error) => {
          console.error('Full error object:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          console.error('Error details:', error.error);
          
          this.isLoading = false;
          
          // Handle different types of errors
          if (error.status === 403) {
            this.errorMessage = 'Access denied. Please check your authentication or try logging in again.';
          } else if (error.status === 401) {
            this.errorMessage = 'Authentication failed. Please log in again.';
          } else if (error.status === 413) {
            this.errorMessage = 'File too large. Please choose a smaller image (max 1MB).';
          } else if (error.status === 415) {
            this.errorMessage = 'Unsupported file type. Please use a valid image format.';
          } else if (error.message && error.message.includes('MaxUploadSizeExceededException')) {
            this.errorMessage = 'File size exceeds server limit. Please choose a smaller image (max 1MB).';
          } else if (error.error && typeof error.error === 'string' && error.error.includes('upload size')) {
            this.errorMessage = 'File size exceeds server limit. Please choose a smaller image (max 1MB).';
          } else {
            this.errorMessage = error.error?.message || `Failed to update profile. Error: ${error.status || 'Unknown'}`;
          }
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.editForm.controls).forEach(key => {
      const control = this.editForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.editForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldDisplayName(fieldName)} cannot exceed ${field.errors['maxlength'].requiredLength} characters`;
      }
      if (field.errors['pattern']) {
        if (fieldName === 'phoneNumber') {
          return 'Please enter a valid phone number (e.g., +1234567890)';
        }
        return `Please enter a valid ${this.getFieldDisplayName(fieldName).toLowerCase()}`;
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name',
      phoneNumber: 'Phone Number',
      bio: 'Bio',
      address: 'Address',
      city: 'City',
      country: 'Country'
    };
    return fieldNames[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.editForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.editForm.get(fieldName);
    return !!(field?.valid && field.touched && field.value);
  }

  getFormValidationSummary(): string[] {
    const errors: string[] = [];
    Object.keys(this.editForm.controls).forEach(key => {
      const control = this.editForm.get(key);
      if (control?.invalid && control.touched) {
        const error = this.getFieldError(key);
        if (error) {
          errors.push(error);
        }
      }
    });
    return errors;
  }

  onClose(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = false;
    this.selectedProfileImage = null;
    this.profileImagePreview = null;
    this.editForm.reset();
    this.closeModal.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget && !this.isLoading) {
      this.onClose();
    }
  }

  // Utility method to focus on first invalid field
  private focusFirstInvalidField(): void {
    const firstInvalidField = document.querySelector('.border-red-500') as HTMLElement;
    if (firstInvalidField) {
      firstInvalidField.focus();
    }
  }

  // Method to prevent form submission on Enter key in input fields
  onInputKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && event.target instanceof HTMLInputElement) {
      event.preventDefault();
      // Move to next input field
      const inputs = Array.from(document.querySelectorAll('input, textarea, select')) as HTMLElement[];
      const currentIndex = inputs.indexOf(event.target);
      if (currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1].focus();
      }
    }
  }
}
