// src/components/layout/footer.tsx
import Link from 'next/link';
import { Music } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900/80 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center space-x-2 mb-4">
            <Music className="w-8 h-8 text-pink-400" />
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400">
          WaoSongs
        </span>
            </div>
            <p className="text-gray-400 max-w-xs">
              Bringing emotions to life through personalized musical creations since 2025.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-medium text-white mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/categories/love" className="hover:text-pink-400 transition">Love Songs</Link></li>
                <li><Link href="/categories/birthday" className="hover:text-pink-400 transition">Birthday Songs</Link></li>
                <li><Link href="/categories/wedding" className="hover:text-pink-400 transition">Wedding Music</Link></li>
                <li><Link href="/categories/business" className="hover:text-pink-400 transition">Business Jingles</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-white mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-pink-400 transition">About Us</Link></li>
                <li><Link href="#" className="hover:text-pink-400 transition">Our Artists</Link></li>
                <li><Link href="#testimonials" className="hover:text-pink-400 transition">Testimonials</Link></li>
                <li><Link href="/contact" className="hover:text-pink-400 transition">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-pink-400 transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-pink-400 transition">Terms of Service</Link></li>
                <li><Link href="/copyright" className="hover:text-pink-400 transition">Copyright</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-500 text-sm">
          <p>© 2025 WaoSongs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}