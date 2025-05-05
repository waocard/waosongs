// src/components/order/auth-required-modal.tsx
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, LogIn, UserPlus, Music, ArrowRight } from 'lucide-react';

interface AuthRequiredModalProps {
  onClose: () => void;
  returnUrl: string;
}

export default function AuthRequiredModal({ onClose, returnUrl }: AuthRequiredModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Handle outside click to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    
    // Handle escape key to close modal
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    // Clean up event listeners
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);
  
  const encodedReturnUrl = encodeURIComponent(returnUrl);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div 
        ref={modalRef}
        className="bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4 animate-slideUp"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Music className="w-6 h-6 text-pink-400 mr-2" />
            <h3 className="text-xl font-bold">Account Required</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-300 mb-3">
            To place an order, you need to be signed in. This allows us to:
          </p>
          <ul className="text-gray-300 space-y-2 ml-4">
            <li className="flex items-start">
              <ArrowRight className="w-4 h-4 text-pink-400 mr-2 mt-1 flex-shrink-0" />
              <span>Track your order status and progress</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="w-4 h-4 text-pink-400 mr-2 mt-1 flex-shrink-0" />
              <span>Communicate with your assigned artist</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="w-4 h-4 text-pink-400 mr-2 mt-1 flex-shrink-0" />
              <span>Securely deliver your custom music</span>
            </li>
          </ul>
        </div>
        
        <div className="space-y-3">
          <Link
            href={`/login?returnTo=${encodedReturnUrl}`}
            className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-medium text-white flex items-center justify-center hover:opacity-90 transition"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Sign In
          </Link>
          
          <Link
            href={`/signup?returnTo=${encodedReturnUrl}`}
            className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium text-white flex items-center justify-center transition"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Create New Account
          </Link>
          
          <button
            onClick={onClose}
            className="w-full py-2 text-gray-400 hover:text-white transition"
          >
            Continue as Guest
          </button>
        </div>
        
        <p className="mt-4 text-gray-400 text-sm text-center">
          You can create and customize your order before signing in, but you&apos;ll need an account to complete your purchase.
        </p>
      </div>
    </div>
  );
}