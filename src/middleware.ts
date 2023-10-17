import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getIronSession } from 'iron-session/edge'
import { cookieOption } from '@/config/cookie'

export const middleware = async (request: NextRequest) => {
  const res = NextResponse.next()
  const session = await getIronSession(request, res, cookieOption)

  const { user } = session as any

  if (!user || user.expires < Date.now()) {
    session.destroy()
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return res
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/dashboard/:path*',
}
