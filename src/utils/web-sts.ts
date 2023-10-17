// 对更多字符编码的 url encode 格式
import { RcFile } from 'antd/lib/upload'
import axios from 'axios'

const camSafeUrlEncode = function (str: string) {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
}

// 计算签名
export const getSTSAuthorization = function () {
  return axios.get('/api/sts').then((res) => res.data)
}

// 上传文件
export const uploadFile = async function (file: RcFile, stsAuthorizationInfo?: any) {
  const fileName = file.name
  let ext = ''
  const lastDotIndex = fileName.lastIndexOf('.')
  if (lastDotIndex > -1) {
    // 这里获取文件后缀 由服务端生成最终上传的路径
    ext = fileName.substring(lastDotIndex + 1)
  }

  const info = stsAuthorizationInfo ?? await getSTSAuthorization()
  const auth = info.authorization
  const securityToken = info.securityToken
  const Key = info.cosKey
  const protocol = location.protocol === 'https:' ? 'https:' : 'http:'
  const prefix = protocol + '//' + info.cosHost
  const url = prefix + '/' + camSafeUrlEncode(Key).replace(/%2F/g, '/')
  const xhr = new XMLHttpRequest()
  xhr.open('PUT', url, true)
  xhr.setRequestHeader('Authorization', auth)
  securityToken && xhr.setRequestHeader('x-cos-security-token', securityToken)
  xhr.upload.onprogress = function (e) {
    console.log('上传进度 ' + Math.round((e.loaded / e.total) * 10000) / 100 + '%')
  }
  let resolve: (value: string | PromiseLike<string>) => void, reject: (reason?: any) => void, promise
  promise = new Promise<string>(function (res, rej) {
    resolve = res
    reject = rej
  })
  xhr.onload = function () {
    if (/^2\d\d$/.test('' + xhr.status)) {
      const ETag = xhr.getResponseHeader('etag')
      resolve(url)
    } else {
      reject('文件 ' + Key + ' 上传失败')
    }
  }
  xhr.onerror = function () {
    reject('文件 ' + Key + ' 上传失败')
  }
  xhr.send(file)
  return promise
}
