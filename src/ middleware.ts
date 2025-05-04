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
  
  // Check if the path starts with /admin
  const isAdminPath = path.startsWith('/admin');
  
  // Get the token from the cookies
  const token = request.cookies.get('token')?.value;
  
  // Get user role from a custom cookie - we'll set this when logging in
  const userRole = request.cookies.get('userRole')?.value;
  
  // If the path is protected and there's no token, redirect to the login page
  if (isPathProtected && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', path);
    return NextResponse.redirect(url);
  }
  
  // If the path is an admin path and the user is not an admin or not logged in, redirect to login
  if (isAdminPath && (!token || userRole !== 'admin')) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', path);
    return NextResponse.redirect(url);
  }
  
  // If the user is logged in and trying to access login/signup pages, redirect to dashboard
  if ((path === '/login' || path === '/signup') && token) {
    // If user is admin, redirect to admin dashboard, otherwise to user dashboard
    if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/order/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/login',
    '/signup'
  ]
};