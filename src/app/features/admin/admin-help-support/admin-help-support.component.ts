import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminSupportService } from '../services/admin-support.service';
import { SupportDTO, SupportSeverity } from '../../customer/models/support.model';

@Component({
  selector: 'app-admin-help-support',
  templateUrl: './admin-help-support.component.html',
  styleUrl: './admin-help-support.component.scss'
})
export class AdminHelpSupportComponent implements OnInit {
  supports: SupportDTO[] = [];
  filteredSupports: SupportDTO[] = [];
  isLoading = false;
  error: string | null = null;

  // Reply modal
  showReplyModal = false;
  selectedSupport: SupportDTO | null = null;
  replyForm: FormGroup;
  isSubmittingReply = false;

  // Filters
  severityFilter = '';
  searchTerm = '';

  severities = Object.values(SupportSeverity);

  constructor(
    private adminSupportService: AdminSupportService,
    private fb: FormBuilder
  ) {
    this.replyForm = this.fb.group({
      replyMessage: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadSupports();
  }

  loadSupports(): void {
    this.isLoading = true;
    this.error = null;

    this.adminSupportService.getAllSupports().subscribe({
      next: (supports) => {
        this.supports = supports;
        this.filteredSupports = [...supports];
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load support requests. Please try again.';
        this.isLoading = false;
        console.error('Error loading supports:', error);
      }
    });
  }

  filterBySeverity(severity: string): void {
    this.severityFilter = severity;
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.supports];

    // Filter by severity
    if (this.severityFilter) {
      filtered = filtered.filter(support => support.severity === this.severityFilter);
    }

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(support =>
        support.topic?.toLowerCase().includes(term) ||
        support.description?.toLowerCase().includes(term) ||
        support.userName?.toLowerCase().includes(term) ||
        support.userRole?.toLowerCase().includes(term)
      );
    }

    this.filteredSupports = filtered;
  }

  openReplyModal(support: SupportDTO): void {
    this.selectedSupport = support;
    this.replyForm.patchValue({
      replyMessage: support.replyMessage || ''
    });
    this.showReplyModal = true;
  }

  closeReplyModal(): void {
    this.showReplyModal = false;
    this.selectedSupport = null;
    this.replyForm.reset();
  }

  submitReply(): void {
    if (this.replyForm.valid && this.selectedSupport) {
      this.isSubmittingReply = true;

      const updatedSupport: SupportDTO = {
        ...this.selectedSupport,
        replyMessage: this.replyForm.value.replyMessage,
        replyDate: new Date().toISOString()
      };

      this.adminSupportService.updateSupport(this.selectedSupport.supportId!, updatedSupport).subscribe({
        next: (response) => {
          // Update the support in the list
          const index = this.supports.findIndex(s => s.supportId === response.supportId);
          if (index !== -1) {
            this.supports[index] = response;
            this.applyFilters();
          }

          this.isSubmittingReply = false;
          this.closeReplyModal();
        },
        error: (error) => {
          this.isSubmittingReply = false;
          console.error('Error updating support:', error);
          // You might want to show an error message to the user here
        }
      });
    } else {
      this.replyForm.markAllAsTouched();
    }
  }

  getSeverityBadgeClass(severity: string): string {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getRoleBadgeClass(role: string): string {
    switch (role?.toLowerCase()) {
      case 'customer':
        return 'bg-blue-100 text-blue-800';
      case 'vendor':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
}
