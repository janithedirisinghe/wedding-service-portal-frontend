import { Component, EventEmitter, Input, OnInit, OnChanges, Output, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerDetails } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';

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

  budgetOptions = [
    'Under $5,000',
    '$5,000 - $10,000',
    '$10,000 - $15,000',
    '$15,000 - $25,000',
    '$25,000 - $50,000',
    'Over $50,000'
  ];

  vendorTypeOptions = [
    'Photography',
    'Videography',
    'Catering',
    'Venue',
    'Decoration',
    'Music/DJ',
    'Flowers',
    'Transportation',
    'Wedding Cake',
    'Planning Services'
  ];

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService
  ) {
    this.editForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.profile) {
      this.populateForm();
    }
  }

  ngOnChanges(): void {
    if (this.profile) {
      this.populateForm();
    }
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
    }
  }

  onVendorTypeChange(event: any, vendorType: string): void {
    const currentTypes = this.editForm.get('preferredVendorTypes')?.value || [];
    if (event.target.checked) {
      if (!currentTypes.includes(vendorType)) {
        this.editForm.patchValue({
          preferredVendorTypes: [...currentTypes, vendorType]
        });
      }
    } else {
      this.editForm.patchValue({
        preferredVendorTypes: currentTypes.filter((type: string) => type !== vendorType)
      });
    }
  }

  isVendorTypeSelected(vendorType: string): boolean {
    const selectedTypes = this.editForm.get('preferredVendorTypes')?.value || [];
    return selectedTypes.includes(vendorType);
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

      this.customerService.updateCustomerProfile(this.profile.customerId, updateData).subscribe({
        next: (updatedProfile: CustomerDetails) => {
          this.isLoading = false;
          this.successMessage = 'Profile updated successfully!';
          this.profileUpdated.emit(updatedProfile);
          
          // Close modal after a brief delay to show success message
          setTimeout(() => {
            this.onClose();
          }, 1500);
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to update profile. Please try again.';
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
