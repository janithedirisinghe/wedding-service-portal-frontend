import { HttpErrorResponse } from '@angular/common/http';

export class ErrorHandler {
  /**
   * Extract error message from HTTP error response
   * @param error - HTTP error response
   * @returns User-friendly error message
   */
  static extractErrorMessage(error: any): string {
    if (error?.error) {
      // Backend returned an error object
      if (typeof error.error === 'string') {
        return error.error;
      }
      
      // Check for error property in response
      if (error.error.error) {
        return error.error.error;
      }
      
      // Check for message property in response
      if (error.error.message) {
        return error.error.message;
      }
    }
    
    // Check for direct message
    if (error.message) {
      return error.message;
    }
    
    // HTTP status code messages
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          return 'Unable to connect to the server. Please check your internet connection.';
        case 400:
          return 'Invalid request. Please check your input and try again.';
        case 401:
          return 'Unauthorized access. Please check your credentials.';
        case 403:
          return 'Access forbidden. You do not have permission to perform this action.';
        case 404:
          return 'Service not found. Please try again later.';
        case 500:
          return 'Internal server error. Please try again later.';
        case 503:
          return 'Service temporarily unavailable. Please try again later.';
        default:
          return `An error occurred (${error.status}). Please try again.`;
      }
    }
    
    return 'An unexpected error occurred. Please try again.';
  }

  /**
   * Check if error is network related
   * @param error - Error object
   * @returns boolean indicating if it's a network error
   */
  static isNetworkError(error: any): boolean {
    return error instanceof HttpErrorResponse && error.status === 0;
  }

  /**
   * Check if error is client side (4xx)
   * @param error - Error object
   * @returns boolean indicating if it's a client error
   */
  static isClientError(error: any): boolean {
    return error instanceof HttpErrorResponse && 
           error.status >= 400 && error.status < 500;
  }

  /**
   * Check if error is server side (5xx)
   * @param error - Error object
   * @returns boolean indicating if it's a server error
   */
  static isServerError(error: any): boolean {
    return error instanceof HttpErrorResponse && 
           error.status >= 500 && error.status < 600;
  }
}
