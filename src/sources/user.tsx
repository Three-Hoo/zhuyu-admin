import { PageCreateor } from '@/core/create-page'

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
    apiValue(value) {
      return value ? value === 'true' : undefined
    },
    valueEnum: {
      true: '是',
      false: '否',
    },
  },
  {
    title: '状态',
    name: 'status',
    valueEnum: {
      InActive: {
        text: '禁用',
        status: 'Error',
      },
      Active: {
        text: '启用',
        status: 'Success',
      },
    },
  },
]
