// app/dashboard/orders/page.tsx
'use client';

import { ShoppingCart, Plus } from 'lucide-react';
import Link from 'next/link';
import Sidebar from '@/components/layout/sidebar';
import OrderHistory from '@/components/dashboard/order-history';

export default function OrdersDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">My Orders</h1>
              <p className="text-gray-300">View and manage your custom music orders</p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Link 
                href="/order"
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-medium transition flex items-center justify-center text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Order
              </Link>
            </div>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm mb-8">
            <div className="flex items-center mb-6">
              <ShoppingCart className="w-6 h-6 mr-2 text-pink-400" />
              <h2 className="text-xl font-medium">Order History</h2>
            </div>
            
            <OrderHistory />
          </div>
        </div>
      </div>
    </div>
  );
}