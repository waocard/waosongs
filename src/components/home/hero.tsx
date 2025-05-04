// src/components/home/hero.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function Hero() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Cloudinary audio URL
  const cloudinaryUrl = "https://res.cloudinary.com/demo/video/upload/v1/WaoSongs_com_Jingle_Nigerian_Pidgin_Version___1_rfosjf";
  
  useEffect(() => {
    // Initialize audio element
    const audio = new Audio(cloudinaryUrl);
    audioRef.current = audio;
    
    // Set up event listeners
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    });
    
    // Clean up
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);
  
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    } else {
      audioRef.current.play().catch(error => {
        console.error("Audio playback failed:", error);
      });
      
      // Update progress
      progressIntervalRef.current = setInterval(() => {
        if (audioRef.current) {
          const currentTime = audioRef.current.currentTime;
          const duration = audioRef.current.duration;
          setProgress((currentTime / duration) * 100);
          setCurrentTime(currentTime);
        }
      }, 100);
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    if (!audioRef.current) return;
    
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };
  
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  return (
    <header className="container mx-auto px-6 py-24 flex flex-col lg:flex-row items-center">
      <div className="lg:w-1/2 mb-12 lg:mb-0 animate-slide-up">
        <h1 className="text-5xl text-white md:text-6xl font-bold leading-tight mb-6">
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
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="w-32 h-32 bg-pink-500/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-500/30 transition"
              onClick={togglePlay}
              role="button"
              aria-label={isPlaying ? "Pause sample" : "Play sample"}
            >
              {isPlaying ? (
                <Pause className="w-12 h-12 text-white" />
              ) : (
                <Play className="w-12 h-12 ml-1 text-white" />
              )}
            </div>
          </div>
          
          {/* Audio controls and info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-4">
            {/* Progress bar */}
            <div className="w-full h-1 bg-gray-700 rounded-full mb-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-pink-500 to-purple-600"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-pink-400 flex items-center justify-center hover:bg-pink-500 transition"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 ml-1 text-white" />
                  )}
                </button>
                <div>
                  <p className="font-medium text-white">WaoSongs Nigerian Jingle</p>
                  <p className="text-sm text-gray-300">
                    Business Jingle • {formatTime(currentTime)} / {formatTime(duration || 0)}
                  </p>
                </div>
              </div>
              
              <button
                onClick={toggleMute}
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
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
      </div>
    </header>
  );
}