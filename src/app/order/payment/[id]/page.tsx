// app/order/payment/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Music, ArrowLeft, ShoppingCart, Loader } from 'lucide-react';
import PaymentComponent from '@/components/order/payment-component';
import { orderService } from '@/services/order-service';
import { Order } from '@/lib/types';

type OrderPaymentPageProps = {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function OrderPaymentPage({ params }: OrderPaymentPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const orderId = params.id;
  
  useEffect(() => {
    // Fetch order details
    const fetchOrderDetails = async () => {
      try {
        const orderData = await orderService.getOrderById(orderId);
        
        // Check if order is already paid
        if (orderData.paymentStatus === 'paid') {
          router.push('/dashboard');
          return;
        }
        
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
            href="/dashboard"
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-medium transition inline-block"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-center mb-8">
          <Music className="w-8 h-8 text-pink-400 mr-2" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400">
            WaoSongs
          </h1>
        </div>
        
        <div className="mb-6">
          <Link href="/dashboard" className="text-gray-300 hover:text-white flex items-center">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2 flex items-center">
            <ShoppingCart className="w-6 h-6 mr-2" />
            Complete Your Order
          </h2>
          <p className="text-gray-300">
            Please review your order details and provide payment information to continue.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-medium mb-4">Order Summary</h3>
              
              {orderDetails && (
                <div className="space-y-4">
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Music className="w-5 h-5 text-pink-400 mr-2" />
                      <h4 className="font-medium">{orderDetails.category}</h4>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{orderDetails.occasion}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Song Length:</span>
                        <span>{orderDetails.songLength} minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Delivery By:</span>
                        <span>{orderDetails.deadline}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Includes Vocals:</span>
                        <span>{orderDetails.lyrics ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Specifications:</h4>
                    <div className="space-y-2">
                      <div className="bg-gray-700 bg-opacity-50 px-3 py-2 rounded-lg text-sm">
                        <span className="text-gray-400">Tempo:</span> {orderDetails.tempo}
                      </div>
                      <div className="bg-gray-700 bg-opacity-50 px-3 py-2 rounded-lg text-sm">
                        <span className="text-gray-400">Mood:</span> {orderDetails.mood}
                      </div>
                      <div className="bg-gray-700 bg-opacity-50 px-3 py-2 rounded-lg text-sm">
                        <span className="text-gray-400">Style:</span> {orderDetails.musicalStyle || 'Not specified'}
                      </div>
                    </div>
                  </div>
                  
                  {orderDetails.instruments && orderDetails.instruments.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Instruments:</h4>
                      <div className="flex flex-wrap gap-2">
                        {orderDetails.instruments.map((instrument: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                            {instrument}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Payment Form */}
          <div className="lg:col-span-3">
            {orderDetails && (
              <PaymentComponent orderId={orderId} amount={orderDetails.totalPrice} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}