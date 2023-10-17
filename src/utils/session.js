import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next'
import { cookieOption } from '@/config/cookie'

export function withSessionRoute(handler) {
  return withIronSessionApiRoute(handler, cookieOption)
}

export function withSessionSsr(handler) {
  return withIronSessionSsr(handler, cookieOption)
}
