// src/app/payment/[orderId]/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { CheckCircle, AlertTriangle, Loader, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

// Import payment components
import StripePayment from '@/components/payment/StripePayment';
import PaystackPayment from '@/components/payment/PaystackPayment';

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<{
    id: string;
    category: string;
    songLength: number;
    deadline: string;
    totalPrice: number;
  } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paystack' | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [successDetails, setSuccessDetails] = useState<{
    reference: string;
    method: string;
  } | null>(null);
  
  const orderId = params.orderId as string;
  
  // Fetch order details on component mount
  useEffect(() => {
    if (!user) {
      router.push('/login?from=/payment/' + orderId);
      return;
    }
    
    setLoading(true);
    
    axios.get(`/api/orders/${orderId}`)
      .then(response => {
        setOrderDetails(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Error loading order details');
        setLoading(false);
      });
  }, [orderId, router, user]);
  
  // Handle successful payment
  const handlePaymentSuccess = useCallback((reference: string, method: 'stripe' | 'paystack') => {
    setPaymentSuccess(true);
    setSuccessDetails({
      reference,
      method
    });
    
    // Redirect to order success page after a delay
    setTimeout(() => {
      router.push(`/order/success?orderId=${orderId}`);
    }, 3000);
  }, [router, orderId]);
  
  // Handle payment error
  const handlePaymentError = (errorMsg: string) => {
    setError(errorMsg);
  };
  
  // If the user is already on a successful payment page (e.g. after returning from Paystack)
  useEffect(() => {
    // Check URL for payment reference
    const url = new URL(window.location.href);
    const reference = url.searchParams.get('reference');
    const trxref = url.searchParams.get('trxref');
    
    // If we have a reference, verify the payment
    if (reference && reference === trxref && !paymentSuccess) {
      setLoading(true);
      
      // Verify the payment
      axios.get(`/api/payment/paystack/verify/${reference}`)
        .then(response => {
          if (response.data.success) {
            handlePaymentSuccess(reference, 'paystack');
          } else {
            setError('Payment verification failed. Please contact support.');
          }
          setLoading(false);
        })
        .catch(err => {
          setError(err.response?.data?.message || 'Error verifying payment');
          setLoading(false);
        });
    }
  }, [paymentSuccess, handlePaymentSuccess, orderId]);
  
  // Component for selecting payment method
  const PaymentMethodSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <button 
        onClick={() => setPaymentMethod('stripe')}
        className={`p-6 rounded-xl transition border-2 flex items-center ${
          paymentMethod === 'stripe' 
            ? 'border-pink-500 bg-pink-500/10' 
            : 'border-gray-700 hover:border-gray-600'
        }`}
      >
        <div className="bg-white rounded p-2 mr-4">
          <div className="h-8 w-16 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
            STRIPE
          </div>
        </div>
        <div className="text-left">
          <h3 className="font-medium text-lg">Pay with Stripe</h3>
          <p className="text-sm text-gray-400">Credit/Debit Cards</p>
        </div>
      </button>
      
      <button 
        onClick={() => setPaymentMethod('paystack')}
        className={`p-6 rounded-xl transition border-2 flex items-center ${
          paymentMethod === 'paystack' 
            ? 'border-pink-500 bg-pink-500/10' 
            : 'border-gray-700 hover:border-gray-600'
        }`}
      >
        <div className="bg-white rounded p-2 mr-4">
          <div className="h-8 w-16 bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold">
            PAYSTACK
          </div>
        </div>
        <div className="text-left">
          <h3 className="font-medium text-lg">Pay with Paystack</h3>
          <p className="text-sm text-gray-400">Cards & Bank Transfers</p>
        </div>
      </button>
    </div>
  );
  
  // If loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col items-center justify-center py-16">
            <Loader className="w-16 h-16 text-pink-400 animate-spin mb-6" />
            <h2 className="text-2xl font-bold mb-2">Loading...</h2>
            <p className="text-gray-300">Please wait while we prepare your payment</p>
          </div>
        </div>
      </div>
    );
  }
  
  // If error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col items-center justify-center py-16">
            <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <Link 
              href="/dashboard" 
              className="px-6 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg font-medium transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // If payment success
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-8 backdrop-blur-sm text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-xl text-gray-300 mb-8">
              Your payment has been processed successfully.
            </p>
            <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg inline-block mx-auto mb-8">
              <p className="text-sm text-gray-300 mb-1">
                Payment Method: <span className="font-medium">{successDetails?.method}</span>
              </p>
              <p className="text-sm text-gray-300">
                Reference: <span className="font-medium">{successDetails?.reference}</span>
              </p>
            </div>
            <p className="text-gray-400 mb-8">
              You will be redirected to the success page shortly...
            </p>
            <Link 
              href="/dashboard" 
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-medium transition inline-block"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Main payment screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/dashboard" className="flex items-center text-gray-300 hover:text-white mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm mb-6">
          <h2 className="text-2xl font-bold mb-2">Checkout</h2>
          <p className="text-gray-300 mb-6">Complete your payment to place your order</p>
          
          {/* Order Summary */}
          <div className="bg-gray-700 bg-opacity-50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-medium mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Order ID:</span>
                <span>{orderDetails?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Category:</span>
                <span>{orderDetails?.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Song Length:</span>
                <span>{orderDetails?.songLength} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Deadline:</span>
                <span>{orderDetails?.deadline}</span>
              </div>
              <div className="border-t border-gray-600 pt-3 mt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${orderDetails?.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Method Selection */}
          <h3 className="text-xl font-medium mb-4">Payment Method</h3>
          {!paymentMethod ? (
            <PaymentMethodSelection />
          ) : paymentMethod === 'stripe' ? (
            <StripePayment 
              orderId={orderId} 
              amount={orderDetails?.totalPrice || 0} 
              onSuccess={(paymentId) => handlePaymentSuccess(paymentId, 'stripe')}
              onError={handlePaymentError}
            />
          ) : (
            <PaystackPayment 
              orderId={orderId}
              amount={orderDetails?.totalPrice || 0} 
              email={user?.email || ''}
              onSuccess={(reference) => handlePaymentSuccess(reference, 'paystack')}
              onError={handlePaymentError}
            />
          )}
          
          {paymentMethod && (
            <button 
              onClick={() => setPaymentMethod(null)}
              className="mt-4 text-gray-400 hover:text-white text-sm flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Change payment method
            </button>
          )}
        </div>
        
        {/* Secure Payment Notice */}
        <div className="flex justify-center text-center">
          <div className="text-sm text-gray-400 max-w-lg">
            <p className="mb-2">🔒 All payments are secure and encrypted</p>
            <p>
              By proceeding with the payment, you agree to our
              <Link href="/terms" className="text-pink-400 hover:text-pink-300 mx-1">Terms of Service</Link>
              and
              <Link href="/privacy" className="text-pink-400 hover:text-pink-300 ml-1">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}