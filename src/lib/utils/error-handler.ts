import { z } from 'zod';

/**
 * Error handling utility for consistent error processing across the application
 */

/**
 * Process API or validation errors into user-friendly messages
 * @param error The error object to process
 * @param defaultMessage Default message to show if error type cannot be determined
 * @returns A user-friendly error message
 */
export function handleError(error: unknown, defaultMessage = "An unexpected error occurred"): string {
  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    const firstError = error.errors[0];
    return `Validation error: ${firstError.message}`;
  }
  
  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message;
  }
  
  // Handle API error responses
  if (typeof error === 'object' && error !== null) {
    // Check for common API error formats
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
    
    if ('error' in error && typeof error.error === 'string') {
      return error.error;
    }
    
    if ('errors' in error && Array.isArray(error.errors) && error.errors.length > 0) {
      return Array.isArray(error.errors) 
        ? error.errors.join(', ') 
        : String(error.errors);
    }
  }
  
  // If we can't determine the error type, return the default message
  return defaultMessage;
}

/**
 * Log errors to console with additional context
 * @param error The error object
 * @param context Additional context about where the error occurred
 */
export function logError(error: unknown, context?: string): void {
  const prefix = context ? `[${context}] ` : '';
  
  if (error instanceof Error) {
    console.error(`${prefix}Error: ${error.message}`);
    if (error.stack) {
      console.debug(error.stack);
    }
  } else {
    console.error(`${prefix}Error:`, error);
  }
}

/**
 * Type guard to check if an object is an Error instance
 * @param error The object to check
 * @returns True if the object is an Error instance
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
} 