import { IconUploader } from '@/component/icon-uploader'
import { PageCreateor } from '@/core/create-page'
import { VOICE_LIST, VOICE_MAP } from './value-enum/voices-list'
import { Button, Col, Input, Row, Select, Space, Tooltip, message } from 'antd'
import { ProFormList, ProFormSelect, ProFormSlider, ProFormTextArea } from '@ant-design/pro-components'
import { LoadingOutlined, PauseOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd/lib'
import { upperFirst } from 'lodash'
import { tone } from '@prisma/client'
import { VOICE_STYLE } from './value-enum/voice-style'
import { useTextToSpeak } from '@/utils/use-text-to-speak'
import {
  ProFormListParams,
  createProFormList,
  useParseProFormListParams,
  useProFormListCommonProps,
} from '@/utils/pro-form-list-common-props'
import { GENDER } from './value-enum/gender'

const microsoftVoicenames = VOICE_LIST.map((item) => [
  item.ShortName,
  `${item.LocalName}(${item.Gender}-${item.Locale}-语气数量:${item.StyleList?.length ?? 1})`,
  item.StyleList?.length,
]).sort((a, b) => {
  const element1 = a as [unknown, string, number]
  const element2 = b as [unknown, string, number]
  return (element2[2] ?? 0) - (element1[2] ?? 0)
}) as [string, string, number][]

const DEFAULT_CONTENT = 'To set the environment variable for your Speech resource key, open a console window'

const MicrosoftVoice = (props: {
  form: FormInstance
  config: any
  props: any
  value?: string
  onChange?: (value: string) => void
}) => {
  const { styledegree = 1, rate = 2, personal_blurb = DEFAULT_CONTENT } = props.form.getFieldsValue()
  const { isLoading, playing, togglePlay } = useTextToSpeak({
    role: props.value!,
    content: personal_blurb,
    styledegree,
    rate: rate,
    style: '',
  })

  return (
    <Space>
      <Select options={props.config.options} value={props.value} showSearch onChange={props.onChange} />
      <Button size="small" disabled={isLoading || !props.value} onClick={() => togglePlay()}>
        {isLoading ? (
          <LoadingOutlined />
        ) : (
          <>
            {playing ? '暂停' : '播放'}
            {playing ? <PauseOutlined /> : <PlayCircleOutlined />}
          </>
        )}
      </Button>
    </Space>
  )
}

const Tone = (props: { params: ProFormListParams; value?: tone[]; onChange?: (value: tone[]) => void }) => {
  const commonProps = useProFormListCommonProps({
    api: '/api/tone',
    params: props.params,
    required: true,
    defaultRecord: {
      microsoft_voice_style: '',
      guide: '',
      styledegree: 1,
    },
  })

  const { fieldValues } = useParseProFormListParams(props)
  const { rate = 2, microsoft_voice_name } = fieldValues
  const { isLoading, playing, togglePlay } = useTextToSpeak({
    role: microsoft_voice_name,
    content: DEFAULT_CONTENT,
    rate: rate,
  })

  return (
    <ProFormList
      {...commonProps}
      actionRender={(fieldData, action, dom) => {
        return [
          <Tooltip title={!microsoft_voice_name ? '请选择微软发音人' : '试听'} placement="top" key="play">
            <Button
              type="text"
              size="small"
              style={{ alignSelf: 'center' }}
              disabled={isLoading || !microsoft_voice_name}
              onClick={() => {
                const rowData = props.value?.[fieldData.key]
                const value = rowData?.guide
                if (!value) {
                  message.error('请输入试听内容')
                  return
                }
                togglePlay({
                  content: rowData.guide ?? '',
                  style: rowData.microsoft_voice_style!,
                  styledegree: rowData.styledegree?.toString(),
                })
              }}
            >
              {playing ? <PauseOutlined /> : <PlayCircleOutlined />}
            </Button>
          </Tooltip>,
          ...dom,
        ]
      }}
    >
      <Row gutter={[32, 0]}>
        <Col span={12}>
          <ProFormSelect
            name="microsoft_voice_style"
            options={
              VOICE_MAP[microsoft_voice_name]?.StyleList?.map(
                (item) => VOICE_STYLE.find((i) => i.value === item)!
              ).filter(Boolean) ?? VOICE_STYLE.slice(0, 1)
            }
            label="语气风格"
            placeholder="请选择风格"
          />
        </Col>
        <Col span={12}>
          <ProFormSlider name="styledegree" min={0.01} max={2} step={0.05} label="风格强度" />
        </Col>
        <Col span={24}>
          <ProFormTextArea
            labelCol={{ span: 12 }}
            labelAlign="right"
            name="guide"
            label="试听内容"
            placeholder="请输入试听内容"
          />
        </Col>
      </Row>
    </ProFormList>
  )
}

export const robotMetaList: PageCreateor['columns'] = [
  {
    name: 'robot_name',
    title: '角色名称',
    required: true,
    colProps: { xs: 8 },
  },
  {
    name: 'gender',
    title: '性别',
    required: true,
    colProps: { xs: 8 },
    valueEnum: GENDER,
  },
  {
    name: 'age',
    title: '年龄',
    required: true,
    colProps: { xs: 8 },
    valueType: 'digit',
    hideInSearch: true,
  },
  {
    name: 'microsoft_voice_name',
    title: '微软发音人',
    required: true,
    dependencies: ['gender', 'personal_blurb', 'rate'],
    colProps: { xs: 12 },
    hideInSearch: true,
    request: async (params) => {
      const values = microsoftVoicenames
        .filter((item) => item[1].includes(upperFirst(params.gender)))
        .map((item) => {
          return {
            label: item[1],
            value: item[0],
          }
        })
      return values
    },
    renderFormItem: (props, config, form) => <MicrosoftVoice config={config} form={form} props={props} />,
  },
  {
    name: 'rate',
    title: '默认语速',
    required: false,
    valueType: 'slider',
    hideInSearch: true,
    fieldProps: {
      min: 0,
      max: 5,
      step: 1,
      marks: {
        0: '很慢',
        1: '慢',
        2: '默认',
        3: '中等',
        4: '快',
        5: '快速',
      },
    },
    colProps: { xs: 4 },
  },
  {
    name: 'avatar',
    title: '头像',
    required: true,
    valueType: 'avatar',
    hideInSearch: true,
    renderFormItem: (props) => <IconUploader {...props} max={1} multiple={false} />,
  },
  {
    name: 'personal_blurb',
    title: '简介',
    copyable: true,
    valueType: 'textarea',
    hideInSearch: true,
  },
  {
    name: 'prompt',
    title: '提示词',
    copyable: true,
    valueType: 'textarea',
    hideInSearch: true,
  },
  {
    name: ['_count', 'tones'],
    title: '语气数量',
    hideInSearch: true,
  },

  {
    valueType: 'dependency',
    name: ['rate', 'microsoft_voice_name'],
    hideInTable: true,
    hideInSearch: true,
    columns: ({ rate }) => [
      {
        name: 'tones',
        title: '语气',
        hideInSearch: true,
        dependencies: ['microsoft_voice_name', 'rate'],
        tooltip: (
          <a
            target="_blank"
            href="https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-voice#use-speaking-styles-and-roles"
          >
            风格参考原文, 不支持的风格会自动忽略
          </a>
        ),
        renderFormItem: createProFormList(Tone),
      },
    ],
  },
]
