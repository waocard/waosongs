// src/components/order/final-details-step.tsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { OrderFormData } from '@/lib/types';

type FinalDetailsStepProps = {
  orderData: OrderFormData;
  setOrderData: React.Dispatch<React.SetStateAction<OrderFormData>>;
};

export default function FinalDetailsStep({ orderData, setOrderData }: FinalDetailsStepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderData({
      ...orderData,
      [name]: value
    });
  };

  // Helper function to find category name by ID
  const getCategoryName = (categoryId: string) => {
    const categories = [
      { id: 'love', name: 'Love Song' },
      { id: 'birthday', name: 'Birthday Song' },
      { id: 'wedding', name: 'Wedding Music' },
      { id: 'anniversary', name: 'Anniversary Song' },
      { id: 'celebration', name: 'Celebration' },
      { id: 'business', name: 'Business Jingle' },
    ];
    
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Not selected';
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium mb-4">Final Details</h3>
      
      <div>
        <label className="block mb-2 font-medium" htmlFor="specificDetails">
          Specific Details & Instructions
        </label>
        <textarea
          id="specificDetails"
          name="specificDetails"
          rows={5}
          placeholder="Tell us the story, emotions, or message you want to convey. The more details, the better the result."
          value={orderData.specificDetails}
          onChange={handleChange}
          className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
        ></textarea>
      </div>
      
      <div className="bg-pink-900 bg-opacity-30 p-4 rounded-lg">
        <div className="flex items-start">
          <AlertTriangle className="w-6 h-6 text-pink-400 mr-3 flex-shrink-0 mt-1" />
          <div>
            <p className="font-medium mb-1">Important Notes</p>
            <ul className="text-sm text-gray-300 list-disc pl-4 space-y-1">
              <li>Our artists will begin working after payment is confirmed</li>
              <li>You&apos;ll receive a preview to approve before final delivery</li>
              <li>Revisions may extend the delivery timeline</li>
              <li>Copyright of the music is transferred to you upon completion</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 p-6 rounded-lg">
        <h4 className="font-medium mb-3">Order Summary</h4>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-300">Category:</span>
            <span>{getCategoryName(orderData.category)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Song Length:</span>
            <span>{orderData.songLength} minutes</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Includes Vocals:</span>
            <span>{orderData.lyrics ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Delivery By:</span>
            <span>{orderData.deadline ? new Date(orderData.deadline).toLocaleDateString() : 'Not specified'}</span>
          </div>
        </div>
        
        <div className="flex justify-between font-bold text-lg mb-2">
          <span>Total:</span>
          <span>$199.99</span>
        </div>
        <p className="text-xs text-gray-400 mb-2">Price may vary based on complexity and rush orders</p>
      </div>
    </div>
  );
}