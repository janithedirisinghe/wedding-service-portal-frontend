# Forgot Password Component

A comprehensive forgot password component that handles password reset for Admin, Customer, and Vendor users in the WedEase wedding service portal.

## Features

- **Multi-user support**: Handles password reset for Admin, Customer, and Vendor users
- **Two-step process**: 
  1. Email verification and OTP sending
  2. OTP verification and password reset
- **Form validation**: Comprehensive form validation with error messages
- **Responsive design**: Mobile-friendly interface with Tailwind CSS
- **Type safety**: Fully typed with TypeScript interfaces
- **API ready**: Service layer ready for backend integration

## File Structure

```
src/app/features/auth/forgot-password/
├── forgot-password.component.ts     # Main component logic
├── forgot-password.component.html   # Template with two-step form
├── forgot-password.component.scss   # Component styles
└── forgot-password.component.spec.ts # Unit tests

src/app/features/auth/services/
└── forgot-password.service.ts       # Service for API calls
```

## Usage

### Navigation

The component can be accessed via the following routes with user type parameters:

- Admin: `/auth/forgot-password?type=admin`
- Customer: `/auth/forgot-password?type=customer`
- Vendor: `/auth/forgot-password?type=vendor`

### Step 1: Email Input

- User enters their email address
- Email validation ensures proper format
- Submits request to send OTP to the provided email

### Step 2: OTP and Password Reset

- User enters the 6-digit OTP received via email
- User sets a new password (minimum 6 characters)
- Password confirmation validation
- Submits request to reset password

## API Integration

### Service Methods

The `ForgotPasswordService` provides the following methods for API integration:

#### 1. Send OTP

```typescript
sendOtp(request: SendOtpRequest): Observable<SendOtpResponse>
```

**Request Interface:**
```typescript
interface SendOtpRequest {
  email: string;
  userType: 'admin' | 'customer' | 'vendor';
}
```

**Response Interface:**
```typescript
interface SendOtpResponse {
  success: boolean;
  message: string;
  otpSent?: boolean;
}
```

#### 2. Reset Password

```typescript
resetPassword(request: ResetPasswordRequest): Observable<ResetPasswordResponse>
```

**Request Interface:**
```typescript
interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
  userType: 'admin' | 'customer' | 'vendor';
}
```

**Response Interface:**
```typescript
interface ResetPasswordResponse {
  success: boolean;
  message: string;
  passwordReset?: boolean;
}
```

### API Endpoints (Integrated)

The component is now integrated with your Spring Boot backend:

1. **Send OTP**: `POST /auth/forgot-password`
   - Request: `{ "email": "user@example.com" }`
   - Response: `{ "message": "...", "email": "...", "username": "...", "userId": "..." }`

2. **Reset Password**: `POST /auth/reset-password`
   - Request: `{ "email": "...", "otp": "...", "newPassword": "...", "confirmPassword": "..." }`
   - Response: `{ "message": "Password reset successfully..." }`

### Backend Integration Status

✅ **Completed Integration Features:**
- Email validation and OTP sending
- OTP verification and password reset
- Comprehensive error handling
- Form validation matching backend requirements
- User-friendly error messages
- Loading states and success feedback

### Configuration

### Environment Variables

The service is configured to use your Spring Boot backend:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080' // Your Spring Boot server
};
```

### Enhanced Form Validation Rules

- **Email**: Required, valid email format with additional pattern validation
- **OTP**: Required, exactly 6 digits, numeric only
- **New Password**: Required, minimum 6 characters, must contain at least one letter and one number
- **Confirm Password**: Required, must match new password

### Error Handling

The component now includes comprehensive error handling:
- Network connectivity issues
- Server-side validation errors
- Invalid/expired OTP handling
- User-friendly error messages
- HTTP status code interpretation

## Integration with Login Components

The forgot password links have been added to all login components:

### Admin Login
```html
<a [routerLink]="['/auth/forgot-password']" [queryParams]="{type: 'admin'}">
  Forgot your password?
</a>
```

### Customer Login
```html
<a [routerLink]="['/auth/forgot-password']" [queryParams]="{type: 'customer'}">
  Forgot Password?
</a>
```

### Vendor Login
```html
<a [routerLink]="['/auth/forgot-password']" [queryParams]="{type: 'vendor'}">
  Forgot Password?
</a>
```

## Styling

The component uses Tailwind CSS classes for styling and includes:

- Responsive design for mobile and desktop
- Loading states with spinners
- Success and error message styling
- Form validation error styling
- Consistent branding with the WedEase color scheme (red-600 primary)

## Error Handling

The component handles various error scenarios:

- Invalid email format
- Network errors during API calls
- Invalid OTP
- Password mismatch
- Server-side validation errors

## Testing

To test the component:

1. Navigate to any login page
2. Click the "Forgot Password?" link
3. Enter a valid email address
4. Mock the OTP (currently simulated)
5. Enter OTP and new password
6. Verify redirection to the appropriate login page

## Future Enhancements

- OTP resend functionality
- OTP expiration handling
- Rate limiting for OTP requests
- Email template customization
- SMS OTP option
- Password strength indicator
- Remember device functionality

## Dependencies

- Angular Reactive Forms
- Angular Router
- HttpClient for API calls
- Tailwind CSS for styling

## Notes for Backend Integration

When implementing the backend APIs, ensure:

1. **Security**: Implement rate limiting for OTP requests
2. **Validation**: Server-side validation for all inputs
3. **OTP Management**: Secure OTP generation and storage
4. **Email Service**: Reliable email delivery service
5. **Password Hashing**: Secure password hashing before storage
6. **Audit Logging**: Log all password reset attempts for security

## Support

For any issues or questions about the forgot password component, please refer to the project documentation or contact the development team.
