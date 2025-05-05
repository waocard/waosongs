import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // For debugging
  console.log('Middleware executing for path:', request.nextUrl.pathname);
  
  // Default behavior - continue to the requested page
  return NextResponse.next();
}

// Run middleware on all routes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};