// src/components/dashboard/lyrics-modal.tsx
'use client';

import { useEffect, useRef } from 'react';
import { X, Download } from 'lucide-react';

interface LyricsModalProps {
    lyrics?: string; // Make lyrics optional
    title: string;
    onClose: () => void;
    onDownload?: () => void;
  }
  

  export default function LyricsModal({ lyrics = "", title, onClose, onDownload }: LyricsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent scrolling of the body when modal is open
    document.body.style.overflow = 'hidden';
    
    // Handle click outside to close
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    // Handle escape key to close
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      // Fallback download functionality
      const element = document.createElement('a');
      const file = new Blob([lyrics], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${title.toLowerCase().replace(/\s+/g, '-')}-lyrics.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4 animate-fade-in">
      <div 
        ref={modalRef}
        className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-slide-up"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Full Lyrics: {title}</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="bg-gray-700 bg-opacity-50 p-6 rounded-lg mb-6">
          <p className="text-gray-200 whitespace-pre-line">
            {lyrics}
          </p>
        </div>
        
        <div className="flex justify-between">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Close
          </button>
          
          <button 
            onClick={handleDownload}
            className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg flex items-center transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Lyrics
          </button>
        </div>
      </div>
    </div>
  );
}