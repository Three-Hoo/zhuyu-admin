import STS from 'qcloud-cos-sts'
import moment from 'moment'
import crypto from 'crypto'
import { withSessionRoute } from '../../utils/session'

const config = {
  bucket: process.env.COS_BUCKET,
  region: process.env.COS_REGION,
  secretId: process.env.COS_SECRET_ID,
  secretKey: process.env.COS_SECRET_KEY,
  durationSeconds: 1800,
  extWhiteList: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'mp3', 'wav', 'pcm'],
}

const generateCosKey = function (ext, category = 'images') {
  const ymd = moment().format('YYYYMMDD')
  const timeStr = moment().format('YYYYMMDD_HHmmss')
  const rand = ('000000' + Math.random() * 1000000).slice(-6)
  return `${category}/${ymd}/IMG_${timeStr}_${rand}.${ext}`
}

const getTempCredential = async function (cosKey) {
  const shortBucketName = config.bucket.substr(0, config.bucket.lastIndexOf('-'))
  const appId = config.bucket.substr(1 + config.bucket.lastIndexOf('-'))
  const policy = {
    version: '2.0',
    statement: [
      {
        action: ['name/cos:PutObject', 'name/cos:PostObject'],
        effect: 'allow',
        resource: [
          'qcs::cos:' + config.region + ':uid/' + appId + ':prefix//' + appId + '/' + shortBucketName + '/' + cosKey,
        ],
      },
    ],
  }
  let tempKeys = null
  try {
    tempKeys = await STS.getCredential({
      secretId: config.secretId,
      secretKey: config.secretKey,
      durationSeconds: config.durationSeconds,
      policy: policy,
    })
    console.log(tempKeys)
    return tempKeys
  } catch (err) {
    console.log(err)
    res.send(JSON.stringify(err))
    return null
  }
}

const getSignature = function (tempCredential, cosHost, pathname) {
  const signAlgorithm = 'sha1'
  const credentials = tempCredential.credentials
  const keyTime = `${tempCredential.startTime};${tempCredential.expiredTime}`

  const signKey = crypto.createHmac(signAlgorithm, credentials.tmpSecretKey).update(keyTime).digest('hex')
  const httpString = `put\n/${pathname}\n\nhost=${cosHost}\n`
  const httpStringHash = crypto.createHash(signAlgorithm).update(httpString).digest('hex')
  const stringToSign = `${signAlgorithm}\n${keyTime}\n${httpStringHash}\n`
  // 步骤三：生成 Signature
  const signature = crypto.createHmac(signAlgorithm, signKey).update(stringToSign).digest('hex')
  // 步骤四：生成 authorization
  let authorization = `q-sign-algorithm=${signAlgorithm}&
q-ak=${credentials.tmpSecretId}&
q-sign-time=${keyTime}&
q-key-time=${keyTime}&
q-header-list=host&q-url-param-list=&q-signature=${signature}`

  // 去掉掉上面换行导致的\n
  authorization = authorization.replace(/\n/g, '')
  return authorization
}

const handler = withSessionRoute(async function STSHandler(req, res) {
  const cosHost = `${config.bucket}.cos.${config.region}.myqcloud.com`
  const cosKey = generateCosKey(req.query.ext || 'png', req.query.category)

  // 开始获取临时秘钥
  const tempCredential = await getTempCredential(cosKey)
  if (!tempCredential) {
    res.status(400).json({ ok: false, message: 'get temp credentials fail' })
    return
  }

  // 用临时秘钥计算签名
  let authorization = getSignature(tempCredential, cosHost, cosKey)

  // 返回域名、文件路径、签名、凭证信息
  res.status(200).json({
    cosHost: cosHost,
    cosKey: cosKey,
    authorization: authorization,
    securityToken: tempCredential.credentials.sessionToken,
  })
})

export default handler
