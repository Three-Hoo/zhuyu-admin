import { PageCreateor } from '@/core/create-page'
import { COMMON_STATUS } from '@/sources/value-enum/common-status'
import { YES_OR_NO } from './value-enum/yes-or-no'

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
    valueEnum: YES_OR_NO,
  },
  {
    title: '字间距',
    name: ['user_config', 'letter_column_space'],
    hideInForm: true,
    hideInSearch: true,
  },
  {
    title: '字体大小',
    name: ['user_config', 'letter_size'],
    hideInForm: true,
    hideInSearch: true,
  },
  {
    title: '行距',
    name: ['user_config', 'letter_row_space'],
    hideInForm: true,
    hideInSearch: true,
  },
  {
    title: '消息通知',
    name: ['user_config', 'notification_message'],
    valueEnum: YES_OR_NO,
    hideInForm: true,
    hideInSearch: true,
  },
  {
    title: '资讯通知',
    name: ['user_config', 'notification_news'],
    valueEnum: YES_OR_NO,
    hideInForm: true,
    hideInSearch: true,
  },
  {
    title: '签到通知',
    name: ['user_config', 'notification_sign_in'],
    valueEnum: YES_OR_NO,
    hideInForm: true,
    hideInSearch: true,
  },
  {
    title: '状态',
    name: 'status',
    valueEnum: COMMON_STATUS,
  },
]
