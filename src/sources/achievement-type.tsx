import { PageCreateor } from '@/core/create-page'
import { ACHIEVEMENT_CATEGORY } from './value-enum/achievement-category'

export const achievementTypeMetaList: PageCreateor['columns'] = [
  {
    title: '成就组名称',
    name: 'name',
    dataIndex: 'name',
    colProps: { xs: 12 },
    rules: [{ required: true }],
  },
  {
    title: '成就组每次增加分数',
    name: 'per_score',
    dataIndex: 'per_score',
    colProps: { xs: 12 },
    valueType: 'digit',
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
  {
    title: '成就组标识',
    name: 'identification',
    dataIndex: 'identification',
    colProps: { xs: 12 },
    rules: [{ required: true }],
  },
]
