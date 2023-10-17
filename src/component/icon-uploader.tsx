import { ProFormUploadButton, ProFormUploadButtonProps } from '@ant-design/pro-components'
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
        ;(props as any).onChange?.(props.fileList)
      }}
      style={{ marginBottom: 0 }}
    />
  )
}
