import { PageCreateor } from '@/core/create-page'
import { COMMON_STATUS } from '@/sources/value-enum/common-status'

export const userMetaList: PageCreateor['columns'] = [
  {
    title: '用户名',
    name: 'nickname',
  },
  {
    title: '用户编号',
    name: 'user_no',
  },
  {
    title: '邀请人编号',
    name: 'inviter',
  },
  {
    title: '手机号',
    name: 'phone',
  },
  {
    title: '会员等级',
    name: 'membership_level',
    hideInSearch: true,
  },
  {
    title: '会员过期时间',
    name: 'membership_expired',
    hideInSearch: true,
    valueType: 'dateTime',
  },
  {
    title: '是否付费用户',
    name: 'is_paid',
    valueType: 'switch',
  },
  {
    title: '状态',
    name: 'status',
    valueEnum: COMMON_STATUS,
  },
]
