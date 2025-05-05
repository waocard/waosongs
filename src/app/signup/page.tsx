// src/app/signup/page.tsx
'use client';

import { useState, Suspense, JSX } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Music, ArrowLeft, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

// Define the SignupContent component with proper TypeScript typing
function SignupContent(): JSX.Element {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signupError, setSignupError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/dashboard';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (password !== confirmPassword) {
      setSignupError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setSignupError('Password must be at least 6 characters');
      return;
    }
    
    setSignupError('');
    setIsLoading(true);
    
    try {
      await signup(name, email, password);
      
      // Add fromAuth parameter when redirecting back to the order page
      const redirectUrl = returnTo.includes('/order') 
        ? `${returnTo}${returnTo.includes('?') ? '&' : '?'}fromAuth=true` 
        : returnTo;
      
      router.push(redirectUrl);
    } catch (error) {
      console.error('Signup error:', error);
      setSignupError('Failed to create account. The email may already be in use.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
      <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-8">
        {/* Back link when coming from order flow */}
        {returnTo.includes('/order') && (
          <Link href={returnTo} className="flex items-center text-gray-300 hover:text-white mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Order
          </Link>
        )}
      
        <div className="flex flex-col items-center mb-8">
          <Music className="w-12 h-12 text-pink-400 mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Create an Account</h1>
          <p className="text-gray-300 text-center">
            Join WaoSongs to start creating amazing custom music
          </p>
        </div>
        
        {signupError && (
          <div className="bg-red-500 bg-opacity-20 text-red-100 p-3 rounded-lg mb-6">
            {signupError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-white mb-2 font-medium">
              Name
            </label>
            <input 
              type="text" 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
              placeholder="John Smith"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="email" className="block text-white mb-2 font-medium">
              Email
            </label>
            <input 
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-white mb-2 font-medium">
              Password
            </label>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
              placeholder="••••••••"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Password must be at least 6 characters
            </p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-white mb-2 font-medium">
              Confirm Password
            </label>
            <input 
              type="password" 
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-medium text-white transition flex items-center justify-center ${
              isLoading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90'
            }`}
          >
            {isLoading ? (
              'Creating account...'
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Create Account
              </>
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-300">
            Already have an account?{' '}
            <Link href={`/login?returnTo=${encodeURIComponent(returnTo)}`} className="text-pink-400 hover:text-pink-300">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage(): JSX.Element {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}