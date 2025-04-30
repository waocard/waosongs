// src/components/dashboard/song-header.tsx
'use client';

import { useState } from 'react';
import { Music, Clock, User, Play, Pause, CheckCircle, PenTool, MessageSquare, Download } from 'lucide-react';
import { Song } from '@/lib/types';

interface SongHeaderProps {
  song: Song;
}

export default function SongHeader({ song }: SongHeaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, you would control an audio element here
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-64 lg:w-80 flex-shrink-0 mb-6 md:mb-0 md:mr-8">
        <div className="aspect-square bg-gradient-to-tr from-purple-500/30 to-pink-500/30 rounded-xl flex flex-col items-center justify-center p-6 relative">
          <Music className="w-20 h-20 text-pink-400 mb-4" />
          <h2 className="text-xl font-bold text-center mb-2">{song.title}</h2>
          <p className="text-gray-300 text-center mb-4">{song.category}</p>
          
          <button
            className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center hover:opacity-90 transition"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>
          
          <div className="absolute bottom-6 left-6 right-6">
            <div className="w-full bg-gray-700 rounded-full h-1 mb-1">
              <div className="bg-pink-500 h-1 rounded-full" style={{ width: '40%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>2:45</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className={`px-3 py-1 rounded-full text-xs bg-${getStatusColor(song.status)} bg-opacity-20 flex items-center`}>
                <span className={`w-2 h-2 rounded-full bg-${getStatusColor(song.status)} mr-2`}></span>
                {getStatusLabel(song.status)}
              </span>
            </div>
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
          
          <div className="flex items-center justify-between p-4 bg-gray-700 bg-opacity-50 rounded-lg">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm font-medium">Delivery By</p>
                <p className="text-xs text-gray-400">{song.deadline}</p>
              </div>
            </div>
            <div className="h-10 w-px bg-gray-600"></div>
            <div className="flex items-center">
              <User className="w-5 h-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm font-medium">Artist</p>
                <p className="text-xs text-gray-400">{song.artist}</p>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          {song.status === 'review' && (
            <div className="flex space-x-2 pt-2">
              <button className="flex-1 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg text-sm font-medium transition flex items-center justify-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </button>
              <button className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition flex items-center justify-center">
                <PenTool className="w-4 h-4 mr-2" />
                Request Changes
              </button>
            </div>
          )}
          
          {song.status === 'in-progress' && (
            <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition flex items-center justify-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Message Artist
            </button>
          )}
          
          {song.status === 'completed' && (
            <button className="w-full py-2 bg-pink-500 hover:bg-pink-600 rounded-lg text-sm font-medium transition flex items-center justify-center">
              <Download className="w-4 h-4 mr-2" />
              Download Files
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getStatusLabel(status: string) {
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
}

function getStatusColor(status: string) {
  switch(status) {
    case 'in-progress':
      return 'blue-500';
    case 'review':
      return 'pink-500';
    case 'completed':
      return 'green-500';
    default:
      return 'gray-500';
  }
}