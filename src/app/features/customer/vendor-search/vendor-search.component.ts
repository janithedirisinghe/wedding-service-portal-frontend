import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VendorSearchService, Vendor as ApiVendor, SearchFilters as ApiSearchFilters } from '../services/vendor-search.service';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject, of } from 'rxjs';

export interface Vendor {
  id: string;
  businessName: string;
  vendorType: string;
  location: string;
  country: string;
  averageRating: number;
  reviewCount: number;
  followerCount: number;
  startingPrice: number;
  bio: string;
  image?: string;
  availability: 'available' | 'busy';
  isFavorite: boolean;
  verify?: boolean;
  isActive?: boolean;
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
  verify: string;
  isActive: string;
  serviceName: string;
  minPrice: string;
  maxPrice: string;
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
  searchSubject = new Subject<string>();
  suggestions: string[] = [];
  showSuggestions: boolean = false;
  
  // API vendors data
  apiVendors: ApiVendor[] = [];
  
  // Error handling
  error: string | null = null;

  // Filters
  filters: SearchFilters = {
    location: '',
    country: '',
    vendorType: '',
    rating: '',
    priceRange: '',
    followerCount: '',
    availability: '',
    sortBy: 'relevance',
    verify: '',
    isActive: '',
    serviceName: '',
    minPrice: '',
    maxPrice: ''
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
  // Filter options - will be loaded from API
  availableLocations: string[] = [];
  availableCountries: string[] = [];
  availableVendorTypes: string[] = [];

  // Data
  allVendors: Vendor[] = [];
  filteredVendors: Vendor[] = [];
  paginatedVendors: Vendor[] = [];

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 1;

  constructor(
    private router: Router,
    private vendorSearchService: VendorSearchService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.setupSearchAutocomplete();
  }

  // Load initial data from API
  loadInitialData(): void {
    this.isLoading = true;
    this.error = null;

    // Load active and verified vendors by default
    this.vendorSearchService.getActiveAndVerifiedVendors()
      .pipe(
        catchError(err => {
          console.error('Error loading vendors:', err);
          this.error = 'Failed to load vendors. Please try again.';
          return of([]);
        })
      )
      .subscribe(vendors => {
        this.apiVendors = vendors;
        this.allVendors = this.convertApiVendorsToDisplayVendors(vendors);
        this.filteredVendors = [...this.allVendors];
        this.updatePagination();
        this.isLoading = false;
      });

    // Load filter options
    this.loadFilterOptions();
  }

  // Load filter options from API
  loadFilterOptions(): void {
    // Load vendor types
    this.vendorSearchService.getAllVendorTypes()
      .pipe(catchError(err => of([])))
      .subscribe(types => {
        this.availableVendorTypes = types;
        this.updateQuickFilters();
      });

    // Load countries
    this.vendorSearchService.getAllCountries()
      .pipe(catchError(err => of([])))
      .subscribe(countries => {
        this.availableCountries = countries;
      });

    // Extract unique locations from loaded vendors
    this.extractLocationsFromVendors();
  }

  // Extract unique locations from current vendors
  extractLocationsFromVendors(): void {
    const locations = new Set<string>();
    this.apiVendors.forEach(vendor => {
      if (vendor.location && vendor.location.trim()) {
        locations.add(vendor.location.trim());
      }
    });
    this.availableLocations = Array.from(locations).sort();
  }

  // Setup search autocomplete
  setupSearchAutocomplete(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (query && query.length >= 2) {
          return this.vendorSearchService.getBusinessNameSuggestions(query, 5)
            .pipe(catchError(err => of([])));
        }
        return of([]);
      })
    ).subscribe(suggestions => {
      this.suggestions = suggestions;
      this.showSuggestions = suggestions.length > 0 && this.searchQuery.length >= 2;
    });
  }

  // Convert API vendors to display format
  convertApiVendorsToDisplayVendors(apiVendors: ApiVendor[]): Vendor[] {
    return apiVendors.map(apiVendor => ({
      id: apiVendor.venderId.toString(),
      businessName: apiVendor.businessName || '',
      vendorType: apiVendor.venType || '',
      location: apiVendor.location || '',
      country: apiVendor.country || '',
      averageRating: this.vendorSearchService.getAverageRating(apiVendor),
      reviewCount: 0, // You might need to implement this
      followerCount: this.vendorSearchService.getFollowerCount(apiVendor),
      startingPrice: this.vendorSearchService.getStartingPrice(apiVendor),
      bio: apiVendor.bio || '',
      image: apiVendor.profileImageUrl || undefined,
      availability: apiVendor.availability === 'available' ? 'available' : 'busy',
      isFavorite: false, // You might need to implement this
      verify: apiVendor.verify,
      isActive: apiVendor.isActive
    }));
  }

  // Update quick filters based on available vendor types
  updateQuickFilters(): void {
    // Update quick filters with actual vendor types from API
    this.quickFilters = [
      ...this.availableVendorTypes.slice(0, 5).map(type => ({
        label: type,
        key: 'vendorType',
        value: type,
        active: false
      })),
      { label: 'Available Now', key: 'availability', value: 'available', active: false },
      { label: 'Verified Only', key: 'verify', value: 'true', active: false },
      { label: 'Active Only', key: 'isActive', value: 'true', active: false }
    ];
  }

  // Search functionality
  onSearchChange(): void {
    // Trigger autocomplete
    this.searchSubject.next(this.searchQuery);
    
    // Perform search
    if (this.searchQuery.trim()) {
      this.performSearch();
    } else {
      this.loadInitialData();
    }
  }

  // Perform search using API
  performSearch(): void {
    if (!this.searchQuery.trim()) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    // Use quick search API for general search
    this.vendorSearchService.quickSearch(this.searchQuery.trim())
      .pipe(
        catchError(err => {
          console.error('Error searching vendors:', err);
          this.error = 'Search failed. Please try again.';
          return of([]);
        })
      )
      .subscribe(vendors => {
        this.apiVendors = vendors;
        this.allVendors = this.convertApiVendorsToDisplayVendors(vendors);
        this.applyClientSideFilters();
        this.isLoading = false;
      });
  }

  // Select suggestion
  selectSuggestion(suggestion: string): void {
    this.searchQuery = suggestion;
    this.showSuggestions = false;
    this.performSearch();
  }

  // Hide suggestions
  hideSuggestions(): void {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  // Filter functionality
  applyFilters(): void {
    // If we have specific filter values, use API-based advanced search
    if (this.hasSpecificFilters()) {
      this.performAdvancedSearch();
    } else {
      // Use client-side filtering for simple cases
      this.applyClientSideFilters();
    }
  }

  // Check if we have specific filters that should trigger API search
  hasSpecificFilters(): boolean {
    return !!(
      this.filters.location ||
      this.filters.country ||
      this.filters.vendorType ||
      this.filters.availability ||
      this.filters.verify ||
      this.filters.isActive ||
      this.filters.serviceName ||
      (this.filters.minPrice && this.filters.maxPrice)
    );
  }

  // Perform advanced search using API
  performAdvancedSearch(): void {
    this.isLoading = true;
    this.error = null;

    // Build API search filters
    const apiFilters: ApiSearchFilters = {};
    
    if (this.filters.location) apiFilters.location = this.filters.location;
    if (this.filters.country) apiFilters.country = this.filters.country;
    if (this.filters.vendorType) apiFilters.venType = this.filters.vendorType;
    if (this.filters.availability) apiFilters.availability = this.filters.availability;
    if (this.filters.verify) apiFilters.verify = this.filters.verify === 'true';
    if (this.filters.isActive) apiFilters.isActive = this.filters.isActive === 'true';
    if (this.searchQuery.trim()) apiFilters.businessName = this.searchQuery.trim();

    // Use advanced search API
    this.vendorSearchService.searchVendors(apiFilters)
      .pipe(
        catchError(err => {
          console.error('Error in advanced search:', err);
          this.error = 'Advanced search failed. Please try again.';
          return of([]);
        })
      )
      .subscribe(vendors => {
        this.apiVendors = vendors;
        this.allVendors = this.convertApiVendorsToDisplayVendors(vendors);
        
        // Apply additional client-side filters
        this.applyClientSideFilters();
        this.isLoading = false;
      });
  }

  // Apply client-side filtering for UI-specific filters
  applyClientSideFilters(): void {
    let filtered = [...this.allVendors];

    // Apply rating filter
    if (this.filters.rating) {
      const minRating = parseFloat(this.filters.rating);
      filtered = filtered.filter(vendor => vendor.averageRating >= minRating);
    }

    // Apply price range filter
    if (this.filters.priceRange && !this.filters.minPrice && !this.filters.maxPrice) {
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

    // Apply custom price range
    if (this.filters.minPrice && this.filters.maxPrice) {
      const minPrice = parseFloat(this.filters.minPrice);
      const maxPrice = parseFloat(this.filters.maxPrice);
      filtered = filtered.filter(vendor => 
        vendor.startingPrice >= minPrice && vendor.startingPrice <= maxPrice
      );
    }

    // Apply follower count filter
    if (this.filters.followerCount) {
      const minFollowers = parseInt(this.filters.followerCount);
      filtered = filtered.filter(vendor => vendor.followerCount >= minFollowers);
    }

    // Apply sorting
    filtered = this.sortVendors(filtered);

    this.filteredVendors = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  // Service-based search methods
  searchByService(): void {
    if (!this.filters.serviceName.trim()) {
      return;
    }

    this.isLoading = true;
    this.vendorSearchService.searchByServiceName(this.filters.serviceName.trim())
      .pipe(
        catchError(err => {
          console.error('Error searching by service:', err);
          return of([]);
        })
      )
      .subscribe(vendors => {
        this.apiVendors = vendors;
        this.allVendors = this.convertApiVendorsToDisplayVendors(vendors);
        this.applyClientSideFilters();
        this.isLoading = false;
      });
  }

  searchByPriceRange(): void {
    if (!this.filters.minPrice || !this.filters.maxPrice) {
      return;
    }

    const minPrice = parseFloat(this.filters.minPrice);
    const maxPrice = parseFloat(this.filters.maxPrice);

    if (isNaN(minPrice) || isNaN(maxPrice) || minPrice < 0 || maxPrice < minPrice) {
      this.error = 'Please enter valid price range values.';
      return;
    }

    this.isLoading = true;
    this.vendorSearchService.searchByServicePriceRange(minPrice, maxPrice)
      .pipe(
        catchError(err => {
          console.error('Error searching by price range:', err);
          return of([]);
        })
      )
      .subscribe(vendors => {
        this.apiVendors = vendors;
        this.allVendors = this.convertApiVendorsToDisplayVendors(vendors);
        this.applyClientSideFilters();
        this.isLoading = false;
      });
  }

  // Sort vendors
  sortVendors(vendors: Vendor[]): Vendor[] {
    switch (this.filters.sortBy) {
      case 'rating':
        return vendors.sort((a, b) => b.averageRating - a.averageRating);
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
      sortBy: 'relevance',
      verify: '',
      isActive: '',
      serviceName: '',
      minPrice: '',
      maxPrice: ''
    };
    
    this.quickFilters.forEach(filter => filter.active = false);
    this.searchQuery = '';
    this.suggestions = [];
    this.showSuggestions = false;
    this.error = null;
    this.loadInitialData();
  }

  // Special filter methods
  searchVerifiedOnly(): void {
    this.isLoading = true;
    this.vendorSearchService.getVerifiedVendors()
      .pipe(
        catchError(err => {
          console.error('Error loading verified vendors:', err);
          return of([]);
        })
      )
      .subscribe(vendors => {
        this.apiVendors = vendors;
        this.allVendors = this.convertApiVendorsToDisplayVendors(vendors);
        this.applyClientSideFilters();
        this.isLoading = false;
      });
  }

  searchActiveOnly(): void {
    this.isLoading = true;
    this.vendorSearchService.getActiveVendors()
      .pipe(
        catchError(err => {
          console.error('Error loading active vendors:', err);
          return of([]);
        })
      )
      .subscribe(vendors => {
        this.apiVendors = vendors;
        this.allVendors = this.convertApiVendorsToDisplayVendors(vendors);
        this.applyClientSideFilters();
        this.isLoading = false;
      });
  }

  searchMostFollowed(): void {
    this.isLoading = true;
    this.vendorSearchService.getMostFollowedVendors(20)
      .pipe(
        catchError(err => {
          console.error('Error loading most followed vendors:', err);
          return of([]);
        })
      )
      .subscribe(vendors => {
        this.apiVendors = vendors;
        this.allVendors = this.convertApiVendorsToDisplayVendors(vendors);
        this.applyClientSideFilters();
        this.isLoading = false;
      });
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
    this.router.navigate(['/customer/vender-profile'], { queryParams: { vendorId: vendor.id } });
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
