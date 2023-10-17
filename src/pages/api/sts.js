import STS from 'qcloud-cos-sts'
import moment from 'moment'
import crypto from 'crypto'
import { withSessionRoute } from '../../utils/session'

const config = {
  // 放行判断相关参数
  bucket: 'zhuyu-test-1256652038',
  region: 'ap-guangzhou',

  secretId: process.env.COS_SECRET_ID,
  secretKey: process.env.COS_SECRET_KEY,
  // 密钥有效期
  durationSeconds: 1800,
  // 这里填写存储桶、地域，例如：test-1250000000、ap-guangzhou
  // 限制的上传后缀
  extWhiteList: ['jpg', 'jpeg', 'png', 'gif', 'bmp'],
}

const generateCosKey = function (ext) {
  const ymd = moment().format('YYYYMMDD')
  const timeStr = moment().format('YYYYMMDD_HHmmss')
  const rand = ('000000' + Math.random() * 1000000).slice(-6)
  return `images/${ymd}/IMG_${timeStr}_${rand}.${ext}`
}

const getTempCredential = async function (cosKey) {
  const shortBucketName = config.bucket.substr(0, config.bucket.lastIndexOf('-'))
  const appId = config.bucket.substr(1 + config.bucket.lastIndexOf('-'))
  // 开始获取临时秘钥
  const policy = {
    version: '2.0',
    statement: [
      {
        action: ['name/cos:PutObject', 'name/cos:PostObject'],
        effect: 'allow',
        resource: [
          // 仅限cosKey资源
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

  // 步骤一：生成 SignKey
  const signKey = crypto.createHmac(signAlgorithm, credentials.tmpSecretKey).update(keyTime).digest('hex')
  console.log('signKey:' + signKey)

  // 步骤二：生成 StringToSign
  const httpString = `put\n/${pathname}\n\nhost=${cosHost}\n`
  console.log('httpString:' + httpString)
  const httpStringHash = crypto.createHash(signAlgorithm).update(httpString).digest('hex')
  const stringToSign = `${signAlgorithm}\n${keyTime}\n${httpStringHash}\n`
  console.log('stringToSign:' + stringToSign)

  // 步骤三：生成 Signature
  const signature = crypto.createHmac(signAlgorithm, signKey).update(stringToSign).digest('hex')
  console.log('signature:' + signature)

  // 步骤四：生成 authorization
  let authorization = `q-sign-algorithm=${signAlgorithm}&
q-ak=${credentials.tmpSecretId}&
q-sign-time=${keyTime}&
q-key-time=${keyTime}&
q-header-list=host&q-url-param-list=&q-signature=${signature}`

  // 去掉掉上面换行导致的\n
  authorization = authorization.replace(/\n/g, '')
  console.log('authorization:' + authorization)

  return authorization
}

const handler = withSessionRoute(async function STSHandler(req, res) {
  const cosHost = `${config.bucket}.cos.${config.region}.myqcloud.com`
  const cosKey = generateCosKey(req.query.ext ?? 'png')

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
