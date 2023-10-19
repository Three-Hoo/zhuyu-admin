import { createPage } from '@/core/create-page'
import { channelMetaList } from '@/sources/channel'

export default createPage({
  api: '/api/channel',
  title: '群聊',
  columns: channelMetaList,
})
