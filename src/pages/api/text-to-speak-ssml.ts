import { BadRequest } from '@/core/api_error'
import { Controller } from '@/core/controller'
import { nanoid } from 'nanoid'
import { NextApiRequest } from 'next'

import * as SpeechSynthesisSDK from 'microsoft-cognitiveservices-speech-sdk'
import COS from 'cos-nodejs-sdk-v5'

const speechConfig = SpeechSynthesisSDK.SpeechConfig.fromSubscription(
  process.env.AZURE_SPEECH_KEY!,
  process.env.AZURE_SPEECH_REGION!
)

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
    async POST(request: NextApiRequest) {
      request.checkAuthorization()
      const { ssml } = request.body

      const speechSynthesizer = new SpeechSynthesisSDK.SpeechSynthesizer(speechConfig, undefined)
      speechConfig.speechSynthesisLanguage = 'zh-CN'

      if (!ssml) {
        throw new BadRequest(`参数错误: ${ssml}`)
      }

      const audioData = await new Promise<ArrayBuffer>((resolve, reject) => {
        speechSynthesizer.speakSsmlAsync(
          ssml,
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
