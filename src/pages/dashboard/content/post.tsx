import { createPage } from '@/core/create-page'
import { postMetaList } from '@/sources/post'

export default createPage({
  api: '/api/post',
  title: '文章',
  columns: postMetaList,
  width: '80vw',
})
