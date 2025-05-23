// src/app/dashboard/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Music, 
  User, 
  Clock, 
  MessageSquare, 
  Download, 
  Play, 
  Pause, 
  Star, 
  CheckCircle, 
  Bell,
  Search,
  Plus
} from 'lucide-react';
import Sidebar from '@/components/layout/sidebar';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSong, setActiveSong] = useState<number | null>(null);
  const router = useRouter();

  const songs = [
    {
      id: 1,
      title: "Forever Yours",
      category: "Love Song",
      status: "in-progress",
      progress: 65,
      deadline: "May 5, 2025",
      artist: "Alex Morgan",
      preview: true,
      messages: 3
    },
    {
      id: 2,
      title: "Birthday Celebration",
      category: "Birthday Song",
      status: "review",
      progress: 90,
      deadline: "April 30, 2025",
      artist: "Maria Kim",
      preview: true,
      messages: 1
    },
    {
      id: 3,
      title: "Corporate Anthem",
      category: "Business Jingle",
      status: "completed",
      progress: 100,
      deadline: "April 15, 2025",
      artist: "David Chen",
      preview: false,
      messages: 0
    },
    {
      id: 4,
      title: "Anniversary Waltz",
      category: "Anniversary Song",
      status: "completed",
      progress: 100,
      deadline: "March 20, 2025",
      artist: "Elena Rodriguez",
      preview: false,
      messages: 0
    }
  ];

  const filteredSongs = songs.filter(song => {
    if (activeTab === 'ongoing') {
      return song.status === 'in-progress' || song.status === 'review';
    } else if (activeTab === 'completed') {
      return song.status === 'completed';
    }
    return true;
  });

  const togglePlay = (songId: number) => {
    if (activeSong === songId && isPlaying) {
      setIsPlaying(false);
      setActiveSong(null);
    } else {
      setIsPlaying(true);
      setActiveSong(songId);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">My Songs</h1>
              <p className="text-gray-300">Manage and track your custom music creations</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search songs..." 
                  className="w-full sm:w-64 p-2 pl-10 rounded-lg bg-gray-800 bg-opacity-50 focus:ring-2 focus:ring-pink-400 focus:outline-none"
                />
                <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
              
              <button 
                onClick={() => router.push('/order')}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-medium transition flex items-center justify-center text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Song
              </button>
            </div>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm mb-8">
            <div className="flex border-b border-gray-700 mb-6">
              <button 
                className={`pb-3 px-4 font-medium ${activeTab === 'ongoing' ? 'text-pink-400 border-b-2 border-pink-400' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('ongoing')}
              >
                Ongoing Projects
              </button>
              <button 
                className={`pb-3 px-4 font-medium ${activeTab === 'completed' ? 'text-pink-400 border-b-2 border-pink-400' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('completed')}
              >
                Completed
              </button>
              <button 
                className={`pb-3 px-4 font-medium ${activeTab === 'all' ? 'text-pink-400 border-b-2 border-pink-400' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('all')}
              >
                All Songs
              </button>
            </div>
            
            <div className="space-y-4">
              {filteredSongs.length > 0 ? (
                filteredSongs.map(song => (
                  <div key={song.id} className="bg-gray-700 bg-opacity-50 rounded-lg p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                        <div 
                          className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500/50 to-pink-500/50 flex items-center justify-center cursor-pointer hover:bg-pink-500/30 transition"
                          onClick={() => togglePlay(song.id)}
                        >
                          {isPlaying && activeSong === song.id ? 
                            <Pause className="w-8 h-8" /> : 
                            <Play className="w-8 h-8 ml-1" />
                          }
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-medium">{song.title}</h3>
                            <p className="text-gray-400 text-sm">{song.category}</p>
                          </div>
                          
                          <div className="flex items-center mt-2 md:mt-0">
                            <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(song.status)} bg-opacity-20 flex items-center`}>
                              <span className={`w-2 h-2 rounded-full ${getStatusColor(song.status)} mr-2`}></span>
                              {getStatusLabel(song.status)}
                            </span>
                          </div>
                        </div>
                        
                        {song.status !== 'completed' && (
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">Progress</span>
                              <span>{song.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-600 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full" 
                                style={{ width: `${song.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-y-3">
                          <div className="flex items-center mr-6">
                            <Clock className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm">{song.deadline}</span>
                          </div>
                          
                          <div className="flex items-center mr-6">
                            <User className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm">Artist: {song.artist}</span>
                          </div>
                          
                          {song.messages > 0 && (
                            <div className="flex items-center">
                              <MessageSquare className="w-4 h-4 text-pink-400 mr-2" />
                              <span className="text-sm">{song.messages} new message{song.messages > 1 ? 's' : ''}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 md:ml-6 flex flex-wrap gap-2">
                        {song.preview && (
                          <button className="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 rounded-lg text-sm font-medium transition flex items-center">
                            <Play className="w-4 h-4 mr-1" />
                            Preview
                          </button>
                        )}
                        
                        {song.status === 'review' && (
                          <button className="px-3 py-1.5 bg-green-500 hover:bg-green-600 rounded-lg text-sm font-medium transition flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </button>
                        )}
                        
                        {song.status === 'completed' && (
                          <button className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition flex items-center">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </button>
                        )}
                        
                        <Link href={`/dashboard/songs/${song.id}`} className="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm font-medium transition">
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No songs found</h3>
                  <p className="text-gray-400 mb-6">You don&apos;t have any {activeTab === 'ongoing' ? 'ongoing' : activeTab === 'completed' ? 'completed' : ''} songs yet.</p>
                  <button 
                    onClick={() => router.push('/order')}
                    className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-medium transition"
                  >
                    Create New Song
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3 flex-shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">New message from Maria Kim</p>
                    <p className="text-sm text-gray-400">&quot;I&apos;ve uploaded the first preview of your birthday song!&quot;</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center mr-3 flex-shrink-0">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Song status updated</p>
                    <p className="text-sm text-gray-400">&quot;Forever Yours&quot; is now 65% complete</p>
                    <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mr-3 flex-shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Song completed</p>
                    <p className="text-sm text-gray-400">&quot;Corporate Anthem&quot; is ready for download</p>
                    <p className="text-xs text-gray-500 mt-1">April 15, 2025</p>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-4 py-2 text-center text-pink-400 font-medium hover:text-pink-300 transition">
                View All Activity
              </button>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-4">Recommended For You</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500/30 to-red-500/30 flex items-center justify-center mr-3">
                      <Star className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Anniversary Package</h3>
                      <p className="text-sm text-gray-400">Song + Video Montage</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">
                    Celebrate your special day with a custom song and a beautiful video montage.
                  </p>
                  <button 
                    onClick={() => router.push('/order?category=Anniversary+Song&occasion=Anniversary')}
                    className="w-full py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg font-medium transition text-sm"
                  >
                    Order Now
                  </button>
                </div>
                
                <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500/30 to-cyan-500/30 flex items-center justify-center mr-3">
                      <Bell className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Business Pro Bundle</h3>
                      <p className="text-sm text-gray-400">Multiple Jingles + License</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">
                    Get 3 variations of your business jingle with full commercial license.
                  </p>
                  <button 
                    onClick={() => router.push('/order?category=Business+Jingle&occasion=Promotional')}
                    className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-medium transition text-sm"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;