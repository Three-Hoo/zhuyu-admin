import { uploadFile } from '@/utils/web-sts'
import { UploadOutlined } from '@ant-design/icons'
import { ProFormUploadButton, ProFormUploadButtonProps, nanoid } from '@ant-design/pro-components'
import { createField } from '@ant-design/pro-form/lib/BaseForm'
import { Button, Upload, message } from 'antd'
import { RcFile } from 'antd/es/upload'
import { isString } from 'lodash'

const getFileObject = (url: string) => ({ url: url, uid: url, name: url })

export const IconUploader = (
  props: Omit<ProFormUploadButtonProps, 'fieldProps' | 'children' | 'width' | 'title' | 'formItemProps'> & {
    multiple?: boolean
  }
) => {
  const value = isString(props.value) ? props.value.split(',').map(getFileObject) : props.value

  return (
    <ProFormUploadButton
      {...props}
      formItemProps={{}}
      label=""
      accept="image/*"
      listType="picture-card"
      value={value}
      onChange={(props) => {
        console.log('🚀 ~ file: icon-uploader.tsx:22 ~ props:', props)
        ;(props as any).onChange?.(props.fileList)
      }}
      style={{ marginBottom: 0 }}
    />
  )
}

type CommonUploaderProps = {
  category: 'image' | 'audio' | 'video'
  onChange?: (value: any) => void
  value?: any
  maxCount?: number
  multiple?: boolean
  name?: string
  fieldProps?: Record<string, unknown>
  proFieldProps?: Record<string, unknown>
}

export const CommonUploader = (props: CommonUploaderProps) => {
  const defaultFileList =
    typeof props.value === 'string' ? props.value.split(',').map((item) => getFileObject(item)) : props.value

  return (
    <Upload
      {...{
        customRequest: async (options) => {
          const url = await uploadFile({
            file: options.file as RcFile,
            category: props.category,
            onProgress: options.onProgress,
          })
          options.onSuccess?.({ file: url, url })
        },
        defaultFileList: defaultFileList,
        maxCount: props.maxCount ?? 1,
        multiple: props.multiple ?? false,
        listType: props.category === 'image' ? 'picture' : 'text',
        accept: props.category === 'image' ? 'image/*' : props.category === 'audio' ? 'audio/*' : 'video/*',
      }}
      name={props.name}
      {...props.fieldProps}
      {...props.proFieldProps}
    >
      <Button icon={<UploadOutlined />}>上传资源</Button>
    </Upload>
  )
}

export const CommonUploaderField = createField(CommonUploader)
