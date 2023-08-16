import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export function middleware(req) {

  console.log("middleware executed: ", req.params);
  const authToken = req.cookies.get("jwtoken")?.value;
  if (!authToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/', '/user/:path*'],
}