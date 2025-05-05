// app/order/page.tsx
'use client';

import { useState, useEffect, JSX } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Music, ChevronLeft, ChevronRight, AlertTriangle, User, LogIn } from 'lucide-react';
import OrderSteps from '@/components/order/order-steps';
import BasicInfoStep from '@/components/order/basic-info-step';
import MusicPreferencesStep from '@/components/order/music-preferences-step';
import LyricsAndReferencesStep from '@/components/order/lyrics-references-step';
import FinalDetailsStep from '@/components/order/final-details-step';
import { OrderFormData } from '@/lib/types';
import { useOrder } from '@/hooks/use-order';
import { orderService } from '@/services/order-service';
import AuthRequiredModal from '@/components/order/auth-required-modal';

export default function OrderPage(): JSX.Element {
  // Initialize with default values for all required properties
  const [orderData, setOrderData] = useState<OrderFormData>({
    category: '',
    occasion: '',
    songLength: '2-3', // Default value
    deadline: '',
    tempo: 'moderate', // Default value
    mood: '',
    references: '',
    lyrics: false, // Default value
    vocalGender: '',
    musicalStyle: '',
    instruments: [], // Empty array initially
    specificDetails: '',
    files: [] // Empty array initially
  });
  
  const [step, setStep] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const searchParams = useSearchParams();
  const isAuthenticated = orderService.isAuthenticated();
  const fromAuth = searchParams?.get('fromAuth') === 'true';
  
  const { 
    isSubmitting, 
    error, 
    needsAuth,
    submitOrder, 
    resumeOrderAfterAuth,
    clearSavedOrder
  } = useOrder();
  
  // Check for saved order data when coming back from authentication
  useEffect(() => {
    if (fromAuth) {
      const savedOrderData = resumeOrderAfterAuth();
      
      if (savedOrderData) {
        // Merge saved data with initial data to ensure all fields exist
        setOrderData(prevData => ({
          ...prevData,
          ...savedOrderData
        }));
      }
    }
  }, [fromAuth, resumeOrderAfterAuth]);
  
  // Show auth modal if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !showAuthModal) {
      const timer = setTimeout(() => {
        setShowAuthModal(true);
      }, 2000); // Show after 2 seconds to allow time to load the page
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, showAuthModal]);
  
  // Clean up saved order data when component unmounts
  useEffect(() => {
    return () => {
      // Only clear if the user is authenticated and we're not in the middle of auth flow
      if (isAuthenticated && !needsAuth) {
        clearSavedOrder();
      }
    };
  }, [isAuthenticated, needsAuth, clearSavedOrder]);
  
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data before submission
    if (!validateOrderData()) {
      return;
    }
    
    // Show auth modal if not authenticated
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    try {
      // Submit order to API - with error handling for undefined responses
      await submitOrder(orderData);
    } catch (err) {
      console.error('Error submitting order:', err);
      // Error is already handled in the useOrder hook
    }
  };
  
  // Validate order data based on current step
  const validateOrderData = () => {
    // Basic validation - we could add more specific validation per field
    if (step === 1) {
      if (!orderData.category || !orderData.occasion || !orderData.deadline) {
        alert("Please fill out all required fields.");
        return false;
      }
    } else if (step === 2) {
      if (!orderData.tempo || !orderData.mood) {
        alert("Please fill out all required fields.");
        return false;
      }
    } else if (step === 4) {
      if (!orderData.specificDetails) {
        alert("Please provide specific details.");
        return false;
      }
    }
    
    return true;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Auth Required Modal */}
        {showAuthModal && (
          <AuthRequiredModal 
            onClose={() => setShowAuthModal(false)} 
            returnUrl="/order" 
          />
        )}
        
        <div className="flex items-center justify-center mb-8">
          <Music className="w-8 h-8 text-pink-400 mr-2" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400">
            WaoSongs
          </h1>
        </div>

        {/* Authentication Status */}
        <div className="flex justify-end mb-4">
          {isAuthenticated ? (
            <div className="bg-green-500 bg-opacity-20 py-1 px-3 rounded-full text-sm flex items-center">
              <User className="w-4 h-4 mr-1 text-green-400" />
              <span>Signed In</span>
            </div>
          ) : (
            <Link 
              href="/login?returnTo=/order"
              className="bg-gray-800 bg-opacity-50 py-1 px-3 rounded-full text-sm flex items-center hover:bg-gray-700"
            >
              <LogIn className="w-4 h-4 mr-1" />
              <span>Sign In</span>
            </Link>
          )}
        </div>

        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm mb-6">
          <h2 className="text-2xl font-bold text-center mb-2">Create Your Custom Song</h2>
          <p className="text-gray-300 text-center mb-6">Tell us what you&apos;re looking for and our artists will bring it to life</p>
          
          <OrderSteps currentStep={step} totalSteps={4} />
          
          {error && (
            <div className="bg-red-500 bg-opacity-20 p-4 rounded-lg mb-6 flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-300">Error</p>
                <p className="text-red-200">{error}</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <BasicInfoStep orderData={orderData} setOrderData={setOrderData} />
            )}
            
            {step === 2 && (
              <MusicPreferencesStep orderData={orderData} setOrderData={setOrderData} />
            )}
            
            {step === 3 && (
              <LyricsAndReferencesStep orderData={orderData} setOrderData={setOrderData} />
            )}
            
            {step === 4 && (
              <FinalDetailsStep orderData={orderData} setOrderData={setOrderData} />
            )}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition flex items-center"
                  disabled={isSubmitting}
                >
                  <ChevronLeft className="w-5 h-5 mr-1" /> Previous
                </button>
              )}
              
              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (validateOrderData()) {
                      nextStep();
                    }
                  }}
                  className="px-6 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg font-medium transition flex items-center ml-auto"
                  disabled={isSubmitting}
                >
                  Next <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              ) : (
                <button
                  type="submit"
                  className={`px-6 py-2 ${
                    isSubmitting 
                      ? 'bg-gray-600 cursor-wait' 
                      : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90'
                  } rounded-lg font-medium transition ml-auto`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}