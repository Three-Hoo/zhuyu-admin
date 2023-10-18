import { createPage } from '@/core/create-page'
import { creditPlanMetaList } from '@/sources/credit-plan'

export default createPage({
  api: '/api/credit-plan',
  title: '竹简',
  columns: creditPlanMetaList,
})
