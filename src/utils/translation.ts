import axios from 'axios'
import { createHash } from 'crypto'
import { truncate } from 'lodash'
import { nanoid } from 'nanoid'

export const translation = async (q: string, from = 'en', to = 'zh-CHS') => {
  const salt = nanoid()
  const currentTime = Math.round(new Date().getTime() / 1000)
  const query = truncate(q)
  const signPayload = `${process.env.YOUDAO_APPID}${query}${salt}${currentTime}${process.env.YOUDAO_SECRET}`
  const sign = createHash('sha256').update(signPayload).digest('hex')

  const requestPayload = {
    q: q,
    from: from,
    to: to,
    appKey: process.env.YOUDAO_APPID,
    salt: salt,
    sign: sign,
    signType: 'v3',
    curtime: currentTime,
  }

  const result = await axios.post('https://openapi.youdao.com/api', { params: requestPayload })
  return result.data
}
