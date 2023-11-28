import { PageCreateor } from '@/core/create-page'
import { FEEDBACK_TYPE } from './value-enum/feedback-type'
import { FEEDBACK_READ_STATUS } from './value-enum/feedback-read-status'

export const feedbackMetaList: PageCreateor['columns'] = [
  // TODO: 实现 message 配置，表名：feedback
  {
    title: '类型',
    name: 'type',
    disabledInEdit: true,
    valueEnum: FEEDBACK_TYPE,
  },
  {
    title: '用户 id',
    disabledInEdit: true,
    name: 'user_id',
    valueType: 'digit',
  },
  {
    title: '评分',
    disabledInEdit: true,
    name: 'score',
    hideInSearch: true,
    valueType: 'digit',
  },
  {
    title: '状态',
    name: 'status',
    valueEnum: FEEDBACK_READ_STATUS,
  },
  {
    title: '内容',
    disabledInEdit: true,
    name: 'content',
    ellipsis: true,
    hideInSearch: true,
    valueType: 'textarea',
  },
  {
    title: '回复',
    name: 'reply',
    hideInTable: true,
    hideInSearch: true,
    valueType: 'textarea',
  },
]
