import { PageCreateor } from '@/core/create-page'
import { ProFormListParams, createProFormList, useProFormListCommonProps } from '@/utils/pro-form-list-common-props'
import { ProFormList, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components'
import { AIRole } from './value-enum/ai-role'
import { PROMPT_TEMPLATE_TYPE } from './value-enum/prompt-template-type'

function ScenesContextPrompt(props: { params: ProFormListParams }) {
  const commonProps = useProFormListCommonProps({
    api: '/api/prompt-template-content',
    params: props.params,
    defaultRecord: {
      role: 'user',
      content: '',
    },
  })

  return (
    <ProFormList {...commonProps}>
      <ProFormSelect name="role" label="角色" valueEnum={AIRole} colProps={{ xs: 6 }}></ProFormSelect>
      <ProFormTextArea name="content" label="内容" colProps={{ xs: 18 }} />
    </ProFormList>
  )
}

export const promptTemplateMetaList: PageCreateor['columns'] = [
  // TODO: 实现 prompt 模板 配置，表名：prompt_template
  {
    title: '模板',
    required: true,
    dataIndex: 'name',
  },
  {
    title: '类型',
    required: true,
    dataIndex: 'prompt_template_type',
    valueEnum: PROMPT_TEMPLATE_TYPE,
  },
  {
    title: '描述',
    required: true,
    dataIndex: 'description',
    hideInSearch: true,
    valueType: 'textarea',
  },
  {
    title: '模板内容',
    required: true,
    hideInSearch: true,
    hideInTable: true,
    dataIndex: 'prompt_template_contents',
    renderFormItem: createProFormList(ScenesContextPrompt),
  },
]
