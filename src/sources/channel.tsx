import { IconUploader } from '@/component/icon-uploader'
import { PageCreateor } from '@/core/create-page'
import { showColumnInTableWithIdColumn } from '@/utils/pro-form-list-common-props'
import { robot, scenes, scenes_context } from '@prisma/client'
import axios from 'axios'
import { toNumber } from 'lodash'
import Link from 'next/link'
import { COMPLEXITY } from './value-enum/complexity'

export const channelMetaList: PageCreateor['columns'] = [
  {
    title: '群聊名称',
    name: 'channel_name',
    required: true,
    renderText: (text, record) => <Link href={`/dashboard/chat/message/${record.id}`}>{text}</Link>,
  },
  {
    title: '群聊头像',
    name: 'avatar',
    required: true,
    valueType: 'avatar',
    colProps: { xs: 12 },
    hideInSearch: true,
    renderFormItem: (props) => <IconUploader {...props} max={1} multiple={false} />,
  },

  ...showColumnInTableWithIdColumn(['robot', 'robot_name'], {
    title: 'AI 角色',
    name: 'robot_id',
    hideInTable: true,
    colProps: { xs: 12 },
    apiValue: toNumber,
    request: async () => {
      return axios.get('/api/robot?current=0&pageSize=100').then((res) =>
        res.data.data.data.map((item: robot) => ({
          label: item.robot_name,
          value: item.id,
        }))
      )
    },
  }),

  ...showColumnInTableWithIdColumn(['scene', 'scenes_name'], {
    title: '群聊场景',
    name: 'scene_id',
    required: true,
    apiValue: toNumber,
    hideInTable: true,
    colProps: { xs: 12 },
    request: async () => {
      return axios.get(`/api/scenes?current=0&pageSize=100`).then((res) =>
        res.data.data.data.map((item: scenes) => ({
          label: item.scenes_name,
          value: item.id,
        }))
      )
    },
  }),
  ...showColumnInTableWithIdColumn(['scene_context', 'short_scenes_context_description'], {
    title: '群聊上下文',
    name: 'scene_context_id',
    hideInTable: true,
    hideInSearch: true,
    dependencies: ['scene_id'],
    apiValue: toNumber,
    colProps: { xs: 12 },
    request: async ({ scene_id }) => {
      return axios.get(`/api/scenes-context?current=0&pageSize=100&scenes_id=${scene_id}`).then((res) =>
        res.data.data.data.map((item: scenes_context) => ({
          label: item.short_scenes_context_description,
          value: item.id,
        }))
      )
    },
  }),

  {
    title: '语速',
    name: 'speed',
    valueType: 'slider',
    hideInSearch: true,
    hideInTable: true,
    colProps: { xs: 12 },
  },

  {
    title: '回复复杂性',
    name: 'complexity',
    required: true,
    valueEnum: COMPLEXITY,
    colProps: { xs: 12 },
  },

  {
    title: '是否公开',
    name: 'is_public',
    valueType: 'switch',
    colProps: { xs: 8 },
    disabledInEdit: true,
  },
  {
    title: '自动播放自己发送的语音',
    name: 'auto_play_audio_self',
    valueType: 'switch',
    hideInSearch: true,
    hideInTable: true,
    colProps: { xs: 8 },
  },
  {
    title: '自动播放别人的语音',
    name: 'auto_play_audio_other',
    valueType: 'switch',
    hideInSearch: true,
    hideInTable: true,
    colProps: { xs: 8 },
  },
  {
    title: '最后一条消息内容',
    name: 'last_message',
    valueType: 'textarea',
    hideInSearch: true,
    copyable: true,
  },
  {
    title: '最后一次更新时间',
    name: 'updated_time',
    valueType: 'dateTime',
    hideInSearch: true,
    hideInForm: true,
  },
  {
    title: '类型',
    name: 'type',
    disable: true,
    initialValue: '单聊',
    hideInTable: true,
    hideInSearch: true,
    hideInForm: true,
  },
]
