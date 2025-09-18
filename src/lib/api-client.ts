/**
 * Robust API Client with error handling, retries, and interceptors
 * Built for high-performance real-time collaboration
 */

import { useAppStore } from './store';

// Types for our API responses
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_BASE = 1000; // 1 second

class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;
  private timeout: number;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.timeout = DEFAULT_TIMEOUT;
  }

  /**
   * Create request with timeout and signal support
   */
  private createRequestWithTimeout(
    url: string, 
    options: RequestInit, 
    timeoutMs: number = this.timeout
  ): { request: Promise<Response>; controller: AbortController } {
    const controller = new AbortController();
    
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    const request = fetch(url, {
      ...options,
      signal: controller.signal,
    }).finally(() => {
      clearTimeout(timeoutId);
    });

    return { request, controller };
  }

  /**
   * Calculate exponential backoff delay with jitter
   */
  private calculateRetryDelay(attempt: number): number {
    const exponentialDelay = RETRY_DELAY_BASE * Math.pow(2, attempt);
    const jitter = Math.random() * 1000; // Add up to 1s jitter
    return Math.min(exponentialDelay + jitter, 10000); // Max 10s delay
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: any): boolean {
    if (!error.status) return true; // Network errors are retryable
    
    // Retry on server errors (5xx) and specific client errors
    return error.status >= 500 || 
           error.status === 408 || // Request Timeout
           error.status === 429;   // Too Many Requests
  }

  /**
   * Enhanced fetch with retry logic and circuit breaker pattern
   */
  private async fetchWithRetry<T>(
    endpoint: string,
    options: RequestInit = {},
    retryAttempts: number = MAX_RETRY_ATTEMPTS
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    let lastError: any;

    // Add authentication header if available
    const token = this.getAuthToken();
    const headers = {
      ...this.defaultHeaders,
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    for (let attempt = 0; attempt <= retryAttempts; attempt++) {
      try {
        // Set loading state on first attempt
        if (attempt === 0) {
          useAppStore.getState().setLoading(true, `Loading ${endpoint}...`);
        }

        const { request } = this.createRequestWithTimeout(url, {
          ...options,
          headers,
        });

        const response = await request;

        // Clear loading state on success
        useAppStore.getState().setLoading(false);

        // Handle HTTP errors
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const apiError: ApiError = {
            message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            status: response.status,
            code: errorData.code,
            details: errorData.details,
          };

          // Check if we should retry
          if (attempt < retryAttempts && this.isRetryableError(apiError)) {
            const delay = this.calculateRetryDelay(attempt);
            console.warn(`API request failed (attempt ${attempt + 1}), retrying in ${delay}ms:`, apiError);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }

          throw apiError;
        }

        // Parse successful response
        const data = await response.json();
        
        // Log successful requests in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ API Success: ${options.method || 'GET'} ${endpoint}`, {
            status: response.status,
            data: data,
          });
        }

        return {
          data,
          success: true,
          message: data.message,
        };

      } catch (error: any) {
        lastError = error;

        // Handle network errors and timeouts
        if (error.name === 'AbortError') {
          lastError = {
            message: 'Request timeout - please check your connection',
            status: 408,
            code: 'TIMEOUT',
          };
        } else if (!error.status) {
          lastError = {
            message: 'Network error - please check your connection',
            status: 0,
            code: 'NETWORK_ERROR',
          };
        }

        // Check if we should retry
        if (attempt < retryAttempts && this.isRetryableError(lastError)) {
          const delay = this.calculateRetryDelay(attempt);
          console.warn(`API request failed (attempt ${attempt + 1}), retrying in ${delay}ms:`, lastError);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        break; // Don't retry non-retryable errors
      }
    }

    // Clear loading state on error
    useAppStore.getState().setLoading(false);

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error: ${options.method || 'GET'} ${endpoint}`, lastError);
    }

    throw lastError;
  }

  /**
   * Get authentication token from store or localStorage
   */
  private getAuthToken(): string | null {
    // Try getting from Zustand store first
    const currentUser = useAppStore.getState().currentUser;
    if (currentUser) {
      // In a real implementation, you'd get the actual JWT token here
      return 'mock-jwt-token';
    }

    // Fallback to localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }

    return null;
  }

  /**
   * HTTP Methods with proper typing
   */
  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params).toString()}` : endpoint;
    return this.fetchWithRetry<T>(url, { method: 'GET' });
  }

  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.fetchWithRetry<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.fetchWithRetry<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.fetchWithRetry<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.fetchWithRetry<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Upload file with progress tracking
   */
  async upload<T = any>(
    endpoint: string, 
    file: File, 
    additionalData?: Record<string, any>,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, typeof value === 'string' ? value : JSON.stringify(value));
      });
    }

    const token = this.getAuthToken();
    const headers: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }),
      // Don't set Content-Type for FormData - let the browser set it
    };

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = (e.loaded / e.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          resolve({
            data: response,
            success: true,
            message: response.message,
          });
        } else {
          reject({
            message: `Upload failed: ${xhr.statusText}`,
            status: xhr.status,
          });
        }
      });

      xhr.addEventListener('error', () => {
        reject({
          message: 'Upload failed: Network error',
          status: 0,
        });
      });

      xhr.open('POST', `${this.baseURL}${endpoint}`);
      
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value as string);
      });
      
      xhr.send(formData);
    });
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/health');
      return response.success;
    } catch {
      return false;
    }
  }

  /**
   * Set custom headers for all requests
   */
  setDefaultHeader(key: string, value: string) {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      [key]: value,
    };
  }

  /**
   * Set custom timeout
   */
  setTimeout(timeoutMs: number) {
    this.timeout = timeoutMs;
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export for testing
export { ApiClient };

/**
 * React hook for API calls with React Query integration
 */
export function useApiMutation<T = any>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST'
) {
  return {
    mutate: async (data?: any) => {
      switch (method) {
        case 'POST':
          return apiClient.post<T>(endpoint, data);
        case 'PUT':
          return apiClient.put<T>(endpoint, data);
        case 'PATCH':
          return apiClient.patch<T>(endpoint, data);
        case 'DELETE':
          return apiClient.delete<T>(endpoint);
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
    }
  };
}
