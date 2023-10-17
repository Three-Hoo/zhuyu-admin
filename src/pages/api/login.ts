import { Controller } from '@/core/controller'
import { NextApiRequest } from 'next/dist/shared/lib/utils'
import { BadRequest } from '@/core/api_error'
import { setAuthorizationSession } from '@/utils/authorization-check'

export default Controller(
  class Login {
    async POST(request: NextApiRequest) {
      const { username, password } = request.body
      if (!['admin', 'word_admin', 'post_admin'].includes(username)) {
        throw new BadRequest('用户名错误')
      }
      if (password !== 'zhuYu123456') {
        throw new BadRequest('密码错误')
      }

      await setAuthorizationSession(request, username)
      return {}
    }
  }
)
