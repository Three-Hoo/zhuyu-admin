import { createPage } from '@/core/create-page'
import { sceneContextReminderMetaList } from '@/sources/scene-context-reminder'

export default createPage({
  api: '/api/scene-context-reminder',
  title: '提示词',
  columns: sceneContextReminderMetaList,
})
