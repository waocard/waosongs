// src/components/home/how-it-works.tsx
import React from 'react';

export default function HowItWorks() {
  return (
    <section className="bg-gray-900/50 py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl text-white font-bold mb-16 text-center">
          How <span className="text-pink-400">WaoSongs</span> Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="bg-gray-800/30 p-8 rounded-xl relative">
            <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center absolute -top-6 left-8">
              <span className="font-bold text-lg">1</span>
            </div>
            <h3 className="text-xl font-medium mb-4 mt-4">Share Your Story</h3>
            <p className="text-gray-300">
              Tell us about your occasion, feelings, and the message you want to convey through music.
            </p>
          </div>
          
          <div className="bg-gray-800/30 p-8 rounded-xl relative">
            <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center absolute -top-6 left-8">
              <span className="font-bold text-lg">2</span>
            </div>
            <h3 className="text-xl font-medium mb-4 mt-4">Professional Creation</h3>
            <p className="text-gray-300">
              Our musicians and producers craft a custom piece tailored specifically to your needs.
            </p>
          </div>
          
          <div className="bg-gray-800/30 p-8 rounded-xl relative">
            <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center absolute -top-6 left-8">
              <span className="font-bold text-lg">3</span>
            </div>
            <h3 className="text-xl font-medium mb-4 mt-4">Receive & Share</h3>
            <p className="text-gray-300">
              Get your finished song in high-quality digital format, ready to play for your special moment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}