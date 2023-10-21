import { CommonUploader, IconUploader } from '@/component/icon-uploader'
import { PageCreateor } from '@/core/create-page'
import { user } from '@prisma/client'
import axios from 'axios'
import { toNumber } from 'lodash'

const MESSAGE_TYPE = {
  text: '文本',
  audio: '音频',
  image: '图片',
}
export const messageMetaList: PageCreateor['columns'] = [
  {
    title: '群名称',
    name: 'channel_id',
    hideInForm: true,
    hideInSearch: true,
    hideInTable: true,
    apiValue: toNumber,
  },
  {
    title: '群名称',
    name: ['channel', 'channel_name'],
    hideInForm: true,
    hideInSearch: true,
  },
  {
    title: '消息类型',
    name: 'message_type',
    valueEnum: MESSAGE_TYPE,
  },
  {
    valueType: 'dependency',
    name: ['message_type'],
    hideInTable: true,
    hideInSearch: true,
    columns: ({ message_type }) => {
      if (message_type === 'image') {
        return [
          {
            title: '图片消息内容',
            name: 'image_url',
            valueType: 'image',
            colProps: { xs: 6 },
            hideInSearch: true,
            renderFormItem: (props) => <IconUploader {...props} max={1} multiple={false} />,
          },
          {
            title: '消息内容',
            name: 'content',
            valueType: 'textarea',
            hideInSearch: true,
            colProps: { xs: 9 },
          },
        ]
      }
      if (message_type === 'audio') {
        return [
          {
            title: '音频',
            name: 'audio_url',
            valueType: 'text',
            colProps: { xs: 6 },
            hideInSearch: true,
            renderFormItem: () => <CommonUploader category="audio" />,
          },
          {
            colProps: { xs: 9 },
            name: 'content',
            title: '消息内容',
            hideInSearch: true,
            valueType: 'textarea',
          },
        ]
      }
      return [
        {
          title: '消息内容',
          name: 'content',
          valueType: 'textarea',
          hideInSearch: true,
          colProps: { xs: 9 },
        },
      ]
    },
  },
  {
    title: '消息内容(中文)',
    name: 'content_cn',
    valueType: 'textarea',
    colProps: { xs: 9 },
    hideInSearch: true,
  },
  {
    title: '原始内容',
    name: 'original_content',
    valueType: 'text',
    hideInSearch: true,
  },
  {
    title: '发送者 ID',
    name: 'sender',
    apiValue: toNumber,
    hideInSearch: true,
    colProps: { xs: 9 },
    request: async () => {
      return axios.get('/api/user?current=0&pageSize=100').then((res) =>
        res.data.data.data.map((item: user) => ({
          value: item.id,
          label: item.nickname,
        }))
      )
    },
  },
  {
    colProps: { xs: 9 },
    title: '发送者名称',
    name: 'sender_nickname',
  },
  {
    colProps: { xs: 9 },
    title: '发送时间',
    valueType: 'dateTime',
    hideInSearch: true,
    name: 'created_time',
  },
]
