// src/app/login/page.tsx
'use client';

import { useState, Suspense, JSX } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Music, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import AdminLoginHint from '@/components/login/admin-login-hint';

// Define the LoginContent component with proper TypeScript typing
function LoginContent(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/dashboard';
  
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
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-300 text-center">
            Sign in to continue creating amazing custom music
          </p>
        </div>
        
        {loginError && (
          <div className="bg-red-500 bg-opacity-20 text-red-100 p-3 rounded-lg mb-6">
            {loginError}
          </div>
        )}
        
        <form onSubmit={(e) => {
          e.preventDefault();
          setLoginError('');
          setIsLoading(true);
          
          login(email, password)
            .then((data) => {
              // Check if the user is an admin and redirect appropriately
              const isAdmin = data?.user?.role === 'admin';
              
              // Determine redirect URL based on:
              // 1. If coming from an admin page, go there
              // 2. If admin user & no specific returnTo, go to admin dashboard
              // 3. If returnTo has order, add fromAuth parameter
              // 4. Otherwise use returnTo parameter

              let redirectUrl;
              
              if (returnTo.startsWith('/admin')) {
                // Always honor admin returnTo if that's where they came from
                redirectUrl = returnTo;
              } else if (isAdmin && returnTo === '/dashboard') {
                // Send admins to admin dashboard by default
                redirectUrl = '/admin';
              } else if (returnTo.includes('/order')) {
                // Add fromAuth parameter when redirecting back to the order page
                redirectUrl = `${returnTo}${returnTo.includes('?') ? '&' : '?'}fromAuth=true`;
              } else {
                // Use the provided returnTo value
                redirectUrl = returnTo;
              }
              
              console.log(`Redirecting user with role ${data?.user?.role} to: ${redirectUrl}`);
              router.push(redirectUrl);
            })
            .catch((error) => {
              console.error('Login error:', error);
              setLoginError('Invalid email or password. Please try again.');
            })
            .finally(() => {
              setIsLoading(false);
            });
        }}>
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
            <div className="flex justify-end mt-2">
              <Link href="/forgot-password" className="text-pink-400 text-sm hover:text-pink-300">
                Forgot password?
              </Link>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-medium text-white transition ${
              isLoading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90'
            }`}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-300">
            Don&apos;t have an account?{' '}
            <Link href={`/signup?returnTo=${encodeURIComponent(returnTo)}`} className="text-pink-400 hover:text-pink-300">
              Sign Up
            </Link>
          </p>
          
          {/* For development - show admin login hint */}
          {process.env.NODE_ENV !== 'production' && <AdminLoginHint />}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage(): JSX.Element {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}