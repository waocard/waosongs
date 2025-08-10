// src/components/dashboard/order-history.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, DollarSign, ExternalLink, Loader, Music, Search } from 'lucide-react';
import { orderService } from '@/services/order-service';
import { OrderWithSong } from '@/lib/types';

export default function OrderHistory() {
  const [orders, setOrders] = useState<OrderWithSong[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await orderService.getUserOrders();
        setOrders(ordersData);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err instanceof Error ? err.message : 'Failed to load your orders');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.occasion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.song?.title && order.song.title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Format status for display
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };
  
  // Get status color class
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending':
        return 'bg-amber-500';
      case 'processing':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Get payment status label
  const getPaymentLabel = (status: string) => {
    switch(status) {
      case 'unpaid':
        return 'Unpaid';
      case 'paid':
        return 'Paid';
      case 'refunded':
        return 'Refunded';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader className="w-8 h-8 text-pink-400 animate-spin mb-4" />
        <p>Loading your orders...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-500 bg-opacity-20 p-4 rounded-lg">
        <p className="font-medium">Error loading orders</p>
        <p className="text-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-pink-400 hover:text-pink-300 text-sm"
        >
          Try refreshing the page
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* Search */}
        <div className="relative">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search orders..." 
            className="w-full sm:w-64 p-2 pl-10 rounded-lg bg-gray-800 bg-opacity-50 focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
          />
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
        </div>
        
        {/* Status Filter */}
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-800 bg-opacity-50 rounded-lg p-2 focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      {filteredOrders.length === 0 ? (
        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-8 text-center">
          <Music className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No orders found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'You haven\'t placed any orders yet'
            }
          </p>
          <Link 
            href="/order" 
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-medium transition inline-block"
          >
            Create Your First Song
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-medium">
                    {order.song?.title || `${order.category} for ${order.occasion}`}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm text-gray-400">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Created: {order.createdAt}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Deadline: {order.deadline}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      <span>${order.totalPrice.toFixed(2)} - {getPaymentLabel(order.paymentStatus || 'unpaid')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(order.status)} bg-opacity-20 flex items-center`}>
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(order.status)} mr-2`}></span>
                    {getStatusLabel(order.status)}
                  </span>
                  
                  {/* Action buttons based on order status */}
                  {order.paymentStatus === 'unpaid' && (
                    <Link
                      href={`/order/payment/${order.id}`}
                      className="px-4 py-1.5 bg-pink-500 hover:bg-pink-600 rounded-lg text-sm font-medium transition"
                    >
                      Pay Now
                    </Link>
                  )}
                  
                  {order.song && (
                    <Link
                      href={`/dashboard/songs/${order.song.id}`}
                      className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Song
                    </Link>
                  )}
                </div>
              </div>
              
              {/* Progress bar for processing orders */}
              {order.status === 'processing' && order.song && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span>{order.song.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full" 
                      style={{ width: `${order.song.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}