import { ProSchemaForm } from '@/component/schema-form'
import { ProTableModal } from '@/component/table/modal'
import { createPage } from '@/core/create-page'
import { scenesMetaList } from '@/sources/scenes'
import { scenesContextMetaList } from '@/sources/scenes-context'
import { PlusCircleOutlined, UngroupOutlined } from '@ant-design/icons'
import { BetaSchemaForm } from '@ant-design/pro-components'
import { Button } from 'antd'
import axios from 'axios'

export default createPage({
  api: '/api/scenes-context',
  title: '场景配置',
  columns: scenesContextMetaList,
  renderToolbar() {
    return [
      <ProSchemaForm
        key="create-package"
        layoutType="ModalForm"
        columns={scenesMetaList}
        title="新建场景类型"
        onConfirm={async (values) => axios.post('/api/scenes', values)}
        trigger={
          <Button type="primary" ghost>
            <PlusCircleOutlined />
            新建场景类型
          </Button>
        }
      />,
      <ProTableModal
        key="show"
        tableProps={{
          columns: scenesMetaList,
          request: (params) => axios.get('/api/scenes', { params }).then((res) => res.data.data),
        }}
        trigger={
          <Button type="primary" ghost>
            <UngroupOutlined />
            查看场景类型
          </Button>
        }
      />,
    ]
  },
})
