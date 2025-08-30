import { Component, OnInit } from '@angular/core';
import { VendorType, VendorTypeService, VendorTypeFilters } from '../services/vendor-type.service';

@Component({
  selector: 'app-vendor-type-management',
  templateUrl: './vendor-type-management.component.html',
  styleUrls: ['./vendor-type-management.component.scss']
})
export class VendorTypeManagementComponent implements OnInit {
  vendorTypes: VendorType[] = [];
  filteredVendorTypes: VendorType[] = [];
  isLoading: boolean = false;
  searchTerm: string = '';
  
  // Modal states
  isAddModalOpen: boolean = false;
  isEditModalOpen: boolean = false;
  isDeleteModalOpen: boolean = false;
  
  // Form data
  selectedVendorType: VendorType | null = null;
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  // Error handling
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private vendorTypeService: VendorTypeService) { }

  ngOnInit(): void {
    this.loadVendorTypes();
  }

  loadVendorTypes(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.vendorTypeService.getVendorTypes().subscribe({
      next: (vendorTypes) => {
        this.vendorTypes = vendorTypes;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading vendor types:', error);
        this.errorMessage = error.userMessage || 'Failed to load vendor types. Please try again.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.vendorTypes];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(type => 
        type.vendorTypeName.toLowerCase().includes(searchLower) ||
        (type.description && type.description.toLowerCase().includes(searchLower))
      );
    }

    this.filteredVendorTypes = filtered;
    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    
    // Reset to first page if current page is out of bounds
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = 1;
    }
  }

  getPaginatedData(): VendorType[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredVendorTypes.slice(startIndex, endIndex);
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadVendorTypes();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onSearch();
  }

  // Modal actions
  openAddModal(): void {
    this.selectedVendorType = {
      vendorTypeName: '',
      description: '',
      isActive: true
    };
    this.isAddModalOpen = true;
    this.clearMessages();
  }

  openEditModal(vendorType: VendorType): void {
    this.selectedVendorType = { ...vendorType };
    this.isEditModalOpen = true;
    this.clearMessages();
  }

  openDeleteModal(vendorType: VendorType): void {
    this.selectedVendorType = vendorType;
    this.isDeleteModalOpen = true;
    this.clearMessages();
  }

  closeModals(): void {
    this.isAddModalOpen = false;
    this.isEditModalOpen = false;
    this.isDeleteModalOpen = false;
    this.selectedVendorType = null;
    this.clearMessages();
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // CRUD operations
  createVendorType(): void {
    if (!this.selectedVendorType || !this.selectedVendorType.vendorTypeName.trim()) {
      this.errorMessage = 'Vendor type name is required.';
      return;
    }

    this.vendorTypeService.createVendorType(this.selectedVendorType).subscribe({
      next: (newVendorType) => {
        this.successMessage = 'Vendor type created successfully!';
        this.loadVendorTypes();
        setTimeout(() => this.closeModals(), 1500);
      },
      error: (error) => {
        console.error('Error creating vendor type:', error);
        this.errorMessage = error.userMessage || 'Failed to create vendor type. Please try again.';
      }
    });
  }

  updateVendorType(): void {
    if (!this.selectedVendorType || !this.selectedVendorType.vendorTypeName.trim()) {
      this.errorMessage = 'Vendor type name is required.';
      return;
    }

    if (!this.selectedVendorType.vendorTypeId) {
      this.errorMessage = 'Invalid vendor type ID.';
      return;
    }

    this.vendorTypeService.updateVendorType(this.selectedVendorType.vendorTypeId, this.selectedVendorType).subscribe({
      next: (updatedVendorType) => {
        this.successMessage = 'Vendor type updated successfully!';
        this.loadVendorTypes();
        setTimeout(() => this.closeModals(), 1500);
      },
      error: (error) => {
        console.error('Error updating vendor type:', error);
        this.errorMessage = error.userMessage || 'Failed to update vendor type. Please try again.';
      }
    });
  }

  deleteVendorType(): void {
    if (!this.selectedVendorType || !this.selectedVendorType.vendorTypeId) {
      this.errorMessage = 'Invalid vendor type selected.';
      return;
    }

    this.vendorTypeService.deleteVendorType(this.selectedVendorType.vendorTypeId).subscribe({
      next: (response) => {
        this.successMessage = 'Vendor type deactivated successfully!';
        this.loadVendorTypes();
        setTimeout(() => this.closeModals(), 1500);
      },
      error: (error) => {
        console.error('Error deleting vendor type:', error);
        this.errorMessage = error.userMessage || 'Failed to delete vendor type. Please try again.';
      }
    });
  }

  toggleStatus(vendorType: VendorType): void {
    if (!vendorType.vendorTypeId) {
      this.errorMessage = 'Invalid vendor type ID.';
      return;
    }

    const newStatus = !vendorType.isActive;
    this.vendorTypeService.toggleVendorTypeStatus(vendorType.vendorTypeId, newStatus).subscribe({
      next: (updatedVendorType) => {
        this.successMessage = `Vendor type ${newStatus ? 'activated' : 'deactivated'} successfully!`;
        this.loadVendorTypes();
        setTimeout(() => this.clearMessages(), 3000);
      },
      error: (error) => {
        console.error('Error toggling vendor type status:', error);
        this.errorMessage = error.userMessage || 'Failed to update vendor type status. Please try again.';
      }
    });
  }

  // Pagination
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadVendorTypes();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadVendorTypes();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadVendorTypes();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, this.currentPage - halfVisible);
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) { 
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  // Helper method for template
  Math = Math;
}
