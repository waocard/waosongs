// src/components/payment/PaystackPayment.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, AlertTriangle, Loader } from 'lucide-react';
import { PaystackButton } from 'react-paystack';
import axios from 'axios';

interface PaystackPaymentProps {
  orderId: string;
  amount: number;
  email: string;
  onSuccess: (reference: string) => void;
  onError: (error: string) => void;
}

const PaystackPayment = ({ orderId, amount, email, onSuccess, onError }: PaystackPaymentProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentInitialized, setPaymentInitialized] = useState(false);
  const [reference, setReference] = useState<string>('');
  const [succeeded, setSucceeded] = useState(false);

  // Paystack public key from environment variables
  const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';

  // Initialize payment when the component mounts
  useEffect(() => {
    // Reset states
    setError(null);
    setLoading(true);
    
    // Initialize payment on the server
    axios.post('/api/payment/paystack/initialize', { 
      orderId, 
      email 
    })
      .then(response => {
        setReference(response.data.reference);
        setPaymentInitialized(true);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Error initializing payment');
        setLoading(false);
        onError(err.response?.data?.message || 'Error initializing payment');
      });
  }, [orderId, email, onError]);

  // Method to verify payment after successful callback
  const handlePaystackSuccess = async (reference: string) => {
    setLoading(true);
    
    try {
      // Verify payment on the server
      const response = await axios.get(`/api/payment/paystack/verify/${reference}`);
      
      if (response.data.success) {
        setSucceeded(true);
        onSuccess(reference);
      } else {
        setError('Payment verification failed. Please contact support.');
        onError('Payment verification failed');
      }
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err) && err.response?.data?.message 
        ? err.response.data.message 
        : 'Error verifying payment';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Config for Paystack button
  const paystackConfig = {
    publicKey: paystackPublicKey,
    email: email,
    amount: Math.round(amount * 100), // Convert to kobo/cents
    reference: reference,
    onSuccess: (reference: { reference: string }) => {
      handlePaystackSuccess(reference.reference);
    },
    onClose: () => {
      setError('Payment was cancelled');
    }
  };

  return (
    <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center mb-6">
        <CreditCard className="w-8 h-8 text-pink-400 mr-3" />
        <h3 className="text-xl font-medium">Paystack Payment</h3>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader className="w-10 h-10 text-pink-400 animate-spin mb-4" />
          <p>{succeeded ? 'Verifying payment...' : 'Initializing payment...'}</p>
        </div>
      ) : succeeded ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
          <p className="text-gray-300 mb-4">
            Your payment has been processed successfully.
          </p>
          <p className="text-sm text-gray-400">
            Reference: {reference}
          </p>
        </div>
      ) : (
        <div>
          <p className="text-gray-300 mb-4">
            You are about to make a payment of <span className="font-bold">${amount.toFixed(2)}</span> for your custom song order.
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
          
          <div className="mb-6">
            <div className="p-4 bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-300 mb-2">
                Email: <span className="font-medium">{email}</span>
              </p>
              <p className="text-sm text-gray-300">
                Amount: <span className="font-medium">${amount.toFixed(2)}</span>
              </p>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              * All transactions are secure and encrypted.
            </p>
          </div>
          
          {paymentInitialized ? (
            <div className="flex justify-center">
              <PaystackButton
                {...paystackConfig}
                className="w-full py-3 rounded-lg font-medium text-white transition bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90"
                text="Pay with Paystack"
              />
            </div>
          ) : (
            <button
              disabled
              className="w-full py-3 rounded-lg font-medium text-white transition bg-gray-600 cursor-not-allowed"
            >
              Initialize Payment...
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PaystackPayment;