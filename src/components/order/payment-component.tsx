// src/components/order/payment-component.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, CheckCircle, AlertTriangle, Lock } from 'lucide-react';
import { useOrder } from '@/hooks/use-order';

interface PaymentComponentProps {
  orderId: string;
  amount: number;
}

export default function PaymentComponent({ orderId, amount }: PaymentComponentProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  
  const { isSubmitting, error, processPayment } = useOrder();
  const router = useRouter();
  
  // Validate form when inputs change
  useEffect(() => {
    const isValid = 
      cardNumber.replace(/\s/g, '').length === 16 &&
      cardName.trim().length > 0 &&
      expiryDate.length === 5 && /^\d{2}\/\d{2}$/.test(expiryDate) &&
      cvv.length === 3 && /^\d{3}$/.test(cvv);
      
    setIsFormValid(isValid);
  }, [cardNumber, cardName, expiryDate, cvv]);
  
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length > 16) {
      return cardNumber; // Don't allow more than 16 digits
    }
    
    // Add space after every 4 digits
    const parts = [];
    for (let i = 0; i < numbers.length; i += 4) {
      parts.push(numbers.substring(i, i + 4));
    }
    
    return parts.join(' ');
  };
  
  // Format expiry date with slash
  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length > 4) {
      return expiryDate; // Don't allow more than 4 digits
    }
    
    if (numbers.length <= 2) {
      return numbers;
    }
    
    return `${numbers.substring(0, 2)}/${numbers.substring(2)}`;
  };
  
  // Handle payment submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid || isSubmitting) {
      return;
    }
    
    try {
      // In a real app, you would use a payment processor like Stripe here
      // For this example, we'll simulate a payment by generating a fake payment ID
      const fakePaymentId = `pay_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
      
      await processPayment(orderId, fakePaymentId);
      setIsProcessed(true);
      
      // Redirect to dashboard after successful payment
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Payment error:', err);
      // Error is handled by the useOrder hook
    }
  };
  
  if (isProcessed) {
    return (
      <div className="bg-green-500 bg-opacity-20 p-6 rounded-lg text-center">
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">Payment Successful!</h3>
        <p className="text-gray-300 mb-2">Your payment has been processed successfully.</p>
        <p className="text-gray-400 text-sm">Redirecting to dashboard...</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium">Payment Details</h2>
        <div className="flex items-center text-gray-400 text-sm">
          <Lock className="w-4 h-4 mr-1" />
          <span>Secure Payment</span>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-500 bg-opacity-20 p-4 rounded-lg mb-6 flex items-start">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-300">Payment Error</p>
            <p className="text-red-200">{error}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Card Details */}
          <div>
            <label className="block mb-2 font-medium" htmlFor="cardNumber">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                className="w-full p-3 pl-10 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
              />
              <CreditCard className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            </div>
          </div>
          
          {/* Cardholder Name */}
          <div>
            <label className="block mb-2 font-medium" htmlFor="cardName">
              Cardholder Name
            </label>
            <input
              type="text"
              id="cardName"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="John Smith"
              className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
            />
          </div>
          
          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium" htmlFor="expiryDate">
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                placeholder="MM/YY"
                className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium" htmlFor="cvv">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                value={cvv}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 3) {
                    setCvv(val);
                  }
                }}
                placeholder="123"
                className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
              />
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Order Summary</h3>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Order Total:</span>
              <span className="font-medium">${amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Processing Fee:</span>
              <span className="font-medium">$0.00</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-600 mt-2">
              <span className="font-medium">Total to Pay:</span>
              <span className="font-bold">${amount.toFixed(2)}</span>
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full py-3 rounded-lg font-medium text-white transition ${
              isFormValid && !isSubmitting
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90'
                : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Processing...' : `Pay ${amount.toFixed(2)}`}
          </button>
          
          <p className="text-gray-400 text-xs text-center mt-4">
            By completing this purchase, you agree to our Terms of Service and Privacy Policy. 
            This is a demonstration and no actual payment will be processed.
          </p>
        </div>
      </form>
    </div>
  );
}