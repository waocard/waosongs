// src/components/order/order-steps.tsx
import React from 'react';

interface OrderStepsProps {
  currentStep: number;
  totalSteps: number;
}

export default function OrderSteps({ currentStep, totalSteps }: OrderStepsProps) {
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="relative mb-8">
      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
        <div 
          style={{ width: `${progressPercent}%` }} 
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-pink-500 to-purple-600"
        ></div>
      </div>
      <div className="flex justify-between mt-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div 
            key={i} 
            className={`text-xs ${i + 1 <= currentStep ? 'text-pink-400' : 'text-gray-400'}`}
          >
            Step {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}