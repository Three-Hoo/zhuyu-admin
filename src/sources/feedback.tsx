import { PageCreateor } from '@/core/create-page'

export const feedbackMetaList: PageCreateor['columns'] = [
  // TODO: 实现 message 配置，表名：feedback
  {
    title: '类型',
    name: 'type',
    disabledInEdit: true,
    valueEnum: {
      WORD: '单词',
      OTHER: '其它',
    },
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
    valueEnum: {
      UNREAD: '未读',
      READED: '已读',
      REPLIED: '已回复',
    },
  },
  {
    title: '内容',
    disabledInEdit: true,
    name: 'content',
    hideInTable: true,
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