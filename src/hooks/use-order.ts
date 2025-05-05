// src/hooks/use-order.ts
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { OrderFormData } from '@/lib/types';
import { orderService } from '@/services/order-service';

interface UseOrderReturnType {
  isSubmitting: boolean;
  error: string | null;
  needsAuth: boolean;
  submitOrder: (orderData: OrderFormData) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  processPayment: (orderId: string, paymentId: string) => Promise<void>;
  resumeOrderAfterAuth: () => Partial<OrderFormData> | null;
  clearSavedOrder: () => void;
}

/**
 * Hook for managing order operations with authentication handling and robust error handling
 */
export function useOrder(): UseOrderReturnType {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);
  const router = useRouter();

  /**
   * Submit a new order
   */
  const submitOrder = useCallback(async (orderData: OrderFormData) => {
    setIsSubmitting(true);
    setError(null);
    setNeedsAuth(false);
    
    try {
      const response = await orderService.submitOrder(orderData);
      
      // Handle potential undefined response
      if (!response) {
        setError("Failed to create order: No response from server");
        return;
      }
      
      // Handle missing properties safely
      const orderId = response?.order?.id;
      
      if (!orderId) {
        setError("Failed to create order: Missing order ID in response");
        console.error("API response missing order ID:", response);
        return;
      }
      
      // Redirect to success page with order info
      router.push(`/order/success?orderId=${orderId}`);
    } catch (err) {
      // Handle authentication errors
      if (err instanceof Error) {
        if (err.message === 'NO_AUTH_TOKEN' || err.message === 'AUTH_EXPIRED') {
          setNeedsAuth(true);
          // Redirect to login page with returnUrl to come back to order page
          router.push(`/login?returnTo=${encodeURIComponent('/order')}`);
          return;
        }
        
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      console.error('Order submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [router]);

  /**
   * Cancel an existing order
   */
  const cancelOrder = useCallback(async (orderId: string) => {
    if (!orderId) {
      setError("Cannot cancel order: Missing order ID");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setNeedsAuth(false);
    
    try {
      await orderService.cancelOrder(orderId);
      
      // Redirect to dashboard after cancellation
      router.push('/dashboard');
    } catch (err) {
      // Handle authentication errors
      if (err instanceof Error) {
        if (err.message === 'NO_AUTH_TOKEN' || err.message === 'AUTH_EXPIRED') {
          setNeedsAuth(true);
          // Redirect to login page with returnUrl to come back to order page
          router.push(`/login?returnTo=${encodeURIComponent('/dashboard')}`);
          return;
        }
        
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      console.error(`Error cancelling order ${orderId}:`, err);
    } finally {
      setIsSubmitting(false);
    }
  }, [router]);

  /**
   * Process payment for an order
   */
  const processPayment = useCallback(async (orderId: string, paymentId: string) => {
    if (!orderId) {
      setError("Cannot process payment: Missing order ID");
      return;
    }
    
    if (!paymentId) {
      setError("Cannot process payment: Missing payment ID");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setNeedsAuth(false);
    
    try {
      const response = await orderService.processPayment(orderId, paymentId);
      
      // Check for successful response
      if (!response) {
        setError("Payment processing failed: No response from server");
        return;
      }
      
      // Redirect to dashboard after payment
      router.push('/dashboard');
    } catch (err) {
      // Handle authentication errors
      if (err instanceof Error) {
        if (err.message === 'NO_AUTH_TOKEN' || err.message === 'AUTH_EXPIRED') {
          setNeedsAuth(true);
          // Redirect to login page with returnUrl to come back to payment page
          router.push(`/login?returnTo=${encodeURIComponent(`/order/payment/${orderId}`)}`);
          return;
        }
        
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      console.error(`Error processing payment for order ${orderId}:`, err);
    } finally {
      setIsSubmitting(false);
    }
  }, [router]);

  /**
   * Retrieve saved order data after authentication
   */
  const resumeOrderAfterAuth = useCallback(() => {
    try {
      return orderService.getSavedOrderData();
    } catch (err) {
      console.error("Failed to retrieve saved order data:", err);
      setError("Failed to retrieve your previous order data");
      return null;
    }
  }, []);

  /**
   * Clear saved order data
   */
  const clearSavedOrder = useCallback(() => {
    try {
      orderService.clearSavedOrderData();
    } catch (err) {
      console.error("Failed to clear saved order data:", err);
    }
  }, []);

  return {
    isSubmitting,
    error,
    needsAuth,
    submitOrder,
    cancelOrder,
    processPayment,
    resumeOrderAfterAuth,
    clearSavedOrder
  };
}