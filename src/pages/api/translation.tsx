import { prisma } from '@/utils/db'
import { Controller } from '@/core/controller'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { BadRequest, NotFoundError, UnSupportMethodError } from '@/core/api_error'
import { paginator } from '@/utils/paginator'
import { convertionApiValue } from '@/core/create-page'
import { postMetaList } from '@/sources/post'
import { post_paragraph } from '@prisma/client'
import axios from 'axios'
import { createHash } from 'crypto'
import { nanoid } from 'nanoid'
import qs from 'qs'

function truncate(q: string) {
  const len = q.length
  if (len <= 20) return q
  return q.substring(0, 10) + len + q.substring(len - 10, len)
}

/**
 * 创建时间：2023/10/16
 * 作者：xinouyang
 * restful api for post
 */
export default Controller(
  class Translation {
    /**
     * Executes a GET request.
     *
     * @param {NextApiRequest} request - The request object.
     */
    async GET(request: NextApiRequest) {
      request.checkAuthorization()
      const { q, from = 'en', to = 'zh-CHS' } = request.query
      if (!q) {
        throw new BadRequest('参数错误')
      }

      const appKey = process.env.YOUDAO_APPID ?? '0c1b5e4ca7aaa024'
      const appSecret = process.env.YOUDAO_SECRET ?? '3IzRWkQmbU2Qb3Vpk4DKFwGv9wciYxoS'
      const salt = nanoid()
      const currentTime = Math.round(new Date().getTime() / 1000)
      const query = truncate(q as string)
      const signPayload = `${appKey}${query}${salt}${currentTime}${appSecret}`
      const sign = createHash('sha256').update(signPayload).digest('hex')

      const requestPayload = {
        q,
        from: from,
        to: to,
        appKey: appKey,
        salt: salt,
        sign: sign,
        signType: 'v3',
        curtime: currentTime,
      }

      const result = await axios.post('https://openapi.youdao.com/api?' + qs.stringify(requestPayload))
      return result.data
    }
  }
)
