import { PageCreateor } from '@/core/create-page'
import { ProFormListParams, createProFormList, useProFormListCommonProps } from '@/utils/pro-form-list-common-props'
import {
  ProForm,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components'
import { scene_context_reminder, scenes } from '@prisma/client'
import { Space } from 'antd'
import axios from 'axios'
import { debounce, noop } from 'lodash'
import { nanoid } from 'nanoid'

function ScenesContextReminder(props: { params: ProFormListParams }) {
  const commonProps = useProFormListCommonProps({
    api: '/api/scenes_context_reminder',
    params: props.params,
    required: false,
    defaultRecord: {
      type: 'WORD',
      reminder: '',
      reminder_cn: '',
    },
  })

  return (
    <ProFormList {...commonProps}>
      <ProFormSelect colProps={{ xs: 6 }} label="类型" name="type" valueEnum={{ WORD: '单词', SENTENCE: '句子' }} />
      <ProFormText name="reminder" width="md" label="原文" placeholder="请输入原文" colProps={{ xs: 6 }} />
      <ProFormText name="reminder_cn" label="翻译" placeholder="请输入翻译" colProps={{ xs: 6 }} />
    </ProFormList>
  )
}

function ScenesContextGuide(props: { params: ProFormListParams }) {
  const commonProps = useProFormListCommonProps({
    api: '/api/scenes_context_guide',
    params: props.params,
    defaultRecord: {
      guide: '',
    },
  })

  return (
    <ProFormList {...commonProps}>
      <ProFormTextArea name="guide" label="引导语" placeholder="引导语" colProps={{ xs: 24 }} />
    </ProFormList>
  )
}

export const scenesContextMetaList: PageCreateor['columns'] = [
  {
    title: '场景类型',
    dataIndex: ['scene', 'scenes_name'],
    name: 'scenes_id',
    required: true,
    apiValue: (value) => Number(value),
    request: () =>
      axios.get('/api/scenes?current=1&pageSize=100').then((res) => {
        return res.data?.data?.data?.map((item: scenes) => ({
          label: item.scenes_name,
          value: item.id,
        }))
      }),
  },
  {
    title: '场景描述(短语)',
    required: true,
    tooltip: '用户内部快速查看',
    dataIndex: 'short_scenes_context_description',
  },
  {
    title: '场景描述',
    required: true,
    dataIndex: 'scenes_context_description',
    hideInSearch: true,
    valueType: 'textarea',
  },
  {
    title: '场景描述(中文)',
    required: true,
    dataIndex: 'scenes_context_description_cn',
    hideInSearch: true,
    valueType: 'textarea',
  },
  {
    title: '场景提示词',
    dataIndex: 'prompt',
    hideInSearch: true,
    valueType: 'textarea',
  },
  {
    title: '创建时间',
    dataIndex: 'created_time',
    valueType: 'date',
    hideInForm: true,
    apiValue: (value) => new Date(value as string),
  },
  {
    title: '第一句引导语',
    dataIndex: 'scene_context_guides',
    tooltip: '有多条引导语时，进入聊天后随机一条数据发送给用户',
    hideInTable: true,
    hideInSearch: true,
    required: true,
    renderFormItem: createProFormList(ScenesContextGuide),
  },
  {
    title: '场景提示词',
    dataIndex: 'scene_context_reminders',
    hideInTable: true,
    hideInSearch: true,
    renderFormItem: createProFormList(ScenesContextReminder),
  },
]
