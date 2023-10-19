import ProFormQuill from '@/component/ProFormQuill'
import { IconUploader } from '@/component/icon-uploader'
import { PageCreateor } from '@/core/create-page'
import { CloudUploadOutlined } from '@ant-design/icons'
import { Button, Popconfirm } from 'antd'
import axios from 'axios'

export const membershipPlanMetaList: PageCreateor['columns'] = [
  {
    title: '标题',
    name: 'title',
    required: true,
  },
  {
    title: '描述',
    name: 'describe',
    required: true,
  },
  {
    title: '赠送竹简',
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
    title: '折扣结束时间',
    name: 'discount_end_datetime',
    valueType: 'date',
    hideInSearch: true,
    apiValue: (value) => value && new Date(value as string),
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
    title: '有效天数',
    name: 'expired',
    valueType: 'digit',
    hideInSearch: true,
  },
  {
    title: '状态',
    name: 'status',
    hideInForm: true,
    valueEnum: {
      ENABLED: {
        text: '已发布',
        status: 'Success',
      },
      DISABLED: {
        text: '未发布',
        status: 'Error',
      },
    },
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <Popconfirm
        key="deploy"
        title={`${record.status === 'ENABLED' ? '取消' : '发布'}会员套餐`}
        description={`你确定要${record.status === 'ENABLED' ? '下架' : '发布'}该会员套餐吗？`}
        onConfirm={() =>
          axios
            .patch(`/api/membership-plan?id=${record.id}`, {
              status: record.task_status === 'ENABLED' ? 'DISABLED' : 'ENABLED',
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
