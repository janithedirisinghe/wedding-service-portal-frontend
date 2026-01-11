import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { PaymentService, PaymentRequestDto, PaymentConfirmationDto } from '../../services/payment.service';
import { BookingResponseDto } from '../../services/customer-booking.service';

declare var Stripe: any;

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss']
})
export class PaymentModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() booking: BookingResponseDto | null = null;
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() paymentSuccess = new EventEmitter<any>();
  @Output() paymentError = new EventEmitter<string>();

  stripe: any;
  elements: any;
  cardElement: any;
  clientSecret: string = '';
  isCardValid: boolean = false;
  
  isProcessing: boolean = false;
  isLoading: boolean = false;
  error: string = '';
  
  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    // Check if Stripe is available with retry logic
    this.waitForStripe();
  }

  private waitForStripe(retries = 5): void {
    if (typeof Stripe !== 'undefined') {
      try {
        const stripePublicKey = 'pk_test_51QRSxBRvJVs0SdRcL0lKwNDdb3gjvTqLyv4DcCe1LZYW7Ht0bjEXfeTU2E8ADjvaXQjTXBnTCbgsS2cr1HZHxUSG00wDU67XgO';
        this.stripe = Stripe(stripePublicKey);
        this.elements = this.stripe.elements();
        console.log('Stripe initialized successfully');
      } catch (error) {
        console.error('Error initializing Stripe:', error);
        this.error = 'Failed to initialize payment system. Please refresh the page.';
      }
    } else if (retries > 0) {
      console.log(`Stripe not loaded yet, retrying... (${retries} attempts left)`);
      setTimeout(() => this.waitForStripe(retries - 1), 1000);
    } else {
      console.error('Stripe is not loaded. Please make sure to include the Stripe script in index.html');
      this.error = 'Payment system not available. Please refresh the page and try again.';
    }
  }

  ngOnChanges(): void {
    console.log('Payment modal ngOnChanges triggered. Visible:', this.isVisible, 'Booking:', !!this.booking);
    
    if (this.isVisible && this.booking) {
      console.log('Calling onModalOpen from ngOnChanges');
      this.onModalOpen();
    }
  }

  ngOnDestroy(): void {
    if (this.cardElement) {
      this.cardElement.destroy();
    }
  }

  onModalOpen(): void {
    console.log('Modal opened. Visible:', this.isVisible, 'Booking:', this.booking, 'Stripe:', !!this.stripe);
    
    if (this.isVisible && this.booking && this.stripe) {
      console.log('All conditions met, creating payment intent...');
      // Create payment intent first, then setup card element
      this.createPaymentIntent();
    } else if (this.isVisible && this.booking && !this.stripe) {
      console.error('Stripe not available');
      this.error = 'Payment system not available. Please refresh the page.';
    } else {
      console.log('Modal open conditions not met:', {
        isVisible: this.isVisible,
        hasBooking: !!this.booking,
        hasStripe: !!this.stripe
      });
    }
  }

  private setupCardElement(): void {
    if (!this.stripe || !this.elements) {
      console.error('Stripe not initialized');
      return;
    }

    // Destroy existing card element if it exists
    if (this.cardElement) {
      try {
        this.cardElement.destroy();
      } catch (error) {
        console.log('Card element already destroyed or not mounted');
      }
    }

    // Create new card element
    this.cardElement = this.elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#9e2146',
        },
      },
    });

    // Wait for DOM to be ready and mount card element
    const attemptMount = (retries = 3) => {
      const cardContainer = document.getElementById('card-element');
      
      if (cardContainer && this.cardElement) {
        try {
          this.cardElement.mount('#card-element');
          console.log('Card element mounted successfully');
          
          // Add event listeners for real-time validation
          this.cardElement.on('change', (event: any) => {
            console.log('Card change event:', event);
            if (event.error) {
              this.error = event.error.message;
              this.isCardValid = false;
            } else {
              this.error = '';
              this.isCardValid = event.complete;
            }
            console.log('Card valid:', this.isCardValid);
          });
          
        } catch (error) {
          console.error('Error mounting card element:', error);
          this.error = 'Failed to load payment form. Please refresh the page.';
        }
      } else if (retries > 0) {
        console.log(`Card container not found, retrying... (${retries} attempts left)`);
        setTimeout(() => attemptMount(retries - 1), 200);
      } else {
        console.error('Card container not found after multiple attempts');
        this.error = 'Payment form not available. Please refresh the page.';
      }
    };

    attemptMount();
  }

  createPaymentIntent(): void {
    if (!this.booking) {
      console.error('No booking available for payment intent');
      return;
    }
    
    console.log('Creating payment intent for booking:', this.booking);
    
    this.isLoading = true;
    this.error = '';

    // Convert amount to cents for Stripe (assuming proposedPrice is in dollars)
    const amountInCents = Math.round(this.booking.proposedPrice);

    const paymentRequest: PaymentRequestDto = {
      bookingId: this.booking.bookingId,
      amount: amountInCents, // Convert to cents
      currency: 'usd' // Stripe expects lowercase
    };

    console.log('Payment request payload:', paymentRequest);
    console.log('Booking data:', this.booking);
    console.log('Original amount in dollars:', this.booking.proposedPrice);
    console.log('Converted amount in cents:', amountInCents);

    this.paymentService.createPaymentIntent(paymentRequest).subscribe({
      next: (response) => {
        console.log('Payment intent created successfully:', response);
        console.log('Response type:', typeof response);
        console.log('Response keys:', Object.keys(response));
        console.log('Client secret in response:', response.stripeClientSecret);
        
        if (response && response.stripeClientSecret) {
          this.clientSecret = response.stripeClientSecret;
          console.log('Client secret set to:', this.clientSecret);
        } else {
          console.error('No client secret in response:', response);
          this.error = 'Invalid payment response. Please try again.';
        }
        
        this.isLoading = false;
        
        // Setup card element after loading is complete and DOM is available
        setTimeout(() => {
          this.setupCardElement();
        }, 100);
      },
      error: (error) => {
        console.error('Error creating payment intent:', error);
        console.error('Request payload that failed:', paymentRequest);
        if (error.error) {
          console.error('Backend error details:', error.error);
        }
        
        // More specific error messaging
        if (error.status === 400) {
          this.error = 'Invalid payment request. Please check booking details.';
        } else if (error.status === 401) {
          this.error = 'Please log in to make a payment.';
        } else if (error.status === 404) {
          this.error = 'Booking not found. Please refresh and try again.';
        } else {
          this.error = 'Failed to initialize payment. Please try again.';
        }
        this.isLoading = false;
      }
    });
  }

  async processPayment(): Promise<void> {
    if (!this.clientSecret || !this.booking) {
      this.error = 'Payment not initialized properly.';
      return;
    }

    if (!this.stripe || !this.cardElement) {
      this.error = 'Payment system not available. Please refresh the page.';
      return;
    }

    this.isProcessing = true;
    this.error = '';

    try {
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(this.clientSecret, {
        payment_method: {
          card: this.cardElement,
          billing_details: {
            name: `${this.booking.customerFirstName} ${this.booking.customerLastName}`,
          },
        }
      });

      if (error) {
        this.error = error.message;
        this.isProcessing = false;
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm payment with backend
        const confirmationDto: PaymentConfirmationDto = {
          stripePaymentIntentId: paymentIntent.id
        };

        this.paymentService.confirmPayment(confirmationDto).subscribe({
          next: (response) => {
            this.paymentSuccess.emit(response);
            this.close();
            this.isProcessing = false;
          },
          error: (error) => {
            console.error('Error confirming payment:', error);
            this.error = 'Payment succeeded but confirmation failed. Please contact support.';
            this.isProcessing = false;
          }
        });
      }
    } catch (error: any) {
      this.error = 'An unexpected error occurred. Please try again.';
      this.isProcessing = false;
    }
  }

  close(): void {
    this.error = '';
    this.isProcessing = false;
    this.isLoading = false;
    this.clientSecret = '';
    this.isCardValid = false;
    
    if (this.cardElement) {
      try {
        this.cardElement.unmount();
        this.cardElement.destroy();
        this.cardElement = null;
      } catch (error) {
        console.log('Card element cleanup - element may not be mounted');
      }
    }
    
    this.closeModal.emit();
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(dateString: string | Date): string {
    if (!dateString) return '';
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString();
  }
}
