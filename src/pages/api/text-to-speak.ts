import { BadRequest } from '@/core/api_error'
import { Controller } from '@/core/controller'
import { SpeechConfig, AudioConfig } from 'microsoft-cognitiveservices-speech-sdk'
import { nanoid } from 'nanoid'
import { NextApiRequest } from 'next'

import * as SpeechSynthesisSDK from 'microsoft-cognitiveservices-speech-sdk'
import COS from 'cos-nodejs-sdk-v5'
import artTemplate from 'art-template'

const GENERAL_SSML = `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">
<voice name="{{role}}">
  <mstts:express-as style="{{style}}" styledegree="{{styledegree}}">
    <prosody rate="{{rate}}" pitch="0%">
    {{content}}
    </prosody>
  </mstts:express-as>
</voice>
</speak>
`

const render = artTemplate.compile(GENERAL_SSML)

const speechConfig = SpeechSynthesisSDK.SpeechConfig.fromSubscription(
  process.env.AZURE_SPEECH_KEY!,
  process.env.AZURE_SPEECH_REGION!
)

export type PostTextToSpeak = {
  role: string
  content: string
  style?: string
  rate?: string
  styledegree?: string
}

const rates = ['x-slow', 'slow', 'default', 'medium', 'fast', 'x-fast']

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
      const { role, rate, style, content, styledegree } = request.query

      const speechSynthesizer = new SpeechSynthesisSDK.SpeechSynthesizer(speechConfig, undefined)
      speechConfig.speechSynthesisLanguage = 'zh-CN'

      if (!content || !role) {
        throw new BadRequest(`参数错误: ${content} ${role}`)
      }

      const SSML = render({
        role,
        content,
        style: style || 'chat',
        styledegree: styledegree || 1,
        rate: rates[Number(rate) || 2] || 'medium',
      })
      console.log('🚀 ~ file: text-to-speak.ts:69 ~ Translation ~ GET ~ SSML:', SSML)

      const audioData = await new Promise<ArrayBuffer>((resolve, reject) => {
        speechSynthesizer.speakSsmlAsync(
          SSML,
          async (result) => {
            if (result.errorDetails) {
              reject(result.errorDetails)
            }

            resolve(result.audioData)
            speechSynthesizer.close()
          },
          (error) => {
            reject(error)
            speechSynthesizer.close()
          }
        )
      })

      const cosController = new COS({ SecretId: process.env.COS_SECRET_ID, SecretKey: process.env.COS_SECRET_KEY })
      const cosBucket = process.env.COS_BUCKET as string
      const cosRegion = process.env.COS_REGION as string
      const cosKey = nanoid()

      const data = await cosController.putObject({
        Body: Buffer.from(audioData),
        Bucket: cosBucket,
        Key: `audios/${cosKey}/${cosKey}.wav`,
        Region: cosRegion,
      })

      return data
    }
  }
)
