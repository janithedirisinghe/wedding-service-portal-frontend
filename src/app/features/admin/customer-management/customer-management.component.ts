import { Component, OnInit } from '@angular/core';
import { AdminCustomerService } from '../services/admin-customer.service';
import { AdminCustomerDetailsDTO } from '../models/customer.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.scss']
})
export class CustomerManagementComponent implements OnInit {
  customers: AdminCustomerDetailsDTO[] = [];
  loading: boolean = false;
  loadingId: number | null = null;
  error: string | null = null;
  selectedCustomer: AdminCustomerDetailsDTO | null = null;
  isModalOpen: boolean = false;
  
  // Default avatar if customer doesn't have one
  defaultAvatar: string = 'https://randomuser.me/api/portraits/lego/1.jpg';

  constructor(private customerService: AdminCustomerService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.error = null;

    this.customerService.getAllCustomers()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (data) => {
          this.customers = data.map(customer => ({
            ...customer,
            isDetailsOpen: false
          }));
        },
        error: (err) => {
          this.error = 'Failed to load customers. Please try again later.';
          console.error('Error fetching customers:', err);
          
          // For demo purposes, load fallback data if API fails
          this.loadFallbackData();
        }
      });
  }

  toggleStatus(customer: AdminCustomerDetailsDTO): void {
    this.loadingId = customer.customerId;
    const newStatus = !customer.isActive;

    this.customerService.toggleCustomerActiveStatus(customer.customerId, newStatus)
      .pipe(
        finalize(() => {
          this.loadingId = null;
        })
      )
      .subscribe({
        next: () => {
          customer.isActive = newStatus;
        },
        error: (err) => {
          console.error('Error toggling customer status:', err);
          // Show error notification here if needed
        }
      });
  }

  openDetailsModal(customer: AdminCustomerDetailsDTO): void {
    this.selectedCustomer = customer;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedCustomer = null;
  }

  // Format date to a user-friendly format
  formatDate(dateString: string | null): string {
    if (!dateString) return 'Not specified';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  // Format preferred vendor types list
  formatVendorTypes(types: string[]): string {
    if (!types || types.length === 0) return 'None';
    return types.join(', ');
  }

  // Load fallback data if API fails (for development/testing)
  private loadFallbackData(): void {
    this.customers = [
      {
        customerId: 1,
        userId: 5,
        firstName: 'Janith',
        lastName: 'Edirisinghe',
        userName: 'chathu',
        userEmail: 'janithchathusankaedirisinghe@gmail.com',
        phoneNumber: '+94762136300',
        profileImageUrl: 'https://untgtsclbjlgemwljimq.supabase.co/storage/v1/object/public/wedding-posts/customer_profile_5_1754198177633_7.-Agbo-had-to-be-fed-as-it-could-hardly-move-720x512.jpg',
        isActive: true,
        dateOfBirth: null,
        bio: 'I am janith edirisinghe',
        address: '76/A Wathumulla Udugampola',
        city: 'Gampaha',
        country: 'Sri Lanka',
        location: null,
        weddingDate: '2025-07-30T00:00:00.000+00:00',
        budget: '',
        preferredVendorTypes: ['Photographer', 'Caterer', 'Venue', 'Videographer'],
        followerCount: 1
      },
      {
        customerId: 2,
        userId: 8,
        firstName: 'Jane',
        lastName: 'Smith',
        userName: 'jsmith',
        userEmail: 'jane.smith@example.com',
        phoneNumber: '+94712345678',
        profileImageUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
        isActive: false,
        dateOfBirth: '1992-05-15T00:00:00.000+00:00',
        bio: 'Wedding planner and enthusiast',
        address: '123 Main St',
        city: 'Colombo',
        country: 'Sri Lanka',
        location: null,
        weddingDate: '2025-09-15T00:00:00.000+00:00',
        budget: '10000',
        preferredVendorTypes: ['Decorator', 'Caterer', 'Venue'],
        followerCount: 5
      },
      {
        customerId: 3,
        userId: 12,
        firstName: 'Sam',
        lastName: 'Wilson',
        userName: 'samwil',
        userEmail: 'sam.wilson@example.com',
        phoneNumber: '+94777654321',
        profileImageUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
        isActive: true,
        dateOfBirth: '1988-10-20T00:00:00.000+00:00',
        bio: 'Looking forward to our special day!',
        address: '45 Beach Road',
        city: 'Negombo',
        country: 'Sri Lanka',
        location: 'Western Province',
        weddingDate: '2025-12-05T00:00:00.000+00:00',
        budget: '15000',
        preferredVendorTypes: ['Photographer', 'Videographer', 'DJ'],
        followerCount: 3
      }
    ];
  }
}
