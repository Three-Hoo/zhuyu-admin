import { PageCreateor } from '@/core/create-page'
import { ACHIEVEMENT_CATEGORY } from './value-enum/achievement-category'

export const achievementTypeMetaList: PageCreateor['columns'] = [
  {
    title: '成就套名称',
    name: 'name',
    dataIndex: 'name',
    colProps: { xs: 12 },
    rules: [{ required: true }],
  },
  {
    title: '分类',
    name: 'category',
    dataIndex: 'category',
    colProps: { xs: 12 },
    valueEnum: ACHIEVEMENT_CATEGORY,
    rules: [{ required: true }],
  },
]
