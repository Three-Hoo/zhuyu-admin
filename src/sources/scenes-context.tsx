import { PageCreateor } from '@/core/create-page'
import {
  ProFormListParams,
  createProFormList,
  showColumnInTableWithIdColumn,
  useProFormListCommonProps,
} from '@/utils/pro-form-list-common-props'
import { ProFormList, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { prompt_template, scenes } from '@prisma/client'
import axios from 'axios'
import { AIRole } from './value-enum/ai-role'

function ScenesContextReminder(props: { params: ProFormListParams }) {
  const commonProps = useProFormListCommonProps({
    api: '/api/scenes-context-reminder',
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
    api: '/api/scenes-context-guide',
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
    tooltip: '用于内部快速查看',
    dataIndex: 'short_scenes_context_description',
    copyable: true,
  },
  {
    title: '场景描述',
    required: true,
    dataIndex: 'scenes_context_description',
    hideInSearch: true,
    valueType: 'textarea',
    copyable: true,
    ellipsis: true,
  },
  {
    title: '场景描述(中文)',
    required: true,
    dataIndex: 'scenes_context_description_cn',
    hideInSearch: true,
    valueType: 'textarea',
    copyable: true,
    ellipsis: true,
  },
  ...showColumnInTableWithIdColumn(['prompt_template', 'name'], {
    title: 'prompt 模板',
    tooltip: '可以使用的变量: name：姓名, age：年龄, gender：性别, character：性格',
    dataIndex: 'prompt_template_id',
    hideInSearch: true,
    hideInTable: true,
    required: true,
    valueType: 'select',
    fieldProps: {
      showSearch: true,
    },
    request: async (params) => {
      return axios
        .get(`/api/prompt-template`, {
          params: {
            current: 1,
            pageSize: 20,
            name: params.keyWords || undefined,
          },
        })
        .then((res) => {
          console.log('res.data.data', res.data.data)
          return (res.data.data.data as prompt_template[]).map((item) => ({
            label: item.name,
            value: item.id,
          }))
        })
    },
  }),
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
  {
    title: '创建时间',
    dataIndex: 'created_time',
    valueType: 'date',
    hideInSearch: true,
    hideInForm: true,
    apiValue: (value) => new Date(value as string),
  },
]
console.log('🚀 ~ file: scenes-context.tsx:138 ~ scenesContextMetaList:', scenesContextMetaList)
