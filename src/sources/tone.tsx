import { PageCreateor } from '@/core/create-page'

export const toneMetaList: PageCreateor['columns'] = [
  {
    title: '角色',
    name: 'robot_id',
    apiValue: (value) => Number(value),
  },
]
