import ProFormQuill from '@/component/ProFormQuill'
import { IconUploader } from '@/component/icon-uploader'
import { PageCreateor } from '@/core/create-page'
import { CloudUploadOutlined } from '@ant-design/icons'
import { ProFormTextArea } from '@ant-design/pro-components'
import { Button, Popconfirm } from 'antd'
import axios from 'axios'
import { ACHIEVEMENT_CATEGORY } from './value-enum/achievement-category'
import { YES_OR_NO } from './value-enum/yes-or-no'

export const achievementMetaList: PageCreateor['columns'] = [
  {
    title: '成就名称',
    dataIndex: 'achievement_name',
    ellipsis: true,
    copyable: true,
    required: true,
  },
  {
    title: '成就套名称',
    dataIndex: ['achievement_type', 'name'],
    hideInSearch: true,
    hideInForm: true,
  },
  {
    title: '成就分类',
    required: true,
    disabledInEdit: true,
    dataIndex: 'category',
    valueEnum: ACHIEVEMENT_CATEGORY,
  },
  {
    title: '成就套',
    required: true,
    hideInTable: true,
    disabledInEdit: true,
    dataIndex: 'type_id',
    valueType: 'select',
    dependencies: ['category'],
    apiValue: (value) => Number(value),
    request: (params) =>
      axios.get('/api/achievement_type', { params: { ...params, current: 1, pageSize: 100 } }).then((res) => {
        return res.data.data.map((item: any) => ({
          label: item.name,
          value: item.id,
        }))
      }),
  },
  {
    title: '已完成人数',
    hideInSearch: true,
    hideInForm: true,
    dataIndex: ['_count', 'user_achievements'],
  },
  {
    title: '激活图标',
    required: true,
    width: 'md',
    colProps: { xs: 12 },
    name: 'icon',
    hideInSearch: true,
    hideInTable: true,
    renderFormItem: (props) => <IconUploader {...props} max={1} multiple={false} />,
  },
  {
    title: '未激活图标',
    required: true,
    width: 'md',
    name: 'inactive_icon',
    colProps: { xs: 12 },
    hideInSearch: true,
    hideInTable: true,
    renderFormItem: (props) => <IconUploader {...props} max={1} multiple={false} />,
  },
  {
    title: '起始分数',
    required: true,
    name: 'start_score',
    colProps: { xs: 12 },
    hideInSearch: true,
    disabledInEdit: true,
    valueType: 'digit',
    apiValue: (value) => Number(value),
  },
  {
    title: '结束分数',
    required: true,
    name: 'end_score',
    colProps: { xs: 12 },
    hideInSearch: true,
    disabledInEdit: true,
    valueType: 'digit',
    apiValue: (value) => Number(value),
  },
  {
    title: '描述',
    name: 'describe',
    hideInSearch: true,
    copyable: true,
    renderFormItem: (props: any) => <ProFormTextArea {...props} label="" style={{ marginBottom: 0 }} />,
  },
  {
    title: '成就描述详情',
    name: 'detail',
    hideInTable: true,
    hideInSearch: true,
    renderFormItem: (props) => <ProFormQuill {...props} label="" />,
  },
  {
    title: '状态',
    dataIndex: 'is_publish',
    valueType: 'select',
    hideInForm: true,
    valueEnum: YES_OR_NO,
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <Popconfirm
        key="deploy"
        title={`${record.is_publish ? '取消' : '发布'}成就`}
        description={`你确定要${record.is_publish ? '下架' : '发布'}该成就吗？`}
        onConfirm={() =>
          axios
            .patch(`/api/achievement?id=${record.id}`, { is_publish: !record.is_publish })
            .then(() => action?.reload())
        }
        okText="Yes"
        cancelText="No"
      >
        <Button size="small">
          <CloudUploadOutlined /> {record.is_publish ? '下架' : '发布'}
        </Button>
      </Popconfirm>,
    ],
  },
]
