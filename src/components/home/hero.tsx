// src/components/home/hero.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Play, Pause } from 'lucide-react';

export default function Hero() {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, you would play/pause an audio element here
  };
  
  return (
    <header className="container mx-auto px-6 py-24 flex flex-col lg:flex-row items-center">
      <div className="lg:w-1/2 mb-12 lg:mb-0 animate-slide-up">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Your Story Deserves <span className="text-pink-400">Custom Music</span>
        </h1>
        <p className="text-xl mb-8 text-gray-300">
          Personalized songs crafted by professional musicians for your special moments. From heartfelt love songs to catchy business jingles.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            href="/order"
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-medium text-lg hover:opacity-90 transition flex items-center justify-center text-white"
          >
            Order Your Song <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
          <Link
            href="/samples"
            className="px-8 py-3 bg-gray-800 bg-opacity-50 rounded-full font-medium text-lg border border-pink-400 hover:bg-gray-700 transition flex items-center justify-center text-white"
          >
            Listen to Samples
          </Link>
        </div>
      </div>
      
      <div className="lg:w-1/2 relative animate-fade-in">
        <div className="w-full h-80 bg-gradient-to-tr from-purple-500/30 to-pink-500/30 rounded-2xl backdrop-blur-sm p-6 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="w-32 h-32 bg-pink-500/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-500/30 transition"
              onClick={togglePlay}
              role="button"
              aria-label={isPlaying ? "Pause sample" : "Play sample"}
            >
              {isPlaying ? (
                <Pause className="w-12 h-12" />
              ) : (
                <Play className="w-12 h-12 ml-1" />
              )}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent p-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-pink-400 flex items-center justify-center">
                <Play className="w-6 h-6 ml-1" />
              </div>
              <div>
                <p className="font-medium">Sample: "Forever Yours"</p>
                <p className="text-sm text-gray-300">Love Song • 3:24</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}