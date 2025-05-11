import { NextResponse } from 'next/server';
import { verifyJwt } from '@/app/lib/jwt';

export function middleware(req) {
  const token = req.cookies.get('id_token')?.value;
  const user = verifyJwt(token);

  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/System/:path*', '/statistics/:path*']
};
