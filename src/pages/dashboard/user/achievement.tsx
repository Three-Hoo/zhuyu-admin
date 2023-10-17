import { ProTableModal } from '@/component/table/modal'
import { createPage } from '@/core/create-page'
import { achievementMetaList } from '@/sources/achievement'
import { achievementTypeMetaList } from '@/sources/achievement-type'
import { PlusCircleOutlined, UngroupOutlined } from '@ant-design/icons'
import { BetaSchemaForm } from '@ant-design/pro-components'
import { Button } from 'antd'
import axios from 'axios'

export default createPage({
  api: '/api/achievement',
  title: '成就',
  columns: achievementMetaList,
  renderToolbar: (action) => {
    return [
      <BetaSchemaForm
        key="create-package"
        layoutType="ModalForm"
        columns={achievementTypeMetaList}
        title="新建成就套"
        onFinish={async (values) => {
          await axios.post('/api/achievement_type', values)
          return true
        }}
        trigger={
          <Button type="primary" ghost>
            <PlusCircleOutlined />
            创建成就套
          </Button>
        }
      />,
      <ProTableModal
        key="show"
        tableProps={{
          columns: achievementTypeMetaList,
          request: (params) => axios.get('/api/achievement_type', { params }).then((res) => res.data),
        }}
        trigger={
          <Button type="primary" ghost>
            <UngroupOutlined />
            查看成就套
          </Button>
        }
      />,
    ]
  },
})
