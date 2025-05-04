// src/app/admin/statistics/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  /* Calendar, */
  ChevronDown,
  Download,
  BarChart,
  PieChart,
  LineChart,
  Users,
  Music,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Star
} from 'lucide-react';
//import Sidebar from '@/components/layout/sidebar'; // Using AdminSidebar from layout

// Mock data for statistics
const monthlyRevenue = [
  { month: 'Jan', revenue: 12500 },
  { month: 'Feb', revenue: 15000 },
  { month: 'Mar', revenue: 13800 },
  { month: 'Apr', revenue: 18200 },
  { month: 'May', revenue: 21000 },
  { month: 'Jun', revenue: 19500 },
];

const ordersByCategory = [
  { category: 'Love Song', count: 42, color: 'bg-pink-500' },
  { category: 'Birthday Song', count: 38, color: 'bg-blue-500' },
  { category: 'Wedding Music', count: 25, color: 'bg-purple-500' },
  { category: 'Anniversary Song', count: 18, color: 'bg-green-500' },
  { category: 'Business Jingle', count: 15, color: 'bg-amber-500' },
];

const topArtists = [
  { name: 'Alex Morgan', avatar: 'AM', songs: 24, rating: 4.8 },
  { name: 'Maria Kim', avatar: 'MK', songs: 36, rating: 4.9 },
  { name: 'David Chen', avatar: 'DC', songs: 18, rating: 4.7 },
  { name: 'Sarah Johnson', avatar: 'SJ', songs: 15, rating: 4.6 },
];

const userGrowth = [
  { month: 'Jan', users: 120 },
  { month: 'Feb', users: 150 },
  { month: 'Mar', users: 210 },
  { month: 'Apr', users: 260 },
  { month: 'May', users: 310 },
  { month: 'Jun', users: 380 },
];

export default function AdminStatisticsPage() {
  const [timeRange, setTimeRange] = useState('6months');
  const router = useRouter();
  
  const handleBack = () => {
    router.push('/admin');
  };
  
  const getTotalRevenue = () => {
    return monthlyRevenue.reduce((total, item) => total + item.revenue, 0);
  };
  
  const getTotalOrders = () => {
    return ordersByCategory.reduce((total, item) => total + item.count, 0);
  };
  
  const getRevenueGrowth = () => {
    const currentMonth = monthlyRevenue[monthlyRevenue.length - 1].revenue;
    const previousMonth = monthlyRevenue[monthlyRevenue.length - 2].revenue;
    const growth = ((currentMonth - previousMonth) / previousMonth) * 100;
    return growth.toFixed(1);
  };
  
  const getUserGrowth = () => {
    const currentMonth = userGrowth[userGrowth.length - 1].users;
    const previousMonth = userGrowth[userGrowth.length - 2].users;
    const growth = ((currentMonth - previousMonth) / previousMonth) * 100;
    return growth.toFixed(1);
  };
  
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-400" />);
      }
    }
    
    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-2 text-gray-300">{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white">
      <div className="flex">
        {/* AdminSidebar is already included in the layout */}
        
        <div className="flex-1 p-6 md:p-8">
          <button 
            onClick={handleBack}
            className="flex items-center text-gray-300 hover:text-white mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Analytics Dashboard</h1>
              <p className="text-gray-300">Detailed statistics and performance metrics</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="relative">
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-gray-700 border-none rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-pink-400 focus:outline-none text-white appearance-none"
                >
                  <option value="30days">Last 30 Days</option>
                  <option value="3months">Last 3 Months</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="year">Last Year</option>
                </select>
                <ChevronDown className="w-5 h-5 absolute right-3 top-2.5 pointer-events-none text-gray-400" />
              </div>
              
              <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-medium transition flex items-center justify-center text-white">
                <Download className="w-5 h-5 mr-2" />
                Export Report
              </button>
            </div>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Total Revenue</h3>
                <div className="w-10 h-10 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <p className="text-3xl font-bold">${getTotalRevenue().toLocaleString()}</p>
              <div className="flex items-center mt-2 text-sm">
                {parseFloat(getRevenueGrowth()) > 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-green-400">{getRevenueGrowth()}% from last month</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
                    <span className="text-red-400">{getRevenueGrowth()}% from last month</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Total Orders</h3>
                <div className="w-10 h-10 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center">
                  <Music className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <p className="text-3xl font-bold">{getTotalOrders()}</p>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-green-400">12.3% from last month</span>
              </div>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Users</h3>
                <div className="w-10 h-10 rounded-full bg-purple-500 bg-opacity-20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <p className="text-3xl font-bold">{userGrowth[userGrowth.length - 1].users}</p>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-green-400">{getUserGrowth()}% from last month</span>
              </div>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Avg. Rating</h3>
                <div className="w-10 h-10 rounded-full bg-amber-500 bg-opacity-20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <p className="text-3xl font-bold">4.8</p>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-green-400">0.2 from last month</span>
              </div>
            </div>
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Revenue Chart */}
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium">Monthly Revenue</h3>
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <LineChart className="w-5 h-5 text-gray-300" />
                </div>
              </div>
              
              <div className="h-64 flex items-end space-x-4">
                {monthlyRevenue.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-pink-500 to-purple-600 rounded-t-lg"
                      style={{ height: `${(data.revenue / 22000) * 100}%` }}
                    ></div>
                    <div className="mt-2">
                      <p className="font-medium">{data.month}</p>
                      <p className="text-gray-400 text-sm">${data.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Orders by Category Chart */}
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium">Orders by Category</h3>
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-gray-300" />
                </div>
              </div>
              
              <div className="flex">
                <div className="w-2/3">
                  <div className="relative h-64">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-40 h-40 rounded-full border-8 border-gray-700 flex items-center justify-center">
                        <p className="text-xl font-bold">{getTotalOrders()}</p>
                        <p className="text-xs text-gray-400">Total Orders</p>
                      </div>
                    </div>
                    
                    {/* Placeholder for pie chart segments - in a real app, you would use a chart library */}
                    <div className="absolute top-0 left-0 w-full h-full">
                      {/* This is just a visual representation - would be replaced with proper chart */}
                      <div className="absolute top-0 left-1/2 w-1/2 h-1/2 bg-pink-500 rounded-tr-full"></div>
                      <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 bg-blue-500 rounded-br-full"></div>
                      <div className="absolute top-1/2 left-0 w-1/2 h-1/2 bg-purple-500 rounded-bl-full"></div>
                      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-amber-500 rounded-tl-full"></div>
                    </div>
                  </div>
                </div>
                
                <div className="w-1/3 space-y-3">
                  {ordersByCategory.map((category, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${category.color} mr-2`}></div>
                      <div>
                        <p className="text-sm">{category.category}</p>
                        <p className="text-xs text-gray-400">{category.count} orders</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Data Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Artists */}
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium">Top Artists</h3>
                <button className="text-sm text-pink-400 hover:text-pink-300">View All</button>
              </div>
              
              <div className="space-y-4">
                {topArtists.map((artist, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700 bg-opacity-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center mr-3">
                        <span className="font-bold">{artist.avatar}</span>
                      </div>
                      <div>
                        <p className="font-medium">{artist.name}</p>
                        <p className="text-sm text-gray-400">{artist.songs} songs completed</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {renderRatingStars(artist.rating)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* User Growth Chart */}
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium">User Growth</h3>
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <BarChart className="w-5 h-5 text-gray-300" />
                </div>
              </div>
              
              <div className="h-64 flex items-end space-x-4">
                {userGrowth.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-500 to-purple-600 rounded-t-lg"
                      style={{ height: `${(data.users / 400) * 100}%` }}
                    ></div>
                    <div className="mt-2">
                      <p className="font-medium">{data.month}</p>
                      <p className="text-gray-400 text-sm">{data.users} users</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}