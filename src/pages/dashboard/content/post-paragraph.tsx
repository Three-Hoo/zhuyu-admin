import { createPage } from '@/core/create-page'
import { postParagraphMetaList } from '@/sources/post-paragraph'

export default createPage({
  api: '/api/post-paragraph',
  title: '正文管理',
  columns: postParagraphMetaList,
})
