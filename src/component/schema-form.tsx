import { uploadFile } from '@/utils/web-sts'
import { BetaSchemaForm, ProFormInstance } from '@ant-design/pro-components'
import { FormSchema } from '@ant-design/pro-form/lib/components/SchemaForm'
import { useRef } from 'react'

export const ProSchemaForm = <T, ValueType = 'text'>(
  props: FormSchema<T, ValueType> & { onConfirm?: (values: T) => Promise<unknown> }
) => {
  const ref = useRef<ProFormInstance>()

  return (
    <BetaSchemaForm
      formRef={ref}
      {...props}
      onFinish={async (values) => {
        const allowCancel = await props.onConfirm?.(
          Object.fromEntries(
            await Promise.all(
              Object.entries(values).map(async ([key, value]) => {
                if (Array.isArray(value) && value.some((item) => Boolean(item.originFileObj))) {
                  return [
                    key,
                    (
                      await Promise.all(
                        value.map((item) => {
                          if (item.url) {
                            return item.url
                          }
                          console.log('item.originFileObj', item.originFileObj)
                          return uploadFile({ file: item.originFileObj })
                        })
                      )
                    ).join(','),
                  ]
                }
                return [key, value]
              })
            )
          ) as any
        )
        if (allowCancel === false) {
          return false
        }
        ref.current?.resetFields()
        return true
      }}
    />
  )
}
