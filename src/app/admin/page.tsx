// src/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Music, 
  /* BarChart, */ 
  /* Settings, */ 
  Search, 
  /* Filter, */ 
  Download, 
  Plus,
  ChevronDown,
  Edit,
  Trash2
} from 'lucide-react';
//import Sidebar from '@/components/layout/sidebar'; // Remove this import as we're using AdminSidebar
import { Song, User } from '@/lib/types';
import { getAdminDashboard } from '@/lib/api';
import { AdminDashboardResponse } from '@/lib/types';

// Mock data for users
const mockUsers: User[] = [
  {
    id: 1,
    name: 'Jane Cooper',
    email: 'jane@example.com',
    role: 'user',
    avatar: 'JC'
  },
  {
    id: 2,
    name: 'Robert Johnson',
    email: 'robert@example.com',
    role: 'user',
    avatar: 'RJ'
  },
  {
    id: 3,
    name: 'Michael Williams',
    email: 'michael@example.com',
    role: 'user',
    avatar: 'MW'
  },
  {
    id: 4,
    name: 'Sarah Davis',
    email: 'sarah@example.com',
    role: 'user',
    avatar: 'SD'
  },
  {
    id: 5,
    name: 'Alex Morgan',
    email: 'alex@example.com',
    role: 'artist',
    avatar: 'AM'
  },
  {
    id: 6,
    name: 'Maria Kim',
    email: 'maria@example.com',
    role: 'artist',
    avatar: 'MK'
  }
];

// Mock songs data (extended from existing song data)
const mockSongs: Song[] = [
  {
    id: 1,
    title: "Forever Yours",
    category: "Love Song",
    status: "in-progress",
    progress: 65,
    deadline: "May 5, 2025",
    artist: "Alex Morgan",
    artistAvatar: "AM",
    created: "April 1, 2025",
    description: "A romantic love song for my wife's birthday",
    preview: true,
    messagesCount: 3,
    specifications: {
      length: "3-4 minutes",
      tempo: "Moderate",
      mood: "Romantic, Heartfelt",
      vocals: "Male",
      instruments: ["Piano", "Guitar", "Strings"]
    },
    timeline: [
      { date: "April 1, 2025", event: "Order Placed", completed: true },
      { date: "April 5, 2025", event: "Initial Demo Ready", completed: true },
      { date: "April 15, 2025", event: "Final Version Delivery", completed: false }
    ],
    messages: []
  },
  {
    id: 2,
    title: "Birthday Celebration",
    category: "Birthday Song",
    status: "review",
    progress: 90,
    deadline: "April 30, 2025",
    artist: "Maria Kim",
    artistAvatar: "MK",
    created: "April 5, 2025",
    description: "An upbeat birthday song for my friend",
    preview: true,
    messagesCount: 1,
    specifications: {
      length: "2-3 minutes",
      tempo: "Upbeat",
      mood: "Celebratory, Fun",
      vocals: "Female",
      instruments: ["Piano", "Drums", "Bass"]
    },
    timeline: [
      { date: "April 5, 2025", event: "Order Placed", completed: true },
      { date: "April 15, 2025", event: "Initial Demo Ready", completed: true },
      { date: "April 25, 2025", event: "Final Version Delivery", completed: false }
    ],
    messages: []
  },
  {
    id: 3,
    title: "Corporate Jingle",
    category: "Business Jingle",
    status: "completed",
    progress: 100,
    deadline: "March 25, 2025",
    artist: "Alex Morgan",
    artistAvatar: "AM",
    created: "March 10, 2025",
    description: "A catchy jingle for a tech startup's new product launch",
    preview: true,
    messagesCount: 0,
    specifications: {
      length: "1-2 minutes",
      tempo: "Moderate",
      mood: "Professional, Innovative",
      vocals: "None",
      instruments: ["Synthesizer", "Drums", "Bass"]
    },
    timeline: [
      { date: "March 10, 2025", event: "Order Placed", completed: true },
      { date: "March 15, 2025", event: "Initial Demo Ready", completed: true },
      { date: "March 25, 2025", event: "Final Version Delivery", completed: true }
    ],
    messages: []
  }
];

// Mock revenue data for charts
const revenueData = [
  { month: 'Jan', revenue: 12000 },
  { month: 'Feb', revenue: 15000 },
  { month: 'Mar', revenue: 13500 },
  { month: 'Apr', revenue: 18000 },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<AdminDashboardResponse | null>(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await getAdminDashboard();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  
  // Filtered users based on search and role filter
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });
  
  // Filtered songs based on search and status filter
  const filteredSongs = mockSongs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          song.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          song.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || song.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const getCompletedSongsCount = () => {
    return mockSongs.filter(song => song.status === 'completed').length;
  };
  
  const getPendingSongsCount = () => {
    return mockSongs.filter(song => song.status === 'in-progress' || song.status === 'review').length;
  };
  
  const getArtistsCount = () => {
    return mockUsers.filter(user => user.role === 'artist').length;
  };
  
  const getUsersCount = () => {
    return mockUsers.filter(user => user.role === 'user').length;
  };
  
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'in-progress':
        return 'In Progress';
      case 'review':
        return 'Ready for Review';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'in-progress':
        return 'bg-blue-500';
      case 'review':
        return 'bg-pink-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getRoleColor = (role: string) => {
    switch(role) {
      case 'admin':
        return 'bg-purple-500';
      case 'artist':
        return 'bg-pink-500';
      case 'user':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white">
      <div className="flex">
        {/* AdminSidebar is already included in the layout */}
        <div className="flex-1 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-300">Manage users, songs, and platform settings</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="relative">
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..." 
                  className="w-full sm:w-64 p-2 pl-10 rounded-lg bg-gray-800 bg-opacity-50 focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
                />
                <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
              
              <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-medium transition flex items-center justify-center text-white">
                <Download className="w-5 h-5 mr-2" />
                Export Data
              </button>
            </div>
          </div>
          
          {/* Error State */}
          {error && (
            <div className="bg-red-900 bg-opacity-50 rounded-xl p-4 mb-8 text-red-200">
              <p>Error: {error}</p>
            </div>
          )}
          
          {/* Stats Cards */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Total Users</h3>
                  <div className="w-10 h-10 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold">{isLoading ? '-' : dashboardData?.statistics?.users || getUsersCount()}</p>
                <p className="text-green-400 text-sm mt-2">+4% from last month</p>
              </div>
              
              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Total Artists</h3>
                  <div className="w-10 h-10 rounded-full bg-pink-500 bg-opacity-20 flex items-center justify-center">
                    <Music className="w-5 h-5 text-pink-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold">{isLoading ? '-' : dashboardData?.statistics?.artists || getArtistsCount()}</p>
                <p className="text-green-400 text-sm mt-2">+2% from last month</p>
              </div>
              
              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Completed Songs</h3>
                  <div className="w-10 h-10 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center">
                    <Music className="w-5 h-5 text-green-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold">{isLoading ? '-' : dashboardData?.statistics?.completedOrders || getCompletedSongsCount()}</p>
                <p className="text-green-400 text-sm mt-2">+12% from last month</p>
              </div>
              
              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Pending Songs</h3>
                  <div className="w-10 h-10 rounded-full bg-amber-500 bg-opacity-20 flex items-center justify-center">
                    <Music className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold">{isLoading ? '-' : dashboardData?.statistics?.pendingOrders || getPendingSongsCount()}</p>
                <p className="text-yellow-400 text-sm mt-2">In progress</p>
              </div>
            </div>
          )}
          
          {/* Additional Stats Row */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Total Orders</h3>
                  <div className="w-10 h-10 rounded-full bg-purple-500 bg-opacity-20 flex items-center justify-center">
                    <Music className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold">{isLoading ? '-' : dashboardData?.statistics?.orders || 0}</p>
                <p className="text-green-400 text-sm mt-2">All time orders</p>
              </div>
              
              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Total Revenue</h3>
                  <div className="w-10 h-10 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center">
                    <span className="text-green-400">$</span>
                  </div>
                </div>
                <p className="text-3xl font-bold">${isLoading ? '-' : dashboardData?.statistics?.revenue?.toFixed(2) || '0.00'}</p>
                <p className="text-green-400 text-sm mt-2">Total earnings</p>
              </div>
            </div>
          )}
          
          {/* Recent Orders */}
          {activeTab === 'overview' && dashboardData?.recentOrders && dashboardData.recentOrders.length > 0 && (
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm mb-8">
              <h3 className="text-xl font-medium mb-4">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {dashboardData.recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-700">
                        <td className="px-4 py-3 whitespace-nowrap text-sm">#{order.id.slice(-8)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{order.customer}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm capitalize">{order.category}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'completed' ? 'bg-green-500' : 
                            order.status === 'pending' ? 'bg-amber-500' : 'bg-blue-500'
                          } bg-opacity-20`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">${order.amount.toFixed(2)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Revenue Chart */}
          {activeTab === 'overview' && (
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium">Revenue Overview</h3>
                <div className="relative">
                  <select 
                    className="bg-gray-700 border-none rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-pink-400 focus:outline-none text-white appearance-none"
                  >
                    <option>Last 3 months</option>
                    <option>Last 6 months</option>
                    <option>Last year</option>
                  </select>
                  <ChevronDown className="w-5 h-5 absolute right-3 top-2.5 pointer-events-none text-gray-400" />
                </div>
              </div>
              
              <div className="h-64 flex items-end space-x-4">
                {revenueData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-pink-500 to-purple-600 rounded-t-lg"
                      style={{ height: `${(data.revenue / 20000) * 100}%` }}
                    ></div>
                    <div className="mt-2">
                      <p className="font-medium">{data.month}</p>
                      <p className="text-gray-400 text-sm">${data.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Tabs Navigation */}
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex border-b border-gray-700 mb-6">
              <button 
                className={`pb-3 px-4 font-medium ${activeTab === 'overview' ? 'text-pink-400 border-b-2 border-pink-400' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`pb-3 px-4 font-medium ${activeTab === 'users' ? 'text-pink-400 border-b-2 border-pink-400' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('users')}
              >
                Users
              </button>
              <button 
                className={`pb-3 px-4 font-medium ${activeTab === 'songs' ? 'text-pink-400 border-b-2 border-pink-400' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('songs')}
              >
                Songs
              </button>
              <button 
                className={`pb-3 px-4 font-medium ${activeTab === 'settings' ? 'text-pink-400 border-b-2 border-pink-400' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('settings')}
              >
                Settings
              </button>
            </div>
            
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between mb-6">
                  <div className="relative">
                    <select 
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="bg-gray-700 border-none rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-pink-400 focus:outline-none text-white appearance-none"
                    >
                      <option value="all">All Roles</option>
                      <option value="user">Users</option>
                      <option value="artist">Artists</option>
                      <option value="admin">Admins</option>
                    </select>
                    <ChevronDown className="w-5 h-5 absolute right-3 top-2.5 pointer-events-none text-gray-400" />
                  </div>
                  
                  <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-medium transition flex items-center justify-center text-white">
                    <Plus className="w-5 h-5 mr-2" />
                    Add New User
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-gray-900 bg-opacity-50 rounded-xl">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-800">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center mr-3">
                                <span className="font-bold">{user.avatar}</span>
                              </div>
                              <div>
                                <p className="font-medium">{user.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs ${getRoleColor(user.role)} bg-opacity-20 flex items-center w-fit`}>
                              <span className={`w-2 h-2 rounded-full ${getRoleColor(user.role)} mr-2`}></span>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 rounded-full text-xs bg-green-500 bg-opacity-20 flex items-center w-fit">
                              <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button className="text-gray-400 hover:text-white mr-3">
                              <Edit className="w-5 h-5" />
                            </button>
                            <button className="text-gray-400 hover:text-red-400">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Songs Tab */}
            {activeTab === 'songs' && (
              <div>
                <div className="flex justify-between mb-6">
                  <div className="relative">
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-gray-700 border-none rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-pink-400 focus:outline-none text-white appearance-none"
                    >
                      <option value="all">All Status</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Ready for Review</option>
                      <option value="completed">Completed</option>
                    </select>
                    <ChevronDown className="w-5 h-5 absolute right-3 top-2.5 pointer-events-none text-gray-400" />
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-gray-900 bg-opacity-50 rounded-xl">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Song</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Artist</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Deadline</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Progress</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {filteredSongs.map((song) => (
                        <tr key={song.id} className="hover:bg-gray-800">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="font-medium">{song.title}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {song.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center mr-2">
                                <span className="text-sm font-bold">{song.artistAvatar}</span>
                              </div>
                              <span>{song.artist}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {song.deadline}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(song.status)} bg-opacity-20 flex items-center w-fit`}>
                              <span className={`w-2 h-2 rounded-full ${getStatusColor(song.status)} mr-2`}></span>
                              {getStatusLabel(song.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-full bg-gray-600 rounded-full h-2 max-w-[100px]">
                              <div 
                                className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full" 
                                style={{ width: `${song.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-400 mt-1">{song.progress}%</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button className="text-gray-400 hover:text-white mr-3">
                              <Edit className="w-5 h-5" />
                            </button>
                            <button className="text-gray-400 hover:text-red-400">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-medium mb-4">General Settings</h3>
                  <div className="bg-gray-700 bg-opacity-50 rounded-lg p-6 space-y-6">
                    <div>
                      <label className="block mb-2 font-medium" htmlFor="siteName">
                        Site Name
                      </label>
                      <input
                        type="text"
                        id="siteName"
                        defaultValue="WaoSongs"
                        className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium" htmlFor="siteDescription">
                        Site Description
                      </label>
                      <textarea
                        id="siteDescription"
                        rows={3}
                        defaultValue="Custom songs crafted by professional musicians for your special moments."
                        className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium" htmlFor="contactEmail">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        id="contactEmail"
                        defaultValue="contact@waosongs.com"
                        className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-4">Payment Settings</h3>
                  <div className="bg-gray-700 bg-opacity-50 rounded-lg p-6 space-y-6">
                    <div>
                      <label className="block mb-2 font-medium" htmlFor="currency">
                        Default Currency
                      </label>
                      <select
                        id="currency"
                        defaultValue="USD"
                        className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium" htmlFor="commissionRate">
                        Artist Commission Rate (%)
                      </label>
                      <input
                        type="number"
                        id="commissionRate"
                        defaultValue="70"
                        min="0"
                        max="100"
                        className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-medium transition text-white">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}