// src/components/home/categories.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Gift, Users, Award, Briefcase, ArrowRight } from 'lucide-react';

export default function Categories() {
  const [activeCategory, setActiveCategory] = useState('love');
  
  const categories = [
    { id: 'love', name: 'Love Songs', icon: <Heart className="w-6 h-6" />, description: 'Personalized music for love occasions' },
    { id: 'birthday', name: 'Birthday', icon: <Gift className="w-6 h-6" />, description: 'Personalized music for birthday celebrations' },
    { id: 'wedding', name: 'Wedding', icon: <Users className="w-6 h-6" />, description: 'Personalized music for wedding ceremonies' },
    { id: 'anniversary', name: 'Anniversary', icon: <Award className="w-6 h-6" />, description: 'Personalized music for anniversary celebrations' },
    { id: 'business', name: 'Business Jingles', icon: <Briefcase className="w-6 h-6" />, description: 'Personalized music for business needs' },
  ];
  
  return (
    <section className="container mx-auto px-6 py-20">
      <h2 className="text-3xl text-white font-bold mb-12 text-center">
        Discover Our <span className="text-pink-400">Categories</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {categories.map(category => (
          <div 
            key={category.id}
            className={`p-6 rounded-xl cursor-pointer transition-all transform hover:scale-105 flex flex-col items-center text-center ${
              activeCategory === category.id 
                ? 'bg-gradient-to-br from-pink-600/40 to-purple-600/40 shadow-lg' 
                : 'bg-gray-800/30 hover:bg-gray-800/50'
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center mb-4">
              {category.icon}
            </div>
            <h3 className="text-xl text-white font-medium mb-2">{category.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{category.description}</p>
            <Link 
              href={`/categories/${category.id}`}
              className="text-pink-400 flex items-center text-sm font-medium hover:text-pink-300 transition"
            >
              Explore <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}