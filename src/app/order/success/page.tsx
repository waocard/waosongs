// app/order/success/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Music, ArrowRight, Loader } from 'lucide-react';
import { orderService } from '@/services/order-service';
import { Order } from '@/lib/types';

function OrderSuccessContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  useEffect(() => {
    // Redirect to order page if no orderId is provided
    if (!orderId) {
      router.push('/order');
      return;
    }
    
    // Fetch order details
    const fetchOrderDetails = async () => {
      try {
        const orderData = await orderService.getOrderById(orderId);
        setOrderDetails(orderData);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId, router]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white flex flex-col items-center justify-center">
        <Loader className="w-12 h-12 text-pink-400 animate-spin mb-4" />
        <p className="text-xl">Loading your order details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-8 backdrop-blur-sm max-w-lg w-full text-center">
          <div className="bg-red-500 bg-opacity-20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Music className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <Link
            href="/order"
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-medium transition inline-block"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white flex flex-col items-center justify-center p-4">
      <div className="bg-gray-800 bg-opacity-50 rounded-xl p-8 backdrop-blur-sm max-w-lg w-full text-center">
        <div className="bg-green-500 bg-opacity-20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Order Placed Successfully!</h1>
        
        <p className="text-gray-300 mb-6">
          Thank you for your order. We&apos;ve received your request and our artists will start working on your custom song soon.
        </p>
        
        {orderDetails && (
          <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4 text-left mb-8">
            <h2 className="font-medium mb-3">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Order ID:</span>
                <span>{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Category:</span>
                <span>{orderDetails.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Delivery By:</span>
                <span>{orderDetails.deadline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span>{orderDetails.status}</span>
              </div>
              <div className="flex justify-between font-medium border-t border-gray-600 pt-2 mt-2">
                <span>Total:</span>
                <span>${orderDetails.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-medium transition inline-block w-full"
          >
            Go to Dashboard
          </Link>
          
          <Link
            href="/"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition flex items-center justify-center w-full"
          >
            Back to Home <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white flex flex-col items-center justify-center">
        <Loader className="w-12 h-12 text-pink-400 animate-spin mb-4" />
        <p className="text-xl">Loading...</p>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}