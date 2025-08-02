import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface Vendor {
  id: string;
  businessName: string;
  vendorType: string;
  location: string;
  country: string;
  rating: number;
  reviewCount: number;
  followerCount: number;
  startingPrice: number;
  bio: string;
  image?: string;
  availability: 'available' | 'busy';
  isFavorite: boolean;
}

export interface SearchFilters {
  location: string;
  country: string;
  vendorType: string;
  rating: string;
  priceRange: string;
  followerCount: string;
  availability: string;
  sortBy: string;
}

export interface QuickFilter {
  label: string;
  key: string;
  value: any;
  active: boolean;
}

@Component({
  selector: 'app-vendor-search',
  templateUrl: './vendor-search.component.html',
  styleUrls: ['./vendor-search.component.scss']
})
export class VendorSearchComponent implements OnInit {
  
  // Search and filtering
  searchQuery: string = '';
  showAdvancedFilters: boolean = false;
  isLoading: boolean = false;

  // Filters
  filters: SearchFilters = {
    location: '',
    country: '',
    vendorType: '',
    rating: '',
    priceRange: '',
    followerCount: '',
    availability: '',
    sortBy: 'relevance'
  };

  // Quick filters
  quickFilters: QuickFilter[] = [
    { label: 'Photography', key: 'vendorType', value: 'Photography', active: false },
    { label: 'Catering', key: 'vendorType', value: 'Catering', active: false },
    { label: 'Venue', key: 'vendorType', value: 'Venue', active: false },
    { label: 'Decoration', key: 'vendorType', value: 'Decoration', active: false },
    { label: 'Music & Entertainment', key: 'vendorType', value: 'Music & Entertainment', active: false },
    { label: 'Available Now', key: 'availability', value: 'available', active: false },
    { label: 'Top Rated (4.5+)', key: 'rating', value: '4.5', active: false },
    { label: 'Budget Friendly', key: 'priceRange', value: 'budget', active: false }
  ];

  // Filter options
  availableLocations: string[] = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 
    'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
    'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 
    'Seattle', 'Denver', 'Washington DC', 'Boston', 'El Paso', 'Nashville',
    'Detroit', 'Oklahoma City', 'Portland', 'Las Vegas', 'Memphis', 'Louisville',
    'Baltimore', 'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno', 'Sacramento'
  ];

  availableCountries: string[] = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 
    'France', 'Spain', 'Italy', 'Netherlands', 'Sweden', 'Norway', 'Denmark',
    'Switzerland', 'Austria', 'Belgium', 'Ireland', 'Portugal', 'Finland',
    'New Zealand', 'Japan', 'South Korea', 'Singapore', 'UAE', 'India'
  ];

  availableVendorTypes: string[] = [
    'Photography', 'Videography', 'Catering', 'Venue', 'Decoration', 
    'Floral Design', 'Music & Entertainment', 'DJ Services', 'Live Band',
    'Wedding Planning', 'Makeup & Beauty', 'Hair Styling', 'Bridal Fashion',
    'Groom\'s Attire', 'Jewelry', 'Transportation', 'Honeymoon Planning',
    'Stationery & Invitations', 'Cake & Desserts', 'Lighting & Sound'
  ];

  // Data
  allVendors: Vendor[] = [];
  filteredVendors: Vendor[] = [];
  paginatedVendors: Vendor[] = [];

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 1;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadVendors();
  }

  // Load mock vendor data
  loadVendors(): void {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.allVendors = this.generateMockVendors();
      this.filteredVendors = [...this.allVendors];
      this.updatePagination();
      this.isLoading = false;
    }, 1000);
  }

  // Generate mock vendor data
  generateMockVendors(): Vendor[] {
    const vendors: Vendor[] = [];
    const businessNames = [
      'Elegant Moments Photography', 'Divine Catering Solutions', 'Enchanted Gardens Venue',
      'Bella Rosa Floral Design', 'Perfect Harmony Music', 'Luxury Wedding Planners',
      'Artistic Vision Studios', 'Gourmet Delights Catering', 'Crystal Palace Ballroom',
      'Romantic Roses Florist', 'Celebration Sounds DJ', 'Dream Wedding Coordinators',
      'Timeless Memories Photo', 'Exquisite Taste Catering', 'Majestic Manor Venue',
      'Blooming Beauty Florals', 'Melodic Moments Music', 'Elite Event Planners',
      'Capture the Magic Photo', 'Savory Selections Catering', 'Grand Ballroom Venue',
      'Precious Petals Florist', 'Rhythm & Blues Band', 'Wonderful Wedding Planners',
      'Picture Perfect Studios', 'Culinary Creations Catering', 'Fairytale Castle Venue',
      'Garden of Love Florist', 'Symphony Sounds Music', 'Blissful Moments Planning'
    ];

    for (let i = 0; i < 30; i++) {
      vendors.push({
        id: `vendor-${i + 1}`,
        businessName: businessNames[i],
        vendorType: this.availableVendorTypes[Math.floor(Math.random() * this.availableVendorTypes.length)],
        location: this.availableLocations[Math.floor(Math.random() * this.availableLocations.length)],
        country: this.availableCountries[Math.floor(Math.random() * this.availableCountries.length)],
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 to 5.0
        reviewCount: Math.floor(Math.random() * 200) + 10, // 10 to 210
        followerCount: Math.floor(Math.random() * 5000) + 50, // 50 to 5050
        startingPrice: Math.floor(Math.random() * 2500) + 200, // 200 to 2700
        bio: `Professional wedding service provider with ${Math.floor(Math.random() * 15) + 1} years of experience. Specializing in creating unforgettable moments for your special day.`,
        availability: Math.random() > 0.3 ? 'available' : 'busy',
        isFavorite: Math.random() > 0.8
      });
    }

    return vendors;
  }

  // Search functionality
  onSearchChange(): void {
    this.applyFilters();
  }

  // Filter functionality
  applyFilters(): void {
    let filtered = [...this.allVendors];

    // Apply search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(vendor => 
        vendor.businessName.toLowerCase().includes(query) ||
        vendor.vendorType.toLowerCase().includes(query) ||
        vendor.location.toLowerCase().includes(query) ||
        vendor.country.toLowerCase().includes(query) ||
        vendor.bio.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (this.filters.location) {
      filtered = filtered.filter(vendor => vendor.location === this.filters.location);
    }

    if (this.filters.country) {
      filtered = filtered.filter(vendor => vendor.country === this.filters.country);
    }

    if (this.filters.vendorType) {
      filtered = filtered.filter(vendor => vendor.vendorType === this.filters.vendorType);
    }

    if (this.filters.rating) {
      const minRating = parseFloat(this.filters.rating);
      filtered = filtered.filter(vendor => vendor.rating >= minRating);
    }

    if (this.filters.priceRange) {
      filtered = filtered.filter(vendor => {
        switch (this.filters.priceRange) {
          case 'budget':
            return vendor.startingPrice < 500;
          case 'mid':
            return vendor.startingPrice >= 500 && vendor.startingPrice < 1500;
          case 'premium':
            return vendor.startingPrice >= 1500 && vendor.startingPrice < 3000;
          case 'luxury':
            return vendor.startingPrice >= 3000;
          default:
            return true;
        }
      });
    }

    if (this.filters.followerCount) {
      const minFollowers = parseInt(this.filters.followerCount);
      filtered = filtered.filter(vendor => vendor.followerCount >= minFollowers);
    }

    if (this.filters.availability) {
      filtered = filtered.filter(vendor => vendor.availability === this.filters.availability);
    }

    // Apply sorting
    filtered = this.sortVendors(filtered);

    this.filteredVendors = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  // Sort vendors
  sortVendors(vendors: Vendor[]): Vendor[] {
    switch (this.filters.sortBy) {
      case 'rating':
        return vendors.sort((a, b) => b.rating - a.rating);
      case 'followers':
        return vendors.sort((a, b) => b.followerCount - a.followerCount);
      case 'price_low':
        return vendors.sort((a, b) => a.startingPrice - b.startingPrice);
      case 'price_high':
        return vendors.sort((a, b) => b.startingPrice - a.startingPrice);
      case 'newest':
        return vendors.sort((a, b) => b.id.localeCompare(a.id));
      default:
        return vendors;
    }
  }

  // Quick filter toggle
  toggleQuickFilter(filter: QuickFilter): void {
    filter.active = !filter.active;
    
    if (filter.active) {
      // Apply the quick filter
      if (filter.key in this.filters) {
        (this.filters as any)[filter.key] = filter.value;
      }
      
      // Deactivate other filters of the same type
      this.quickFilters.forEach(f => {
        if (f.key === filter.key && f !== filter) {
          f.active = false;
        }
      });
    } else {
      // Remove the quick filter
      if (filter.key in this.filters) {
        (this.filters as any)[filter.key] = '';
      }
    }
    
    this.applyFilters();
  }

  // Clear all filters
  clearFilters(): void {
    this.filters = {
      location: '',
      country: '',
      vendorType: '',
      rating: '',
      priceRange: '',
      followerCount: '',
      availability: '',
      sortBy: 'relevance'
    };
    
    this.quickFilters.forEach(filter => filter.active = false);
    this.searchQuery = '';
    this.applyFilters();
  }

  // Pagination
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredVendors.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedVendors = this.filteredVendors.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
      // Scroll to top of results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    const halfMax = Math.floor(maxPagesToShow / 2);
    
    let startPage = Math.max(1, this.currentPage - halfMax);
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  // Vendor actions
  viewVendorProfile(vendor: Vendor): void {
    // Navigate to vendor profile with the vendor ID
    this.router.navigate(['/customer/vender-profile'], { queryParams: { id: vendor.id } });
  }

  contactVendor(vendor: Vendor): void {
    // Navigate to chat with the vendor
    this.router.navigate(['/customer/chat'], { queryParams: { vendorId: vendor.id } });
  }

  toggleFavorite(vendor: Vendor): void {
    vendor.isFavorite = !vendor.isFavorite;
    // Here you would also update the favorite status in your backend
    console.log(`Vendor ${vendor.businessName} ${vendor.isFavorite ? 'added to' : 'removed from'} favorites`);
  }
}
