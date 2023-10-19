import { createPage } from '@/core/create-page'
import { robotMetaList } from '@/sources/robot'

export default createPage({
  api: '/api/robot',
  title: 'AI 角色',
  columns: robotMetaList,
})
