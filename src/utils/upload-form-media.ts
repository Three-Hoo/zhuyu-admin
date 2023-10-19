import { UploadFile, UploadProps } from 'antd'
import { merge } from 'lodash'
import { uploadFile } from './web-sts'

const getFileLists = (value: any) => {
  const isArrayValue = Array.isArray(value)
  if (!isArrayValue && value.originFileObj) {
    return [value]
  }
  if (!isArrayValue && value.fileList) {
    return value.fileList
  }
  if (!isArrayValue && value.file) {
    return [value.file]
  }
  if (isArrayValue && value.some((item) => Boolean(item.originFileObj) || item.file || item.fileList)) {
    return value
  }
  return []
}

const filterEntries = (values: Record<string, any>) => {
  const fileEntries: any[] = Object.entries(values).filter(([key, value]) => {
    const isFileList = getFileLists(value)
    if (isFileList.length) {
      return true
    }

    if (Array.isArray(value)) {
      return value.map((item) => filterEntries(item)).length
    }
    return false
  })

  return fileEntries
}

let count = 0

const uploadEntries = async (enteries: [string, any][]) => {
  if (count > 100) {
    throw new Error('12count')
  }
  count++
  const urlEntries = (await Promise.all(
    enteries.map(async ([key, value]) => {
      const fileList = getFileLists(value)

      const uploadedFiles = await Promise.all(
        fileList.map((item: UploadFile) => {
          if (item.url) {
            return item.url
          }
          if (item.response?.url) {
            return item.response?.url
          }
          if (item.originFileObj) {
            return uploadFile({ file: item.originFileObj })
          }
          return ''
        }) ?? []
      )

      if (uploadedFiles.length) {
        return [key, uploadedFiles.join(',')]
      }

      if (Array.isArray(value) && !uploadedFiles.length) {
        return [key, await Promise.all(value.map((item) => uploadFormMedia(item)))]
      }
      return [key, value]
    })
  )) as any[]
  return urlEntries
}

export const uploadFormMedia = async (values: Record<string, any>) => {
  let newValues = { ...values }
  const fileEntries = filterEntries(values)
  console.log('🚀 ~ file: upload-form-media.ts:73 ~ uploadFormMedia ~ newValues:', newValues, fileEntries)
  if (!fileEntries) {
    return values
  }

  const urlEntries = await uploadEntries(fileEntries as any)

  newValues = merge({}, values, Object.fromEntries(urlEntries))
  console.log('🚀 ~ file: upload-form-media.ts:39 ~ uploadFormMedia ~ newValues:', newValues, urlEntries)
  return newValues
}
