import { createPage } from '@/core/create-page'
import { feedbackMetaList } from '@/sources/feedback'

export default createPage({
  api: '/api/feedback',
  title: 'message',
  hideCreate: true,
  columns: feedbackMetaList,
})
