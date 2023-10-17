import { ProTable, ProTableProps } from '@ant-design/pro-components'
import { useToggle } from 'ahooks/lib'
import { Modal } from 'antd'
import { ReactNode } from 'react'

type TableModalProps = {
  trigger: ReactNode
  title?: string
  onFinish?: () => Promise<boolean>
  tableProps: ProTableProps<Record<string, any>, Record<string, any>, 'text'>
}

export const ProTableModal = (props: TableModalProps) => {
  const [visible, { toggle }] = useToggle(false)

  return (
    <div>
      <div onClick={() => toggle()}>{props.trigger}</div>
      <Modal
        title={props.title}
        open={visible}
        width="80vw"
        onCancel={() => toggle()}
        onOk={async () => {
          if (props.onFinish) {
            const canCancel = await props.onFinish?.()
            if (canCancel) {
              toggle()
            }
            return
          }
          toggle()
        }}
      >
        <ProTable
          options={{ fullScreen: false, setting: false, reload: false, density: false }}
          {...props.tableProps}
          size="small"
        />
      </Modal>
    </div>
  )
}
