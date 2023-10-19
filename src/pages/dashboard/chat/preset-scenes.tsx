import { createPage } from '@/core/create-page'
import { presetScenesMetaList } from '@/sources/preset-scenes'

export default createPage({
  api: '/api/preset-scenes',
  title: '预置配置',
  columns: presetScenesMetaList,
})
