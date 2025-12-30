import { NextResponse } from 'next/server';

// List of public paths that don't require authentication
const publicPaths = ['/login', '/register', '/', '/service'];

// Middleware function
export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );
  
  // Get auth token from cookies
  const token = request.cookies.get('auth-token')?.value;
  
  // If trying to access private route without token, redirect to login
  if (!isPublicPath && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // If already logged in and trying to access auth pages, redirect to home
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images/).*)',
  ],
};