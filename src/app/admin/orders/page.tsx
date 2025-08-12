// src/app/admin/orders/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  ChevronDown, 
  ArrowLeft,
  Download,
  Eye,
  Check,
  X,
  Music,
  Calendar,
  Clock,
  User,
  DollarSign,
  Filter,
  MessageSquare,
  FileText,
  RefreshCw
} from 'lucide-react';
import { getAdminOrders } from '@/lib/api';
import { AdminOrdersResponse } from '@/lib/types';
//import Sidebar from '@/components/admin/admin-sidebar'; // Using AdminSidebar from layout

// Define types for our component
interface Customer {
  name: string;
  email: string;
  avatar: string;
}

interface Specifications {
  length: string;
  tempo: string;
  mood: string;
  vocals: string;
  instruments: string[];
}

interface Order {
  id: string;
  title: string;
  customer: Customer;
  category: string;
  artist: string;
  status: 'pending' | 'assigned' | 'completed' | 'cancelled';
  price: number;
  date: string;
  deadline: string;
  requirements: string;
  specifications: Specifications;
}

// Mock order data
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    title: 'Forever Yours',
    customer: {
      name: 'John Smith',
      email: 'john@example.com',
      avatar: 'JS'
    },
    category: 'Love Song',
    artist: 'Alex Morgan',
    status: 'pending',
    price: 199.99,
    date: 'April 1, 2025',
    deadline: 'May 5, 2025',
    requirements: 'A romantic love song for my wife\'s birthday. Piano-based with emotional lyrics about our journey together.',
    specifications: {
      length: '3-4 minutes',
      tempo: 'Moderate',
      mood: 'Romantic, Heartfelt',
      vocals: 'Male',
      instruments: ['Piano', 'Guitar', 'Strings']
    }
  },
  {
    id: 'ORD-002',
    title: 'Birthday Celebration',
    customer: {
      name: 'Emily Johnson',
      email: 'emily@example.com',
      avatar: 'EJ'
    },
    category: 'Birthday Song',
    artist: 'Maria Kim',
    status: 'assigned',
    price: 149.99,
    date: 'April 5, 2025',
    deadline: 'April 30, 2025',
    requirements: 'An upbeat birthday song for my best friend turning 30. Should be fun and celebratory.',
    specifications: {
      length: '2-3 minutes',
      tempo: 'Upbeat',
      mood: 'Celebratory, Fun',
      vocals: 'Female',
      instruments: ['Piano', 'Drums', 'Bass']
    }
  },
  {
    id: 'ORD-003',
    title: 'Corporate Jingle',
    customer: {
      name: 'Tech Innovations Inc.',
      email: 'marketing@techinnovations.com',
      avatar: 'TI'
    },
    category: 'Business Jingle',
    artist: 'Alex Morgan',
    status: 'completed',
    price: 299.99,
    date: 'March 10, 2025',
    deadline: 'March 25, 2025',
    requirements: 'A modern jingle for our tech company\'s new product launch. Should be memorable and convey innovation.',
    specifications: {
      length: '1-2 minutes',
      tempo: 'Moderate',
      mood: 'Professional, Innovative',
      vocals: 'None',
      instruments: ['Synthesizer', 'Drums', 'Bass']
    }
  },
  {
    id: 'ORD-004',
    title: 'Anniversary Waltz',
    customer: {
      name: 'Michael Davis',
      email: 'michael@example.com',
      avatar: 'MD'
    },
    category: 'Anniversary Song',
    artist: 'David Chen',
    status: 'assigned',
    price: 249.99,
    date: 'April 10, 2025',
    deadline: 'May 15, 2025',
    requirements: 'A beautiful waltz for our 25th wedding anniversary. Should be elegant and timeless.',
    specifications: {
      length: '3-4 minutes',
      tempo: 'Moderate',
      mood: 'Elegant, Romantic',
      vocals: 'None',
      instruments: ['Piano', 'Violin', 'Cello']
    }
  },
  {
    id: 'ORD-005',
    title: 'Birthday Rap',
    customer: {
      name: 'Sophia Martinez',
      email: 'sophia@example.com',
      avatar: 'SM'
    },
    category: 'Birthday Song',
    artist: 'Unassigned',
    status: 'pending',
    price: 179.99,
    date: 'April 15, 2025',
    deadline: 'May 20, 2025',
    requirements: 'A fun rap song for my brother\'s 21st birthday. Should mention his love for basketball and video games.',
    specifications: {
      length: '2-3 minutes',
      tempo: 'Fast',
      mood: 'Fun, Energetic',
      vocals: 'Male',
      instruments: ['Beat', 'Synthesizer']
    }
  },
];

// Mock artists data for assignment dropdown
const mockArtists = [
  { id: 1, name: 'Alex Morgan', availability: 'Available' },
  { id: 2, name: 'Maria Kim', availability: 'Available' },
  { id: 3, name: 'David Chen', availability: 'Busy' },
  { id: 4, name: 'Sarah Johnson', availability: 'Available' },
  { id: 5, name: 'James Wilson', availability: 'On Leave' },
];

export default function OrderManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isViewingOrder, setIsViewingOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAssigningArtist, setIsAssigningArtist] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState('');
  const [orderHistory, setOrderHistory] = useState<Array<{date: string, action: string, user: string}>>([
    { date: 'April 1, 2025 09:15 AM', action: 'Order placed', user: 'John Smith' },
    { date: 'April 1, 2025 10:30 AM', action: 'Payment confirmed', user: 'System' },
    { date: 'April 2, 2025 11:45 AM', action: 'Order status updated to Pending', user: 'Admin' }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ordersData, setOrdersData] = useState<AdminOrdersResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const router = useRouter();
  
  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAdminOrders(currentPage, 10);
      setOrdersData(data);
      setTotalPages(data.pagination.pages);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);
  
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
  
  // Use API data if available, otherwise use mock data
  const orders = ordersData?.orders || mockOrders;
  
  // Filtered orders based on search and filters
  const filteredOrders = orders.filter((order) => {
    // Check if it's a mock order (has title) or API order (has song.title)
    const isMockOrder = 'title' in order;
    const orderTitle = isMockOrder ? (order as Order).title : order.song?.title || '';
    const orderArtist = isMockOrder ? (order as Order).artist : undefined;
    
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (orderTitle && orderTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customer?.name && order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (orderArtist && orderArtist.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const orderStatus = isMockOrder ? (order as Order).status : order.song?.status || order.status;
    const matchesStatus = statusFilter === 'all' || orderStatus === statusFilter;
    const matchesCategory = categoryFilter === 'all' || order.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });
  
  const handleViewOrder = (order: Order | AdminOrdersResponse['orders'][0]) => {
    // Convert API order to Order format if needed
    if ('song' in order) {
      const apiOrder = order as AdminOrdersResponse['orders'][0];
      const convertedOrder: Order = {
        id: apiOrder.id,
        title: apiOrder.song?.title || `${apiOrder.category} for ${apiOrder.occasion}`,
        customer: {
          name: apiOrder.customer.name,
          email: apiOrder.customer.email,
          avatar: apiOrder.customer.name.split(' ').map(n => n[0]).join('')
        },
        category: apiOrder.category,
        artist: 'Unassigned',
        status: (apiOrder.song?.status || apiOrder.status) as Order['status'],
        price: apiOrder.totalPrice,
        date: apiOrder.createdAt,
        deadline: apiOrder.deadline,
        requirements: '',
        specifications: {
          length: '3-4 minutes',
          tempo: 'Moderate',
          mood: 'Custom',
          vocals: 'TBD',
          instruments: []
        }
      };
      setSelectedOrder(convertedOrder);
    } else {
      setSelectedOrder(order as Order);
    }
    setIsViewingOrder(true);
    
    // In a real application, you would fetch order history here
    // For now, we're using mock data that's already set
  };
  
  const handleBack = () => {
    if (isViewingOrder) {
      setIsViewingOrder(false);
      setSelectedOrder(null);
    } else {
      router.push('/admin');
    }
  };
  
  const handleAssignArtist = () => {
    setIsAssigningArtist(true);
  };
  
  const confirmAssignArtist = () => {
    if (selectedOrder && selectedArtist) {
      // In a real app, you would make an API call here
      // For now, just log the assignment
      console.log(`Assigning ${selectedArtist} to order ${selectedOrder.id}`);
      
      // Add to order history
      setOrderHistory([
        ...orderHistory,
        {
          date: new Date().toLocaleString(),
          action: `Artist ${selectedArtist} assigned to order`,
          user: 'Admin'
        }
      ]);
      
      // Close the assignment dialog
      setIsAssigningArtist(false);
    }
  };
  
  const cancelAssignArtist = () => {
    setIsAssigningArtist(false);
    setSelectedArtist('');
  };
  
  const handleUpdateStatus = (newStatus: 'pending' | 'assigned' | 'completed' | 'cancelled') => {
    if (selectedOrder) {
      // In a real app, you would make an API call here
      console.log(`Updating order ${selectedOrder.id} status to ${newStatus}`);
      
      // Add to order history
      setOrderHistory([
        ...orderHistory,
        {
          date: new Date().toLocaleString(),
          action: `Order status updated to ${getStatusLabel(newStatus)}`,
          user: 'Admin'
        }
      ]);
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'pending':
        return 'Pending Assignment';
      case 'assigned':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending':
        return 'bg-amber-500';
      case 'assigned':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white">
      <div className="flex">
        <div className="flex-1 p-6 md:p-8">
          <button 
            onClick={handleBack}
            className="flex items-center text-gray-300 hover:text-white mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {isViewingOrder ? 'Back to Orders' : 'Back to Dashboard'}
          </button>
          
          {!isViewingOrder ? (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">Order Management</h1>
                  <p className="text-gray-300">View and manage customer orders</p>
                </div>
                
                <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
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
                  
                  <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition flex items-center justify-center text-white">
                    <Download className="w-5 h-5 mr-2" />
                    Export Orders
                  </button>
                </div>
              </div>
              
              {/* Error State */}
              {error && (
                <div className="bg-red-900 bg-opacity-50 rounded-xl p-4 mb-6 text-red-200">
                  <p>Error: {error}</p>
                </div>
              )}
              
              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="relative">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-gray-700 border-none rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-pink-400 focus:outline-none text-white appearance-none"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending Assignment</option>
                    <option value="assigned">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <ChevronDown className="w-5 h-5 absolute right-3 top-2.5 pointer-events-none text-gray-400" />
                </div>
                
                <div className="relative">
                  <select 
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-gray-700 border-none rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-pink-400 focus:outline-none text-white appearance-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="Love Song">Love Song</option>
                    <option value="Birthday Song">Birthday Song</option>
                    <option value="Wedding Music">Wedding Music</option>
                    <option value="Anniversary Song">Anniversary Song</option>
                    <option value="Business Jingle">Business Jingle</option>
                  </select>
                  <ChevronDown className="w-5 h-5 absolute right-3 top-2.5 pointer-events-none text-gray-400" />
                </div>
              </div>
              
              {/* Orders Table */}
              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                    <p className="mt-4 text-gray-400">Loading orders...</p>
                  </div>
                ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Artist</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Deadline</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {filteredOrders.map((order) => {
                        const isMockOrder = 'title' in order;
                        const orderTitle = isMockOrder ? (order as Order).title : order.song?.title || `${order.category} for ${order.occasion}`;
                        const orderStatus = isMockOrder ? (order as Order).status : order.song?.status || order.status;
                        const orderPrice = isMockOrder ? (order as Order).price : order.totalPrice || 0;
                        const customerAvatar = isMockOrder ? 
                          (order as Order).customer.avatar : 
                          order.customer?.name?.split(' ').map((n: string) => n[0]).join('');
                        const orderArtist = isMockOrder ? (order as Order).artist : undefined;
                        
                        return (
                        <tr key={order.id} className="hover:bg-gray-700 cursor-pointer" onClick={() => handleViewOrder(order)}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">#{order.id.slice(-8)}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">{orderTitle}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center mr-2">
                                <span className="text-xs font-bold">{customerAvatar}</span>
                              </div>
                              <div>
                                <p className="font-medium">{order.customer?.name}</p>
                                <p className="text-xs text-gray-400">{order.customer?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">{orderArtist || 'Unassigned'}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(orderStatus)} bg-opacity-20 flex items-center w-fit`}>
                              <span className={`w-2 h-2 rounded-full ${getStatusColor(orderStatus)} mr-2`}></span>
                              {getStatusLabel(orderStatus)}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">{formatPrice(orderPrice)}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">{order.deadline}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                            <button 
                              className="text-gray-400 hover:text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewOrder(order);
                              }}
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                )}
                
                {filteredOrders.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No orders found</h3>
                    <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
                  </div>
                )}
                
                {/* Pagination */}
                {ordersData?.pagination && ordersData.pagination.pages > 1 && (
                  <div className="flex justify-center mt-6 space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        currentPage === 1 
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                          : 'bg-gray-700 hover:bg-gray-600 text-white'
                      }`}
                    >
                      Previous
                    </button>
                    
                    <span className="px-4 py-2 text-gray-300">
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        currentPage === totalPages 
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                          : 'bg-gray-700 hover:bg-gray-600 text-white'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Order Details View
            selectedOrder && (
              <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">Order Details</h1>
                    <p className="text-gray-300">
                      #{selectedOrder.id.slice ? selectedOrder.id.slice(-8) : selectedOrder.id} - {selectedOrder.title}
                    </p>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex space-x-3">
                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition flex items-center justify-center text-white">
                      <Download className="w-5 h-5 mr-2" />
                      Export
                    </button>
                    
                    {/* Status Update Button based on current status */}
                    {selectedOrder.status === 'pending' && (
                      <button 
                        onClick={handleAssignArtist}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition flex items-center justify-center text-white"
                      >
                        <User className="w-5 h-5 mr-2" />
                        Assign Artist
                      </button>
                    )}
                    
                    {selectedOrder.status === 'assigned' && (
                      <button 
                        onClick={() => handleUpdateStatus('completed')}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-medium transition flex items-center justify-center text-white"
                      >
                        <Check className="w-5 h-5 mr-2" />
                        Mark as Completed
                      </button>
                    )}
                    
                    {/* Cancel button for non-completed orders */}
                    {selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' && (
                      <button 
                        onClick={() => handleUpdateStatus('cancelled')}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-medium transition flex items-center justify-center text-white"
                      >
                        <X className="w-5 h-5 mr-2" />
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Artist Assignment Modal */}
                {isAssigningArtist && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
                      <h3 className="text-xl font-medium mb-4">Assign Artist</h3>
                      <p className="mb-4 text-gray-300">Select an artist to assign to this order:</p>
                      
                      <div className="mb-6">
                        <select
                          value={selectedArtist}
                          onChange={(e) => setSelectedArtist(e.target.value)}
                          className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-white mb-2"
                        >
                          <option value="">Select an artist</option>
                          {mockArtists
                            .filter(artist => artist.availability !== 'On Leave')
                            .map(artist => (
                              <option key={artist.id} value={artist.name}>
                                {artist.name} {artist.availability === 'Busy' ? '(Busy)' : ''}
                              </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-400">Note: Artists marked (Busy) may have delayed delivery times.</p>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={cancelAssignArtist}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={confirmAssignArtist}
                          disabled={!selectedArtist}
                          className={`px-4 py-2 rounded-lg font-medium transition ${
                            selectedArtist 
                              ? 'bg-pink-500 hover:bg-pink-600' 
                              : 'bg-gray-600 cursor-not-allowed'
                          }`}
                        >
                          Assign
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Order Summary Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <div className="lg:col-span-2 bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
                    <h2 className="text-xl font-medium mb-6">Order Summary</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Order Details */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Details</h3>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Music className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-400">Song Title</p>
                              <p className="font-medium">{selectedOrder.title}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-400">Category</p>
                              <p className="font-medium">{selectedOrder.category}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-400">Order Date</p>
                              <p className="font-medium">{selectedOrder.date}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-400">Deadline</p>
                              <p className="font-medium">{selectedOrder.deadline}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-400">Price</p>
                              <p className="font-medium">{formatPrice(selectedOrder.price)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Customer & Artist Info */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">People</h3>
                        
                        <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4 mb-4">
                          <div className="flex items-center mb-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center mr-3">
                              <span className="font-bold">{selectedOrder.customer.avatar}</span>
                            </div>
                            <div>
                              <p className="font-medium">{selectedOrder.customer.name}</p>
                              <p className="text-sm text-gray-400">{selectedOrder.customer.email}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400">Customer</p>
                        </div>
                        
                        <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                          {selectedOrder.artist && selectedOrder.artist !== 'Unassigned' ? (
                            <div className="flex items-center mb-2">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center mr-3">
                                <span className="font-bold">{selectedOrder.artist.charAt(0)}{selectedOrder.artist.split(' ')[1]?.charAt(0) || ''}</span>
                              </div>
                              <div>
                                <p className="font-medium">{selectedOrder.artist}</p>
                                <button 
                                  className="text-xs text-pink-400 hover:text-pink-300"
                                  onClick={handleAssignArtist}
                                >
                                  Change Artist
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-gray-400">No artist assigned</p>
                              <button 
                                className="text-xs text-pink-400 hover:text-pink-300 flex items-center"
                                onClick={handleAssignArtist}
                              >
                                <User className="w-4 h-4 mr-1" />
                                Assign Artist
                              </button>
                            </div>
                          )}
                          <p className="text-xs text-gray-400">Artist</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Requirements */}
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-4">Requirements</h3>
                      <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                        <p>{selectedOrder.requirements}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Specifications Card */}
                  <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
                    <h2 className="text-xl font-medium mb-6">Specifications</h2>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-700 bg-opacity-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Length</p>
                        <p className="font-medium">{selectedOrder.specifications.length}</p>
                      </div>
                      
                      <div className="bg-gray-700 bg-opacity-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Tempo</p>
                        <p className="font-medium">{selectedOrder.specifications.tempo}</p>
                      </div>
                      
                      <div className="bg-gray-700 bg-opacity-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Mood</p>
                        <p className="font-medium">{selectedOrder.specifications.mood}</p>
                      </div>
                      
                      <div className="bg-gray-700 bg-opacity-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Vocals</p>
                        <p className="font-medium">{selectedOrder.specifications.vocals}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Instruments</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedOrder.specifications.instruments.map((instrument, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                              {instrument}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Status */}
                    <div className="mt-6">
                      <p className="text-sm text-gray-400 mb-2">Status</p>
                      <span className={`px-4 py-2 rounded-lg text-sm ${getStatusColor(selectedOrder.status)} bg-opacity-20 flex items-center w-fit`}>
                        <span className={`w-2 h-2 rounded-full ${getStatusColor(selectedOrder.status)} mr-2`}></span>
                        {getStatusLabel(selectedOrder.status)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Order History */}
                <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-medium">Order History</h2>
                    <button className="flex items-center text-gray-400 hover:text-white">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {orderHistory.map((event, index) => (
                      <div key={index} className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{event.action}</p>
                            <p className="text-sm text-gray-400">{event.user}</p>
                          </div>
                          <p className="text-sm text-gray-400">{event.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Communication Tabs */}
                <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm mb-6">
                  <h2 className="text-xl font-medium mb-6">Communication</h2>
                  
                  <div className="flex border-b border-gray-700 mb-6">
                    <button className="pb-3 px-4 font-medium text-pink-400 border-b-2 border-pink-400">
                      Messages
                    </button>
                    <button className="pb-3 px-4 font-medium text-gray-400 hover:text-white">
                      Notes
                    </button>
                  </div>
                  
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg text-center">
                    <MessageSquare className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                    <p className="mb-1">No messages yet</p>
                    <p className="text-sm text-gray-400 mb-4">Messages between the customer and artist will appear here</p>
                    <button className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg font-medium transition">
                      Send Message
                    </button>
                  </div>
                </div>
                
                {/* Files Section */}
                <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm mb-6">
                  <h2 className="text-xl font-medium mb-6">Files</h2>
                  
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg text-center">
                    <FileText className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                    <p className="mb-1">No files uploaded yet</p>
                    <p className="text-sm text-gray-400 mb-4">Reference files and deliverables will appear here</p>
                    <button className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg font-medium transition mr-2">
                      Upload File
                    </button>
                    <button className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium transition">
                      Request Files
                    </button>
                  </div>
                </div>
                
                {/* Action Buttons Footer */}
                <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-400">Order ID: {selectedOrder.id}</p>
                    <p className="text-sm text-gray-400">Created: {selectedOrder.date}</p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition">
                      Message Customer
                    </button>
                    <button className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg font-medium transition">
                      Send Update
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}