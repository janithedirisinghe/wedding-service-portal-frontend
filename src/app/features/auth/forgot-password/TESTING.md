# Forgot Password Feature - Backend Integration Testing

## Manual Testing Checklist

### 1. Email Step Testing

**Test Case 1: Valid Email**
- Navigate to any login page
- Click "Forgot Password?" link
- Enter a valid email address that exists in your database
- Click "Send Verification Code"
- Expected: Success message and navigation to step 2

**Test Case 2: Invalid Email Format**
- Enter an invalid email format (e.g., "test@")
- Expected: Validation error message

**Test Case 3: Non-existent Email**
- Enter a valid email format but doesn't exist in database
- Expected: Backend error message "No account found with this email address"

**Test Case 4: Empty Email**
- Leave email field empty and submit
- Expected: "Email is required" validation message

### 2. OTP and Password Reset Testing

**Test Case 1: Valid OTP and Password**
- Enter the correct 6-digit OTP received via email
- Enter a new password (min 6 chars, with letter and number)
- Confirm the password
- Click "Reset Password"
- Expected: Success message and redirect to login page

**Test Case 2: Invalid OTP**
- Enter incorrect OTP
- Expected: Backend error "Invalid or expired OTP"

**Test Case 3: Expired OTP**
- Wait for OTP to expire (5 minutes based on backend)
- Enter the expired OTP
- Expected: Backend error "Invalid or expired OTP"

**Test Case 4: Password Mismatch**
- Enter different passwords in new password and confirm password fields
- Expected: "Passwords do not match" validation error

**Test Case 5: Weak Password**
- Enter a password less than 6 characters
- Expected: Validation error messages

## API Endpoints Being Used

### Send OTP
- **URL**: `POST /auth/forgot-password`
- **Request Body**: 
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Success Response**: 
  ```json
  {
    "message": "OTP has been sent to your email",
    "email": "user@example.com",
    "username": "username",
    "userId": "123"
  }
  ```

### Reset Password
- **URL**: `POST /auth/reset-password`
- **Request Body**: 
  ```json
  {
    "email": "user@example.com",
    "otp": "123456",
    "newPassword": "newpass123",
    "confirmPassword": "newpass123"
  }
  ```
- **Success Response**: 
  ```json
  {
    "message": "Password reset successfully. A confirmation email has been sent."
  }
  ```

## Error Scenarios to Test

1. **Network Issues**: Disconnect internet and test
2. **Server Down**: Stop backend server and test
3. **Invalid JSON**: Should be handled by Angular HTTP client
4. **CORS Issues**: Check browser console for CORS errors

## Browser Console Verification

Check the browser's Network tab to verify:
1. Correct API endpoints are being called
2. Request payloads match expected format
3. Response status codes (200 for success, 400 for client errors)
4. Response bodies contain expected data

## Email Testing

Verify that:
1. OTP emails are sent and received
2. Email content is properly formatted
3. Confirmation emails are sent after password reset

## User Experience Testing

1. **Loading States**: Verify loading spinners appear during API calls
2. **Error Messages**: Verify error messages are user-friendly
3. **Success Messages**: Verify success messages are clear
4. **Navigation**: Verify proper redirection after successful reset
5. **Form Validation**: Verify all validation rules work correctly
6. **Responsive Design**: Test on mobile and desktop screens

## Security Testing

1. **OTP Expiration**: Verify OTP expires after 5 minutes
2. **Rate Limiting**: Test multiple rapid requests (if implemented)
3. **Password Strength**: Verify password complexity requirements
4. **XSS Prevention**: Verify no script injection in error messages

## Production Readiness Checklist

- [ ] Environment variables configured correctly
- [ ] API URLs point to production endpoints
- [ ] Error handling covers all edge cases
- [ ] Form validation prevents invalid submissions
- [ ] Loading states provide good user feedback
- [ ] Success/error messages are user-friendly
- [ ] Email service is configured and working
- [ ] Backend logging is in place for debugging
