// src/components/payment/StripePayment.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { CreditCard, CheckCircle, AlertTriangle, Loader } from 'lucide-react';
import axios from 'axios';

// Replace with your actual publishable key from environment variables
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripePaymentProps {
  orderId: string;
  amount: number;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

// Stripe Payment Form Component
const StripePaymentForm = ({ orderId, amount, onSuccess, onError }: StripePaymentProps) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  // Create a payment intent when the component mounts
  useEffect(() => {
    // Reset states
    setError(null);
    setLoading(true);
    
    // Create PaymentIntent on the server
    axios.post('/api/payment/stripe/initialize', { orderId })
      .then(response => {
        setClientSecret(response.data.clientSecret);
        setPaymentIntentId(response.data.paymentIntentId);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Error initializing payment');
        setLoading(false);
        onError(err.response?.data?.message || 'Error initializing payment');
      });
  }, [orderId, onError]);
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }
    
    // Get card element
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found');
      return;
    }
    
    setProcessing(true);
    setError(null);
    
    // Confirm card payment
    const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          // You can collect additional billing details if needed
        }
      }
    });
    
    if (paymentError) {
      setError(paymentError.message || 'An error occurred during payment processing');
      setProcessing(false);
      onError(paymentError.message || 'An error occurred during payment processing');
    } else if (paymentIntent.status === 'succeeded') {
      setSucceeded(true);
      setProcessing(false);
      onSuccess(paymentIntent.id);
    } else {
      setError('Payment status: ' + paymentIntent.status);
      setProcessing(false);
    }
  };
  
  const cardElementOptions = {
    style: {
      base: {
        color: '#f5f5f5',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    }
  };
  
  return (
    <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center mb-6">
        <CreditCard className="w-8 h-8 text-pink-400 mr-3" />
        <h3 className="text-xl font-medium">Credit Card Payment</h3>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader className="w-10 h-10 text-pink-400 animate-spin mb-4" />
          <p>Initializing payment...</p>
        </div>
      ) : succeeded ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
          <p className="text-gray-300 mb-4">
            Your payment has been processed successfully.
          </p>
          <p className="text-sm text-gray-400">
            Payment ID: {paymentIntentId}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <p className="text-gray-300 mb-4">
              You are about to make a payment of <span className="font-bold">${amount.toFixed(2)}</span> for your custom song order.
            </p>
            
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">
                Card Details
              </label>
              <div className="p-4 bg-gray-700 rounded-lg">
                <CardElement options={cardElementOptions} />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                * All transactions are secure and encrypted.
              </p>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={processing || !stripe}
              className={`w-full py-3 rounded-lg font-medium text-white transition ${
                processing || !stripe
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90'
              }`}
            >
              {processing ? (
                <span className="flex items-center justify-center">
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                  Processing...
                </span>
              ) : (
                'Pay Now'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

// Main Stripe Payment Wrapper Component
const StripePayment = ({ orderId, amount, onSuccess, onError }: StripePaymentProps) => {
  return (
    <Elements stripe={stripePromise}>
      <StripePaymentForm
        orderId={orderId}
        amount={amount}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};

export default StripePayment;