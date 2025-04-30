// src/components/home/testimonials.tsx
import React from 'react';

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah J.",
      text: "The love song created for our anniversary brought tears to my eyes. Absolutely perfect!",
      category: "Anniversary",
      initial: "S"
    },
    {
      name: "Michael T.",
      text: "Our company jingle is catchy and professional. Clients remember us now!",
      category: "Business",
      initial: "M"
    },
    {
      name: "Elena & David",
      text: "The custom wedding piece made our first dance magical. Worth every penny.",
      category: "Wedding",
      initial: "E"
    }
  ];
  
  return (
    <section className="container mx-auto px-6 py-20">
      <h2 className="text-3xl text-white font-bold mb-12 text-center">
        What Our <span className="text-pink-400">Clients</span> Say
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-gray-800/20 backdrop-blur-sm p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center mr-3">
                <span className="font-bold">{testimonial.initial}</span>
              </div>
              <div>
                <p className="font-medium">{testimonial.name}</p>
                <p className="text-xs text-pink-400">{testimonial.category}</p>
              </div>
            </div>
            <p className="text-gray-300">{testimonial.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}