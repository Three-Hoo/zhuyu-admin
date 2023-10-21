import { createPage } from '@/core/create-page'

import { messageMetaList } from '@/sources/value-enum'

export default createPage({
  api: (query) => (query.channel_id ? '/api/message?channel_id=' + query.channel_id : '/api/message'),
  title: '消息',
  columns: messageMetaList,
  mergeQueryOnFinish: true,
})
