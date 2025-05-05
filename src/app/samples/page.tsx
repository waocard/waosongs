'use client';

import { useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

// Sample data
const samples = [
  {
    id: 1,
    title: 'WaoSongs Nigeria Pigin Jingle',
    category: 'Business Jingle',
    url: "https://res.cloudinary.com/dnwzun74d/video/upload/v1746021203/WaoSongs_com_Jingle_Nigerian_Pidgin_Version___1_rfosjf.mp3",
    duration: 32
  },
  {
    id: 2,
    title: 'Wedding Anniversary Song',
    category: 'Special Occasion',
    url: "https://res.cloudinary.com/dnwzun74d/video/upload/v1746021203/WaoSongs_com_Jingle_Nigerian_Pidgin_Version___1_rfosjf.mp3",
    duration: 45
  },
  {
    id: 3,
    title: 'Corporate Theme',
    category: 'Business',
    url: "https://res.cloudinary.com/dnwzun74d/video/upload/v1746021203/WaoSongs_com_Jingle_Nigerian_Pidgin_Version___1_rfosjf.mp3",
    duration: 28
  }
];

export default function SamplesPage() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = (id: number) => {
    // Toggle play/pause
    setCurrentlyPlaying(currentlyPlaying === id ? null : id);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <main>
      <Header />
      
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
          Listen to Our <span className="text-pink-400">Sample Work</span>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {samples.map((sample) => (
            <div 
              key={sample.id} 
              className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden"
            >
              <div className="p-6 relative">
                <div 
                  className="w-24 h-24 mx-auto bg-pink-500/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-500/30 transition mb-4"
                  onClick={() => togglePlay(sample.id)}
                >
                  {currentlyPlaying === sample.id ? (
                    <Pause className="w-10 h-10 text-white" />
                  ) : (
                    <Play className="w-10 h-10 ml-1 text-white" />
                  )}
                </div>
                
                <h3 className="text-xl font-semibold text-white text-center">{sample.title}</h3>
                <p className="text-gray-300 text-center mb-4">{sample.category} • {formatTime(sample.duration)}</p>
                
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => togglePlay(sample.id)}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-medium text-white flex items-center"
                  >
                    {currentlyPlaying === sample.id ? 'Pause' : 'Play'}
                  </button>
                  
                  <button
                    onClick={toggleMute}
                    className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 text-white" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <p className="text-white text-xl mb-6">
            Ready to create your own custom song?
          </p>
          <a 
            href="/order" 
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-medium text-lg text-white inline-block"
          >
            Order Now
          </a>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}