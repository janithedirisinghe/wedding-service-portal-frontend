# Stripe Payment Integration Setup

## Overview
The payment functionality has been integrated into the customer bookings section. When a vendor accepts a booking request, customers can now proceed to make payments using Stripe.

## Required Setup

### 1. Add Stripe Script to index.html
Add the following script tag to your `src/index.html` file before the closing `</body>` tag:

```html
<script src="https://js.stripe.com/v3/"></script>
```

### 2. Configure Stripe Public Key
Update the `PaymentModalComponent` at line 30 in:
`src/app/features/customer/components/payment-modal/payment-modal.component.ts`

Replace:
```typescript
const stripePublicKey = 'pk_test_your_stripe_public_key_here';
```

With your actual Stripe public key:
```typescript
const stripePublicKey = 'pk_test_your_actual_stripe_public_key';
```

### 3. Environment Configuration (Optional)
You can also add the Stripe key to your environment files:

In `src/environments/environment.ts` and `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: false, // true for prod
  apiUrl: 'your-api-url',
  stripePublicKey: 'pk_test_your_stripe_public_key'
};
```

Then update the PaymentModalComponent to use:
```typescript
const stripePublicKey = environment.stripePublicKey;
```

## Features Implemented

### 1. Payment Service
- Created `PaymentService` that handles:
  - Creating payment intents
  - Confirming payments
  - API integration with your backend endpoints

### 2. Payment Modal Component
- Secure Stripe Elements integration
- Card information input
- Real-time error handling
- Payment processing with loading states
- Automatic backend confirmation

### 3. Booking Table Integration
- Added "Make Payment" button for ACCEPTED bookings
- Green payment button with card icon
- Only shows for bookings with status 'ACCEPTED'

### 4. Updated Customer Favorites Component
- Integrated payment modal
- Added payment success/error handling
- Refreshes booking list after successful payment

## API Integration
The payment system integrates with your backend endpoints:
- `POST /api/payments/create-intent`
- `POST /api/payments/confirm`

## Security Features
- Uses Stripe Elements for secure card input
- Client secret validation
- Backend payment confirmation
- No card details stored locally

## Usage Flow
1. Customer views bookings in "My Bookings" tab
2. If booking status is "ACCEPTED", "Make Payment" button appears
3. Customer clicks button to open payment modal
4. Customer enters card details securely
5. Payment is processed through Stripe
6. Backend confirms payment
7. Booking list refreshes with updated status

## Testing
For testing, you can use Stripe's test card numbers:
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002
- Use any future expiry date and any 3-digit CVC

## Next Steps
1. Add Stripe script to index.html
2. Configure your Stripe public key
3. Test the payment flow
4. Configure webhook endpoints for payment status updates (optional)
