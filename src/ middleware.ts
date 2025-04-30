// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Define protected routes
  const protectedPaths = ['/dashboard', '/order', '/settings'];
  const isPathProtected = protectedPaths.some((protectedPath) => 
    path === protectedPath || path.startsWith(`${protectedPath}/`)
  );
  
  // Get the token from the cookies
  const token = request.cookies.get('token')?.value;
  
  // If the path is protected and there's no token, redirect to the login page
  if (isPathProtected && !token) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('from', path);
    return NextResponse.redirect(url);
  }
  
  // If the user is logged in and trying to access login/signup pages, redirect to dashboard
  if ((path === '/auth/login' || path === '/auth/signup') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/order/:path*',
    '/settings/:path*',
    '/auth/login',
    '/auth/signup'
  ]
};