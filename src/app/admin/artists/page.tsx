// src/app/admin/artists/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  // Filter, // Unused import
  Plus, 
  ChevronDown, 
  Edit, 
  Trash2, 
  Star, 
  Music, 
  ArrowLeft,
  Calendar,
  Check,
  X
} from 'lucide-react';
//import Sidebar from '@/components/layout/sidebar'; // Using AdminSidebar from layout

// Mock artist data
const mockArtists = [
  {
    id: 1,
    name: 'Alex Morgan',
    avatar: 'AM',
    email: 'alex@waosongs.com',
    specialties: ['Love Songs', 'Business Jingles'],
    rating: 4.8,
    completedSongs: 24,
    joinedDate: 'January 15, 2025',
    availability: 'Available',
    bio: 'Professional composer with 8 years of experience in custom music creation. Specializes in romantic and emotional pieces.',
  },
  {
    id: 2,
    name: 'Maria Kim',
    avatar: 'MK',
    email: 'maria@waosongs.com',
    specialties: ['Birthday Songs', 'Wedding Music'],
    rating: 4.9,
    completedSongs: 36,
    joinedDate: 'November 10, 2024',
    availability: 'Available',
    bio: 'Award-winning songwriter with a background in classical music. Creates upbeat and memorable melodies for special occasions.',
  },
  {
    id: 3,
    name: 'David Chen',
    avatar: 'DC',
    email: 'david@waosongs.com',
    specialties: ['Wedding Music', 'Anniversary Songs'],
    rating: 4.7,
    completedSongs: 18,
    joinedDate: 'February 5, 2025',
    availability: 'Busy',
    bio: 'Versatile musician with expertise in piano and string arrangements. Passionate about creating emotional pieces that capture special moments.',
  },
  {
    id: 4,
    name: 'Sarah Johnson',
    avatar: 'SJ',
    email: 'sarah@waosongs.com',
    specialties: ['Birthday Songs', 'Celebration Music'],
    rating: 4.6,
    completedSongs: 15,
    joinedDate: 'March 20, 2025',
    availability: 'Available',
    bio: 'Contemporary vocalist and composer with a unique style. Specializes in fun, upbeat tracks for celebrations.',
  },
  {
    id: 5,
    name: 'James Wilson',
    avatar: 'JW',
    email: 'james@waosongs.com',
    specialties: ['Business Jingles', 'Celebration Music'],
    rating: 4.5,
    completedSongs: 21,
    joinedDate: 'December 8, 2024',
    availability: 'On Leave',
    bio: 'Former advertising music director with a knack for catchy jingles and branded music. Expert in creating memorable audio branding.',
  },
];

export default function ArtistManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [isAddingArtist, setIsAddingArtist] = useState(false);
  const [isEditingArtist, setIsEditingArtist] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<{
    id: number;
    name: string;
    avatar: string;
    email: string;
    specialties: string[];
    rating: number;
    completedSongs: number;
    joinedDate: string;
    availability: string;
    bio: string;
  } | null>(null);
  
  const router = useRouter();
  
  // Filtered artists based on search and filters
  const filteredArtists = mockArtists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           artist.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAvailability = availabilityFilter === 'all' || artist.availability.toLowerCase() === availabilityFilter.toLowerCase();
    const matchesSpecialty = specialtyFilter === 'all' || artist.specialties.some(s => s.toLowerCase().includes(specialtyFilter.toLowerCase()));
    
    return matchesSearch && matchesAvailability && matchesSpecialty;
  });
  
  const handleAddArtist = () => {
    setIsAddingArtist(true);
    setSelectedArtist(null);
    setIsEditingArtist(false);
  };
  
  const handleEditArtist = (artist: {
    id: number;
    name: string;
    avatar: string;
    email: string;
    specialties: string[];
    rating: number;
    completedSongs: number;
    joinedDate: string;
    availability: string;
    bio: string;
  }) => {
    setSelectedArtist(artist);
    setIsEditingArtist(true);
    setIsAddingArtist(false);
  };
  
  const handleCancel = () => {
    setIsAddingArtist(false);
    setIsEditingArtist(false);
    setSelectedArtist(null);
  };
  
  const getAvailabilityColor = (availability: string) => {
    switch(availability.toLowerCase()) {
      case 'available':
        return 'bg-green-500';
      case 'busy':
        return 'bg-amber-500';
      case 'on leave':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const goBack = () => {
    router.push('/admin');
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
            onClick={() => goBack()}
            className="flex items-center text-gray-300 hover:text-white mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Artist Management</h1>
              <p className="text-gray-300">Manage artists, their profiles, and assignments</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="relative">
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  placeholder="Search artists..." 
                  className="w-full sm:w-64 p-2 pl-10 rounded-lg bg-gray-800 bg-opacity-50 focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
                />
                <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
              
              <button 
                onClick={() => handleAddArtist()}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-medium transition flex items-center justify-center text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Artist
              </button>
            </div>
          </div>
          
          {(isAddingArtist || isEditingArtist) ? (
            // Add/Edit Artist Form
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-medium mb-6">
                {isAddingArtist ? 'Add New Artist' : 'Edit Artist'}
              </h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 font-medium" htmlFor="artistName">
                      Name
                    </label>
                    <input
                      type="text"
                      id="artistName"
                      defaultValue={selectedArtist?.name || ''}
                      className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
                      placeholder="Enter artist name"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-medium" htmlFor="artistEmail">
                      Email
                    </label>
                    <input
                      type="email"
                      id="artistEmail"
                      defaultValue={selectedArtist?.email || ''}
                      className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
                      placeholder="Enter email address"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-medium" htmlFor="artistAvailability">
                      Availability
                    </label>
                    <select
                      id="artistAvailability"
                      defaultValue={selectedArtist?.availability || 'Available'}
                      className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
                    >
                      <option value="Available">Available</option>
                      <option value="Busy">Busy</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-medium">
                      Specialties
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Love Songs', 'Birthday Songs', 'Wedding Music', 'Anniversary Songs', 'Celebration Music', 'Business Jingles'].map((specialty) => (
                        <div key={specialty} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`specialty-${specialty}`}
                            className="w-4 h-4 text-pink-500 rounded focus:ring-pink-400"
                            defaultChecked={selectedArtist?.specialties?.includes(specialty) || false}
                          />
                          <label htmlFor={`specialty-${specialty}`} className="ml-2 text-sm">
                            {specialty}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block mb-2 font-medium" htmlFor="artistBio">
                    Biography
                  </label>
                  <textarea
                    id="artistBio"
                    rows={4}
                    defaultValue={selectedArtist?.bio || ''}
                    className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-white"
                    placeholder="Enter artist biography"
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => handleCancel()}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition flex items-center"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-medium transition flex items-center"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    {isAddingArtist ? 'Add Artist' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="relative">
                  <select 
                    value={availabilityFilter}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAvailabilityFilter(e.target.value)}
                    className="bg-gray-700 border-none rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-pink-400 focus:outline-none text-white appearance-none"
                  >
                    <option value="all">All Availability</option>
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="on leave">On Leave</option>
                  </select>
                  <ChevronDown className="w-5 h-5 absolute right-3 top-2.5 pointer-events-none text-gray-400" />
                </div>
                
                <div className="relative">
                  <select 
                    value={specialtyFilter}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSpecialtyFilter(e.target.value)}
                    className="bg-gray-700 border-none rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-pink-400 focus:outline-none text-white appearance-none"
                  >
                    <option value="all">All Specialties</option>
                    <option value="love songs">Love Songs</option>
                    <option value="birthday songs">Birthday Songs</option>
                    <option value="wedding music">Wedding Music</option>
                    <option value="anniversary songs">Anniversary Songs</option>
                    <option value="celebration music">Celebration Music</option>
                    <option value="business jingles">Business Jingles</option>
                  </select>
                  <ChevronDown className="w-5 h-5 absolute right-3 top-2.5 pointer-events-none text-gray-400" />
                </div>
              </div>
              
              {/* Artists Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArtists.map((artist) => (
                  <div 
                    key={artist.id} 
                    className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => handleEditArtist(artist)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center mr-3">
                          <span className="font-bold">{artist.avatar}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{artist.name}</h3>
                          <p className="text-gray-400 text-sm">{artist.email}</p>
                        </div>
                      </div>
                      
                      <span className={`px-3 py-1 rounded-full text-xs ${getAvailabilityColor(artist.availability)} bg-opacity-20 flex items-center`}>
                        <span className={`w-2 h-2 rounded-full ${getAvailabilityColor(artist.availability)} mr-2`}></span>
                        {artist.availability}
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center">
                        <Music className="w-5 h-5 text-gray-400 mr-2" />
                        <p className="text-sm">
                          <span className="text-gray-400">Completed Songs:</span> {artist.completedSongs}
                        </p>
                      </div>
                      
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-gray-400 mr-2" />
                        <p className="text-sm">
                          <span className="text-gray-400">Rating:</span> {renderRatingStars(artist.rating)}
                        </p>
                      </div>
                      
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                        <p className="text-sm">
                          <span className="text-gray-400">Joined:</span> {artist.joinedDate}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Specialties:</p>
                      <div className="flex flex-wrap gap-2">
                        {artist.specialties.map((specialty, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-700 rounded-full text-xs">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <button 
                        className="p-2 text-gray-400 hover:text-white"
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.stopPropagation();
                          handleEditArtist(artist);
                        }}
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        className="p-2 text-gray-400 hover:text-red-400"
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.stopPropagation();
                          // Handle delete artist
                        }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredArtists.length === 0 && (
                <div className="text-center py-12 bg-gray-800 bg-opacity-50 rounded-xl">
                  <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No artists found</h3>
                  <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
                  <button 
                    onClick={() => handleAddArtist()}
                    className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-medium transition inline-block"
                  >
                    Add New Artist
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}