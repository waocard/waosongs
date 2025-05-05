// src/services/order-service.ts
import { OrderFormData, Order, OrderWithSong } from '@/lib/types';

/**
 * Service for handling order-related operations with robust error handling
 */
export class OrderService {
  private apiUrl: string;
  
  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.waosongs.com';
  }

  /**
   * Check if user is authenticated
   * @returns True if authenticated, false otherwise
   */
  isAuthenticated(): boolean {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return false;
    }
    
    // Check if token exists
    const token = localStorage.getItem('token');
    return !!token;
  }

  /**
   * Save order data to local storage for retrieval after authentication
   * @param orderData Order form data to save
   */
  saveOrderDataToLocalStorage(orderData: OrderFormData): void {
    try {
      // Files can't be serialized to JSON, so we need to handle them separately
      const orderDataForStorage = {
        ...orderData,
        hasFiles: orderData.files && orderData.files.length > 0,
        files: [] // Empty the files array for storage
      };
      
      localStorage.setItem('pendingOrderData', JSON.stringify(orderDataForStorage));
    } catch (error) {
      console.error('Error saving order data to localStorage:', error);
      // Silent fail - don't throw from localStorage operations
    }
  }

  /**
   * Get saved order data from local storage
   * @returns Saved order data or null if none exists
   */
  getSavedOrderData(): Partial<OrderFormData> | null {
    try {
      const savedData = localStorage.getItem('pendingOrderData');
      
      if (!savedData) {
        return null;
      }
      
      return JSON.parse(savedData);
    } catch (error) {
      console.error('Error parsing saved order data:', error);
      return null;
    }
  }

  /**
   * Clear saved order data from local storage
   */
  clearSavedOrderData(): void {
    try {
      localStorage.removeItem('pendingOrderData');
    } catch (error) {
      console.error('Error clearing saved order data:', error);
      // Silent fail - don't throw from localStorage operations
    }
  }

  /**
   * Submit a new order with robust error handling
   * @param orderData Order form data
   * @returns Promise with the order response
   * @throws Error if not authenticated or other API issues
   */
  async submitOrder(orderData: OrderFormData): Promise<{ order: Order }> {
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Save order data for later
        this.saveOrderDataToLocalStorage(orderData);
        throw new Error('NO_AUTH_TOKEN');
      }
      
      // Create a FormData object to handle file uploads
      const formData = new FormData();
      
      // Add basic form data
      Object.entries(orderData).forEach(([key, value]) => {
        if (key !== 'files' && key !== 'instruments') {
          formData.append(key, String(value));
        }
      });
      
      // Add instruments as JSON string
      if (Array.isArray(orderData.instruments)) {
        formData.append('instruments', JSON.stringify(orderData.instruments));
      } else {
        // Default to empty array if instruments is undefined
        formData.append('instruments', JSON.stringify([]));
      }
      
      // Add files
      if (orderData.files && orderData.files.length > 0) {
        Array.from(orderData.files).forEach((file, index) => {
          formData.append(`file${index}`, file);
        });
      }
      
      // Make API request
      const response = await fetch(`${this.apiUrl}/api/orders`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      
      // Handle API errors
      if (!response.ok) {
        // Check if the error is due to authentication
        if (response.status === 401) {
          // Save order data for later
          this.saveOrderDataToLocalStorage(orderData);
          throw new Error('AUTH_EXPIRED');
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
      }
      
      // Parse the response carefully
      const responseData = await response.json();
      
      // Validate response structure
      if (!responseData) {
        throw new Error('Empty response from server');
      }
      
      if (!responseData.order) {
        throw new Error('Missing order data in response');
      }
      
      if (!responseData.order.id) {
        throw new Error('Missing order ID in response');
      }
      
      // Clear any saved order data on success
      this.clearSavedOrderData();
      
      return responseData;
    } catch (error) {
      // Re-throw authentication errors to be handled by components
      if (error instanceof Error && 
         (error.message === 'NO_AUTH_TOKEN' || error.message === 'AUTH_EXPIRED')) {
        throw error;
      }
      
      console.error('Error submitting order:', error);
      throw error;
    }
  }

  /**
   * Get all orders for the current user
   * @returns Promise with the user's orders
   * @throws Error if not authenticated
   */
  async getUserOrders(): Promise<OrderWithSong[]> {
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('NO_AUTH_TOKEN');
      }
      
      
      // Make API request
      const response = await fetch(`${this.apiUrl}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Handle API errors
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('AUTH_EXPIRED');
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
      }
      
      const orders = await response.json();
      
      // Ensure orders is an array
      if (!Array.isArray(orders)) {
        console.warn('API returned non-array orders:', orders);
        return [];
      }
      
      return orders;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  }

  /**
   * Get order by ID
   * @param id Order ID
   * @returns Promise with the order details
   * @throws Error if not authenticated
   */
  async getOrderById(id: string): Promise<OrderWithSong> {
    // Validate input
    if (!id) {
      throw new Error('Order ID is required');
    }
    
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('NO_AUTH_TOKEN');
      }
      
      
      // Make API request
      const response = await fetch(`${this.apiUrl}/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Handle API errors
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('AUTH_EXPIRED');
        }
        
        if (response.status === 404) {
          throw new Error(`Order with ID ${id} not found`);
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
      }
      
      const order = await response.json();
      
      // Validate order structure
      if (!order) {
        throw new Error('Empty response from server');
      }
      
      return order;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
  }

  /**
   * Process payment for an order
   * @param id Order ID
   * @param paymentId Payment ID from payment processor
   * @returns Promise with the updated order
   * @throws Error if not authenticated
   */
  async processPayment(id: string, paymentId: string): Promise<Order> {
    // Validate inputs
    if (!id) {
      throw new Error('Order ID is required');
    }
    
    if (!paymentId) {
      throw new Error('Payment ID is required');
    }
    
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('NO_AUTH_TOKEN');
      }
      
      // Make API request
      const response = await fetch(`${this.apiUrl}/api/orders/${id}/payment`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ paymentId })
      });
      
      // Handle API errors
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('AUTH_EXPIRED');
        }
        
        if (response.status === 404) {
          throw new Error(`Order with ID ${id} not found`);
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
      }
      
      const updatedOrder = await response.json();
      
      // Validate order structure
      if (!updatedOrder) {
        throw new Error('Empty response from server');
      }
      
      return updatedOrder;
    } catch (error) {
      console.error(`Error processing payment for order ${id}:`, error);
      throw error;
    }
  }

  /**
   * Cancel an order
   * @param id Order ID
   * @returns Promise with the cancelled order
   * @throws Error if not authenticated
   */
  async cancelOrder(id: string): Promise<Order> {
    // Validate input
    if (!id) {
      throw new Error('Order ID is required');
    }
    
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('NO_AUTH_TOKEN');
      }
      
      // Make API request
      const response = await fetch(`${this.apiUrl}/api/orders/${id}/cancel`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Handle API errors
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('AUTH_EXPIRED');
        }
        
        if (response.status === 404) {
          throw new Error(`Order with ID ${id} not found`);
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
      }
      
      const cancelledOrder = await response.json();
      
      // Validate order structure
      if (!cancelledOrder) {
        throw new Error('Empty response from server');
      }
      
      return cancelledOrder;
    } catch (error) {
      console.error(`Error cancelling order ${id}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const orderService = new OrderService();