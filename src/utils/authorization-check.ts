import { NextApiRequest } from 'next'
import { NextApiResponse } from 'next/dist/shared/lib/utils'
import { NextRequest } from 'next/server'

export const checkUnAuthorizationSSR = (req: NextApiRequest) => {
  const user = req.session.user
  if (!user || user.expires < Date.now()) {
    return {
      redirect: { destination: '/login', permanent: false },
    }
  }
  return { props: {} }
}

export const checkAuthorizationSSR = (req: NextRequest) => {
  const user = (req as any).session.user
  // 用户已登录
  if (user && user.expires > Date.now()) {
    return {
      redirect: { destination: '/dashboard', permanent: false },
    }
  }
  return { props: {} }
}

export const checkUnAuthorizationAPI = (req: NextApiRequest, res: NextApiResponse) => {
  const user = req.session.user
  if (!user) {
    return '未登录'
  }

  if (user.expires < Date.now()) {
    return '登录已过期'
  }

  return ''
}

export const setAuthorizationSession = async (request: NextApiRequest, username: string) => {
  request.session.user = {
    admin: true,
    username,
    expires: new Date().getTime() + 24 * 60 * 60 * 1000,
  }

  await request.session.save()
}
