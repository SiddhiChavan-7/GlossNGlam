import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  // Admin routes are protected client-side via localStorage check
  // For extra security, you can add server-side token validation here
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
