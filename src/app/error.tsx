'use client';

import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
      <div className="max-w-lg w-full bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Something went wrong</h1>
        <p className="text-gray-300 mb-8">
          We&apos;re sorry, but something went wrong. Please try again or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-full font-medium transition text-white"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </button>
          <Link
            href="/"
            className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-medium transition text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}