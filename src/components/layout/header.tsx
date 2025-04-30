// src/components/layout/header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Music, Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="container mx-auto flex items-center justify-between p-6">
      <div className="flex items-center space-x-2">
        <Music className="w-8 h-8 text-pink-400" />
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400">
          WaoSongs
        </span>
      </div>
      
      {/* Mobile menu button */}
      <button 
        className="md:hidden text-white"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Desktop navigation */}
      <div className="hidden md:flex space-x-8">
        <Link href="/" className="text-white hover:text-pink-400 transition">
          Home
        </Link>
        <Link href="/how-it-works" className="text-white hover:text-pink-400 transition">
          How It Works
        </Link>
        <Link href="/samples" className="text-white hover:text-pink-400 transition">
          Samples
        </Link>
        <Link href="/pricing" className="text-white hover:text-pink-400 transition">
          Pricing
        </Link>
      </div>
      
      <div className="hidden md:block">
        <Link 
          href="/order"
          className="px-6 py-2 bg-pink-500 hover:bg-pink-600 rounded-full font-medium transition text-white"
        >
          Get Started
        </Link>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-gray-900 p-4 z-50">
          <div className="flex flex-col space-y-4">
            <Link 
              href="/"
              className="text-white hover:text-pink-400 transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/how-it-works"
              className="text-white hover:text-pink-400 transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              href="/samples"
              className="text-white hover:text-pink-400 transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Samples
            </Link>
            <Link 
              href="/pricing"
              className="text-white hover:text-pink-400 transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/order"
              className="text-center py-2 bg-pink-500 hover:bg-pink-600 rounded-full font-medium transition text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}