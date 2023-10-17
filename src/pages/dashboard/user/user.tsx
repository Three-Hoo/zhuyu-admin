import { createPage } from '@/core/create-page'
import { userMetaList } from '@/sources/user'

export default createPage({
  api: '/api/user',
  title: '用户',
  hideOption: true,
  columns: userMetaList,
})
