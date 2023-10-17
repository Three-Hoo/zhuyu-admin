import { createPage } from '@/core/create-page'
import { taskMetaList } from '@/sources/task'

export default createPage({
  api: '/api/task',
  title: '任务',
  columns: taskMetaList,
})
