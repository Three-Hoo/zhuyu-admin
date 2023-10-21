import { PageCreateor } from '@/core/create-page'
import { CloudUploadOutlined } from '@ant-design/icons'
import { Button, Popconfirm } from 'antd'
import axios from 'axios'
import { TASK_CATEGORY } from './value-enum/task-category'
import { COMMON_STATUS } from './value-enum/common-status'
import { TASK_TYPE } from './value-enum/task-type'

export const taskMetaList: PageCreateor['columns'] = [
  {
    title: '任务名称',
    name: 'task_name',
    copyable: true,
    required: true,
  },
  {
    title: '任务标识',
    name: 'identification',
    copyable: true,
    required: true,
    disabledInEdit: true,
    valueEnum: {
      NOOB_CEATE_CHAT: 'NOOB_CEATE_CHAT',
      NOOB_START_CHAT: 'NOOB_START_CHAT',
      NOOB_PLAY_ADUIO: 'NOOB_PLAY_ADUIO',
      NOOB_SENTENCE_TRANSLATE: 'NOOB_SENTENCE_TRANSLATE',
      NOOB_GRAMMAR_ANALYSIS: 'NOOB_GRAMMAR_ANALYSIS',
      NOOB_TEACH_REPLY: 'NOOB_TEACH_REPLY',
      NOOB_TEN_CHAT: 'NOOB_TEN_CHAT',
      NOOB_SHARE: 'NOOB_SHARE',
      NOOB_FEEDBACK: 'NOOB_FEEDBACK',
      NOOB_RECITE_WORD: 'NOOB_RECITE_WORD',
      NOOB_WORD_CHAT: 'NOOB_WORD_CHAT',
      NOOB_GENERATE_IMAGE: 'NOOB_GENERATE_IMAGE',
      NOOB_READ: 'NOOB_READ',
      NOOB_COLLECT_WORD: 'NOOB_COLLECT_WORD',
      NOOB_COLLECT_SENTENCE: 'NOOB_COLLECT_SENTENCE',
      NOOB_SHOW_ACHIEVE: 'NOOB_SHOW_ACHIEVE',
      NOOB_ALL_SETTINGS: 'NOOB_ALL_SETTINGS',
      NOOB_DAILY_CHECK: 'NOOB_DAILY_CHECK',
    },
  },
  {
    title: '任务分类',
    name: 'category',
    required: true,
    valueEnum: TASK_CATEGORY,
  },
  {
    title: '任务类型',
    name: 'task_type',
    disabledInEdit: true,
    required: true,
    valueEnum: TASK_TYPE,
  },
  {
    title: '任务奖励类型',
    name: 'reward_type',
    disabledInEdit: true,
    hideInSearch: true,
    required: true,
    valueEnum: {
      CREDIT: '竹简',
    },
  },
  {
    title: '任务奖励数量',
    name: 'quantity',
    hideInSearch: true,
    required: true,
    valueType: 'digit',
  },
  {
    title: '任务开始时间',
    name: 'start_time',
    valueType: 'dateTime',
    hideInSearch: true,
    apiValue: (value) => (value ? new Date(value as string) : undefined),
  },
  {
    title: '任务结束时间',
    name: 'end_time',
    valueType: 'dateTime',
    hideInSearch: true,
    apiValue: (value) => (value ? new Date(value as string) : undefined),
  },
  {
    title: '任务状态',
    name: 'task_status',
    hideInForm: true,
    valueEnum: COMMON_STATUS,
  },
  {
    hideInSearch: true,
    hideInTable: true,
    title: '指引 url',
    name: 'guide_url',
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <Popconfirm
        key="deploy"
        title={`${record.task_status === 'ENABLED' ? '取消' : '发布'}成就`}
        description={`你确定要${record.task_status === 'ENABLED' ? '下架' : '发布'}该任务吗？`}
        onConfirm={() =>
          axios
            .patch(`/api/task?id=${record.id}`, {
              task_status: record.task_status === 'ENABLED' ? 'DISABLED' : 'ENABLED',
            })
            .then(() => action?.reload())
        }
        okText="Yes"
        cancelText="No"
      >
        <Button size="small">
          <CloudUploadOutlined /> {record.task_status === 'ENABLED' ? '下架' : '发布'}
        </Button>
      </Popconfirm>,
    ],
  },
]
