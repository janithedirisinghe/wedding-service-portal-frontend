import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { SupportService } from '../../customer/services/support.service';
import { SupportDTO, SupportSeverity } from '../../customer/models/support.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vender-help-support',
  templateUrl: './vender-help-support.component.html',
  styleUrl: './vender-help-support.component.scss'
})
export class VenderHelpSupportComponent implements OnInit {
  supportForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError: string | null = null;
  severities = Object.values(SupportSeverity);

  // Support history properties
  supportRequests: SupportDTO[] = [];
  isLoadingRequests = false;
  showViewModal = false;
  selectedSupport: SupportDTO | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private supportService: SupportService,
    private router: Router
  ) {
    this.supportForm = this.fb.group({
      topic: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      severity: [SupportSeverity.MEDIUM, Validators.required]
    });
  }

  ngOnInit(): void {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/vender-login']);
    } else {
      this.loadSupportRequests();
    }
  }

  onSubmit(): void {
    if (this.supportForm.valid) {
      this.isSubmitting = true;
      this.submitError = null;

      const userId = this.authService.getUserId();
      const userName = this.authService.getUserName();
      const userRole = this.authService.getUserRole();

      if (!userId || !userName || !userRole) {
        this.submitError = 'User information not available. Please log in again.';
        this.isSubmitting = false;
        return;
      }

      const supportDTO: SupportDTO = {
        userId: userId,
        userName: userName,
        userRole: userRole,
        topic: this.supportForm.value.topic,
        description: this.supportForm.value.description,
        severity: this.supportForm.value.severity
      };

      this.supportService.createSupport(supportDTO).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.supportForm.reset();
          this.supportForm.patchValue({ severity: SupportSeverity.MEDIUM });
          // Refresh the support requests list
          this.loadSupportRequests();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.submitError = 'Failed to submit support request. Please try again.';
          console.error('Support submission error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.supportForm.controls).forEach(key => {
      const control = this.supportForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.supportForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength']?.requiredLength;
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${minLength} characters`;
    }
    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength']?.requiredLength;
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be no more than ${maxLength} characters`;
    }
    return '';
  }

  loadSupportRequests(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.isLoadingRequests = true;
    this.supportService.getSupportsByUserId(userId).subscribe({
      next: (requests) => {
        this.supportRequests = requests;
        this.isLoadingRequests = false;
      },
      error: (error) => {
        console.error('Error loading support requests:', error);
        this.isLoadingRequests = false;
      }
    });
  }

  viewSupportDetails(support: SupportDTO): void {
    this.selectedSupport = support;
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedSupport = null;
  }

  formatDate(date: string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getSeverityBadgeClass(severity: string): string {
    switch (severity) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusBadgeClass(support: SupportDTO): string {
    return support.replyMessage ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  }

  getStatusText(support: SupportDTO): string {
    return support.replyMessage ? 'Replied' : 'Pending';
  }
}
