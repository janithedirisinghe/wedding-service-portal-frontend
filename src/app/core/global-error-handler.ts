import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private router: Router) {}

  handleError(error: any): void {
    console.error('Global error caught:', error);
    
    // Check if it's a routing error
    if (error?.code === 4002 || error?.message?.includes('Cannot match any routes')) {
      console.warn('Routing error detected, redirecting to home page');
      // Redirect to home page instead of showing the error
      this.router.navigate(['/home'], { replaceUrl: true });
      return;
    }

    // For other errors, just log them
    console.error('Unhandled error:', error);
  }
}
