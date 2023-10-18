import { createPage } from '@/core/create-page'
import { membershipPlanMetaList } from '@/sources/membership-plan'

export default createPage({
  api: '/api/membership-plan',
  title: '会员',
  columns: membershipPlanMetaList,
})
