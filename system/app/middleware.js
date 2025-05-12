import { NextResponse } from 'next/server';
import { verifyToken } from './lib/jwt';

export function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  console.log('🔒 Middleware - Accessing path:', path);

  // Define public paths that don't require authentication
  const isPublicPath = path === '/System/login';

  // Get the token from cookies
  const token = request.cookies.get('token')?.value;
  console.log('🔑 Middleware - Token present:', !!token);

  // If trying to access a protected route without a token, redirect to login
  if (!isPublicPath && !token) {
    console.log('🚫 Middleware - No token, redirecting to login');
    return NextResponse.redirect(new URL('/System/login', request.url));
  }

  // Verify the token
  const user = token ? verifyToken(token) : null;
  console.log('👤 Middleware - User type:', user?.userType);

  // If the path is public and user is logged in, redirect to appropriate dashboard
  if (isPublicPath && user) {
    console.log('🔄 Middleware - Redirecting logged-in user from login page');
    switch (user.userType) {
      case 'student':
        return NextResponse.redirect(new URL('/System/student', request.url));
      case 'instructor':
        return NextResponse.redirect(new URL('/System/instructor', request.url));
      case 'admin':
        return NextResponse.redirect(new URL('/System/admin', request.url));
    }
  }

  // If user is logged in, verify they have access to the requested page
  if (user) {
    const userType = user.userType;
    const pathPrefix = `/System/${userType}`;

    // If user tries to access a page not meant for their type, redirect to their dashboard
    if (!path.startsWith(pathPrefix)) {
      console.log('🚫 Middleware - Unauthorized access attempt, redirecting to dashboard');
      return NextResponse.redirect(new URL(pathPrefix, request.url));
    }
  }

  console.log('✅ Middleware - Access granted');
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/System/:path*'  // This will match all paths under /System/
  ]
}; 