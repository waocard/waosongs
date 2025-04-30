// app/order/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Music, ChevronLeft, ChevronRight } from 'lucide-react';
import OrderSteps from '@/components/order/order-steps';
import BasicInfoStep from '@/components/order/basic-info-step';
import MusicPreferencesStep from '@/components/order/music-preferences-step';
import LyricsAndReferencesStep from '@/components/order/lyrics-references-step';
import FinalDetailsStep from '@/components/order/final-details-step';
import { OrderFormData } from '@/lib/types'; // Import the type

export default function OrderPage() {
  const [step, setStep] = useState(1);
  // Initialize with all required properties
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
  
  const router = useRouter();
  
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Submit order to API
    try {
      // In a real app, you would call your API here
      // const response = await submitOrder(orderData);
      
      // For now, just simulate success
      router.push('/order/success');
    } catch (error) {
      console.error('Failed to submit order:', error);
      // Handle error (show error message to user)
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-center mb-8">
          <Music className="w-8 h-8 text-pink-400 mr-2" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400">
            WaoSongs
          </h1>
        </div>

        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm mb-6">
          <h2 className="text-2xl font-bold text-center mb-2">Create Your Custom Song</h2>
          <p className="text-gray-300 text-center mb-6">Tell us what you're looking for and our artists will bring it to life</p>
          
          <OrderSteps currentStep={step} totalSteps={4} />
          
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
                >
                  <ChevronLeft className="w-5 h-5 mr-1" /> Previous
                </button>
              )}
              
              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg font-medium transition flex items-center ml-auto"
                >
                  Next <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-medium transition ml-auto"
                >
                  Place Order
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}