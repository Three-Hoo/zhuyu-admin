import 'react-quill/dist/quill.snow.css'
import React from 'react'
import { createField } from '@ant-design/pro-form/lib/BaseForm/createField'
import dynamic from 'next/dynamic'
import { Form } from 'antd'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export const AntdQuill = ({ value, onChange, ...props }: any) => {
  return <ReactQuill theme="snow" value={value} onChange={onChange} {...props} />
}

export const ProFormQuill = (props: any) => (
  <Form.Item {...props}>
    <AntdQuill />
  </Form.Item>
)
export default createField(ProFormQuill)
