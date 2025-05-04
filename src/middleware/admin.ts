// src/middleware/admin.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Check if the path starts with /admin
  const isAdminPath = path.startsWith('/admin');
  
  // Get the token and user role from cookies
  const token = request.cookies.get('token')?.value;
  const userRole = request.cookies.get('userRole')?.value;
  
  // If the path is an admin path and the user is not an admin or not logged in, redirect to login
  if (isAdminPath && (!token || userRole !== 'admin')) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', path);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ['/admin/:path*']
};