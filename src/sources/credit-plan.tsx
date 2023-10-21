import ProFormQuill from '@/component/ProFormQuill'
import { IconUploader } from '@/component/icon-uploader'
import { PageCreateor } from '@/core/create-page'
import { CloudUploadOutlined } from '@ant-design/icons'
import { Button, Popconfirm } from 'antd'
import axios from 'axios'
import { getCommonStatus } from './value-enum/common-status'

export const creditPlanMetaList: PageCreateor['columns'] = [
  // TODO: 实现 竹简 配置，表名：credit_plan
  {
    title: '描述',
    name: 'describe',
    required: true,
  },
  {
    title: '竹简数量',
    name: 'credit',
    required: true,
    valueType: 'digit',
    hideInSearch: true,
  },
  {
    title: '当前价格',
    name: 'amount',
    required: true,
    valueType: 'digit',
    hideInSearch: true,
  },
  {
    title: '原价',
    name: 'original_amount',
    valueType: 'digit',
    hideInSearch: true,
  },
  {
    title: '被购买次数',
    dataIndex: ['_count', 'records'],
    valueType: 'digit',
    hideInSearch: true,
    hideInForm: true,
  },
  {
    title: '图标',
    name: 'icon',
    hideInSearch: true,
    hideInTable: true,
    renderFormItem: (props) => <IconUploader {...props} max={1} multiple={false} />,
  },
  {
    title: '描述详情',
    name: 'detail',
    hideInTable: true,
    hideInSearch: true,
    renderFormItem: (props) => <ProFormQuill {...props} label="" />,
  },
  {
    title: '状态',
    name: 'status',
    hideInForm: true,
    valueEnum: getCommonStatus('已发布', '未发布'),
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <Popconfirm
        key="deploy"
        title={`${record.status === 'ENABLED' ? '取消' : '发布'}竹简套餐`}
        description={`你确定要${record.status === 'ENABLED' ? '下架' : '发布'}该竹简套餐吗？`}
        onConfirm={() =>
          axios
            .patch(`/api/credit-plan?id=${record.id}`, {
              status: record.status === 'ENABLED' ? 'DISABLED' : 'ENABLED',
            })
            .then(() => action?.reload())
        }
        okText="Yes"
        cancelText="No"
      >
        <Button size="small">
          <CloudUploadOutlined /> {record.status === 'ENABLED' ? '下架' : '发布'}
        </Button>
      </Popconfirm>,
    ],
  },
]
