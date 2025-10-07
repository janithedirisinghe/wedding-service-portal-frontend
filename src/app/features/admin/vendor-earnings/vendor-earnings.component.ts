import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VendorRevenue } from '../models/vendor-earnings.model';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-vendor-earnings',
  templateUrl: './vendor-earnings.component.html',
  styleUrl: './vendor-earnings.component.scss'
})
export class VendorEarningsComponent implements OnInit {
  // Data properties
  vendorRevenues: VendorRevenue[] = [];
  filteredVendorRevenues: VendorRevenue[] = [];
  totalCount: number = 0;
  totalRevenue: number = 0;
  totalPayments: number = 0;
  averageRevenuePerVendor: number = 0;

  // Filter and sort properties
  searchTerm: string = '';
  sortBy: string = 'totalRevenue';
  sortOrder: 'asc' | 'desc' = 'desc';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;

  // Loading and error states
  loading: boolean = false;
  error: string = '';

  // Math object for template
  Math = Math;

  constructor(
    private router: Router,
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.loadVendorRevenue();
  }

  loadVendorRevenue(): void {
    this.loading = true;
    this.error = '';

    this.adminService.getVendorRevenue().subscribe({
      next: (response) => {
        this.vendorRevenues = response;
        this.calculateSummaryData();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading vendor revenue:', err);
        this.error = 'Failed to load vendor revenue data. Please try again later.';
        this.loading = false;
      }
    });
  }

  calculateSummaryData(): void {
    this.totalCount = this.vendorRevenues.length;
    this.totalRevenue = this.vendorRevenues.reduce((sum, v) => sum + v.totalRevenue, 0);
    this.totalPayments = this.vendorRevenues.reduce((sum, v) => sum + v.totalPayments, 0);
    this.averageRevenuePerVendor = this.totalCount > 0 ? this.totalRevenue / this.totalCount : 0;
  }

  applyFilters(): void {
    this.filteredVendorRevenues = this.vendorRevenues.filter(vendor => {
      const matchesSearch = !this.searchTerm || 
        vendor.vendorName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        vendor.vendorId.toString().includes(this.searchTerm);

      return matchesSearch;
    });

    this.sortData();
    this.calculateTotalPages();
  }

  sortData(): void {
    this.filteredVendorRevenues.sort((a, b) => {
      let aValue: any = a[this.sortBy as keyof VendorRevenue];
      let bValue: any = b[this.sortBy as keyof VendorRevenue];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (this.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredVendorRevenues.length / this.pageSize);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  getPaginatedData(): VendorRevenue[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredVendorRevenues.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  navigateBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  refreshData(): void {
    this.loadVendorRevenue();
  }

  exportToCSV(): void {
    const headers = ['Vendor ID', 'Vendor Name', 'Total Revenue', 'Total Payments', 'Average Per Payment'];
    
    const csvData = this.filteredVendorRevenues.map(vendor => [
      vendor.vendorId,
      `"${vendor.vendorName}"`, // Quote name in case it contains commas
      vendor.totalRevenue.toFixed(2),
      vendor.totalPayments,
      (vendor.totalRevenue / vendor.totalPayments).toFixed(2)
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vendor-revenue-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  viewVendorDetails(vendor: VendorRevenue): void {
    // Navigate to vendor management page with the vendor ID
    this.router.navigate(['/admin/vendor-management'], { 
      queryParams: { vendorId: vendor.vendorId } 
    });
  }

  getAveragePerPayment(vendor: VendorRevenue): number {
    return vendor.totalPayments > 0 ? vendor.totalRevenue / vendor.totalPayments : 0;
  }
}
