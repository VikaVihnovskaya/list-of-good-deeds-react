import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED = ['/', '/profile', '/friends'];
const AUTH_ONLY = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  if (PROTECTED.includes(pathname) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (AUTH_ONLY.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/profile', '/friends', '/login', '/register'],
};
