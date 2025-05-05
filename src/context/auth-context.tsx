// src/context/auth-context.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/types';

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<AuthResponse>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.waosongs.com';

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      // For client-side components, use window to check if we're in the browser
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }
      
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await fetch(`${apiUrl}/api/auth/validate`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            
            // Set cookies for server-side middleware
            document.cookie = `token=${token}; path=/; secure`;
            document.cookie = `userRole=${userData.role}; path=/; secure`;
          } else {
            // Clear invalid token
            localStorage.removeItem('token');
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            setUser(null);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          
          // Clear token on error
          localStorage.removeItem('token');
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [apiUrl]);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      
      // Set cookies for server-side middleware
      document.cookie = `token=${data.token}; path=/; secure`;
      document.cookie = `userRole=${data.user.role}; path=/; secure`;
      
      setUser(data.user);
      return data;
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
      const response = await fetch(`${apiUrl}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Signup failed');
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      
      // Set cookies for server-side middleware
      document.cookie = `token=${data.token}; path=/; secure`;
      document.cookie = `userRole=${data.user.role}; path=/; secure`;
      
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    
    // Clear cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    setUser(null);
    router.push('/');
  };

  // Make sure to return the JSX
  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated: !!user,
      login, 
      logout, 
      signup 
    }}>
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