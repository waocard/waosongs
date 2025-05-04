// src/context/auth-context.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if the user is already logged in
    const checkUserLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Validate the token with your API
          const response = await fetch('http://localhost:3001/api/auth/validate', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            
            // Set cookies for server-side middleware
            document.cookie = `token=${token}; path=/; secure`;
            document.cookie = `userRole=${userData.role}; path=/; secure`;
            
            // Redirect based on user role if they're on the login page
            if (window.location.pathname === '/login') {
              setTimeout(() => {
                if (userData.role === 'admin') {
                  window.location.href = '/admin';
                } else {
                  window.location.href = '/dashboard';
                }
              }, 100);
            }
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('token');
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserLoggedIn();
  }, [router]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Use the backend API endpoint
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      console.log('Login response:', data);
      localStorage.setItem('token', data.token);
      
      // Set cookies for server-side middleware
      document.cookie = `token=${data.token}; path=/; secure`;
      document.cookie = `userRole=${data.user.role}; path=/; secure`;
      
      setUser(data.user);
      
      // Redirect based on user role
      console.log('User role:', data.user.role);
      console.log('Is admin?', data.user.role === 'admin');
      
      // Small delay to ensure state is updated before redirect
      setTimeout(() => {
        if (data.user.role === 'admin') {
          console.log('Redirecting to admin dashboard');
          window.location.href = '/admin';
        } else {
          console.log('Redirecting to user dashboard');
          window.location.href = '/dashboard';
        }
      }, 100);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, make an API call to your backend
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
      
      if (!response.ok) {
        throw new Error('Signup failed');
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      setUser(data.user);
      router.push('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    
    // Clear cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    setUser(null);
    router.push('/');
  };

  // Make sure to return the JSX
  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};