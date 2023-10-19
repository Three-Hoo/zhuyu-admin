import { BetaSchemaForm, nanoid } from '@ant-design/pro-components'
import { Button } from 'antd'

type MarkdownStruct = {
  type: 'h4' | 'h3' | 'h2' | 'text' | 'image' | 'audio' | 'video'
  content: string
}

type ImportMarkdownProps = {
  onFinish: (markdowns: MarkdownStruct[]) => boolean
}

export const ImportMarkdown = (props: ImportMarkdownProps) => {
  return (
    <BetaSchemaForm
      title="markdown 内容"
      columns={[{ name: 'content', valueType: 'textarea', formItemProps: { rules: [{ required: true }] } }]}
      layoutType="ModalForm"
      trigger={
        <Button type="primary" ghost>
          导入 Markdown 内容
        </Button>
      }
      onFinish={async (values: { content: string }) => {
        const contents = values.content.split(/\n/).map((item, index) => {
          const content = item.trim()
          if (content.startsWith('####')) {
            return {
              type: 'h4',
              content: content.slice(4).trim(),
            }
          }
          if (content.startsWith('###')) {
            return {
              type: 'h3',
              content: content.slice(3).trim(),
            }
          }
          if (content.startsWith('#')) {
            return {
              type: 'h2',
              content: content.slice(content.match(/^(#+).*?$/)?.[1].length).trim() ?? content,
            }
          }
          if (/!\[.*?\]\((.*?)\)/.test(content)) {
            return {
              type: 'image',
              content: content.match(/!\[.*?\]\((.*?)\)/)?.[1] ?? content,
            }
          }

          return {
            type: 'text',
            content: content,
          }
        }) as MarkdownStruct[]

        return props.onFinish(contents)
      }}
    />
  )
}
