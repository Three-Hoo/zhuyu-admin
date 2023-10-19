import { CommonUploader, CommonUploaderField, IconUploader } from '@/component/icon-uploader'
import { PageCreateor } from '@/core/create-page'
import { POST_CATEGORY } from './value-enum/post-category'
import {
  BetaSchemaForm,
  ProForm,
  ProFormDependency,
  ProFormList,
  ProFormSelect,
  ProFormTextArea,
  nanoid,
} from '@ant-design/pro-components'
import { Button, Col, Form, Input, Popconfirm, Row, Select, Space, Upload, message, notification } from 'antd'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import TextArea from 'antd/lib/input/TextArea'
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CheckCircleOutlined,
  CloudUploadOutlined,
  DragOutlined,
  UploadOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { post_paragraph } from '@prisma/client'
import { useMemoizedFn } from 'ahooks/lib'
import axios from 'axios'
import { getSTSAuthorization, uploadFile } from '@/utils/web-sts'
import { RcFile } from 'antd/lib/upload'
import { marked } from 'marked'
import { ProFormListParams, createProFormList, useProFormListCommonProps } from '@/utils/pro-form-list-common-props'
import { ProFromListCommonProps } from '@ant-design/pro-form/lib/components/List/ListItem'
import { ImportMarkdown } from '@/utils/parse-markdown'

const typeEnum = {
  text: '文本',
  audio: '音频',
  video: '视频',
  image: '图片',
  h2: '标题',
  h3: '副标题',
  h4: '小副标题',
}

const isMedia = <T extends string>(type: T) => {
  return ['audio', 'video', 'image'].includes(type as string)
}

const PostEditor = (props: {
  value?: post_paragraph[]
  onChange?: (value: Partial<post_paragraph>[]) => void
  params: ProFormListParams
}) => {
  const values = props.value ?? []
  const commonProps = useProFormListCommonProps({
    api: '',
    params: props.params,
    defaultRecord: {
      post_paragraph_type: 'text',
      content: '',
      content_cn: '',
    },
  })

  return (
    <div>
      <Space style={{ marginBottom: 24 }}>
        <ImportMarkdown
          onFinish={(markdowns) => {
            props.onChange?.([
              ...values,
              ...markdowns.map((item) => ({ post_paragraph_type: item.type, content: item.content, content_cn: '' })),
            ])
            return true
          }}
        />
        <Popconfirm
          title="确定要清空当前内容吗？清空后无法回退"
          disabled={!props.value?.length}
          onConfirm={async () => {
            await Promise.all(
              props.value?.map(async (item: post_paragraph) => {
                if (typeof item.id !== 'undefined') {
                  // @ts-ignore
                  await axios.delete(`/api/post-paragraph?id=${item.id}`)
                }
              }) ?? []
            )

            notification.info({ description: '删除成功', message: '' })
            props.onChange?.([])
          }}
        >
          <Button type="default" disabled={!props.value?.length}>
            清空当前内容
          </Button>
        </Popconfirm>
      </Space>
      <ProFormList
        {...commonProps}
        actionRender={(fieldData, action, dom) => {
          const rowData = values[fieldData.key]
          return [
            <Button
              size="small"
              key="move_up"
              type="primary"
              disabled={Boolean(rowData.content_cn) || isMedia(rowData.post_paragraph_type ?? '') || !rowData.content}
              onClick={async () => {
                const response = await axios.get('/api/translation', { params: { q: rowData.content } })
                const translation = response.data?.data?.translation?.[0]
                const speakUrl = response.data?.data?.speakUrl
                if (!translation || !speakUrl) {
                  message.error('翻译/发音失败')
                  return
                }

                const speakResponse = await axios.get(speakUrl, { responseType: 'blob' })
                const fileBlob = speakResponse.data
                Reflect.set(fileBlob, 'name', 'speak.mp3')
                const downloadedSpeakUrl = await uploadFile({ file: speakResponse.data, category: 'audio' })
                rowData.content_cn = translation
                rowData.speak_url = downloadedSpeakUrl

                props.onChange?.(values.slice())
              }}
            >
              翻译
            </Button>,
            ...dom,
            <Button
              size="small"
              key="move_up"
              type="text"
              disabled={fieldData.key === 0}
              onClick={() => {
                const currentIndex = fieldData.key
                const nextIndex = currentIndex - 1
                const temp = values[nextIndex]
                values[nextIndex] = rowData
                values[currentIndex] = temp

                props.onChange?.(values.slice())
              }}
            >
              <ArrowUpOutlined />
            </Button>,
            <Button
              size="small"
              key="move_up"
              type="text"
              disabled={fieldData.key === values.length - 1}
              onClick={() => {
                const currentIndex = fieldData.key
                const nextIndex = currentIndex + 1
                const temp = values[nextIndex]
                values[nextIndex] = rowData
                values[currentIndex] = temp

                props.onChange?.(values.slice())
              }}
            >
              <ArrowDownOutlined />
            </Button>,
          ]
        }}
      >
        <Row gutter={[32, 0]} style={{ width: '100%' }}>
          <Col span={4}>
            <ProFormSelect
              label="段落类型"
              name="post_paragraph_type"
              options={Object.entries(typeEnum).map((item) => ({ label: item[1], value: item[0] }))}
            />
          </Col>
          <Col span={20}>
            <ProFormDependency name={['post_paragraph_type']}>
              {({ post_paragraph_type }) => {
                if (['audio', 'video', 'image'].includes(post_paragraph_type as string)) {
                  return (
                    <ProForm.Item name="content" required label="媒体资源">
                      <CommonUploader name="content" category={post_paragraph_type} />
                    </ProForm.Item>
                  )
                }
                return (
                  <Row>
                    <ProFormTextArea required colProps={{ xs: 12 }} name="content" label="段落内容" key="content" />
                    <ProFormTextArea
                      required
                      colProps={{ xs: 12 }}
                      name="content_cn"
                      label="段落翻译"
                      key="content"
                      fieldProps={{ style: { borderStyle: 'dashed' } }}
                    />
                  </Row>
                )
              }}
            </ProFormDependency>
          </Col>
        </Row>
      </ProFormList>
    </div>
  )
}

export const postMetaList: PageCreateor['columns'] = [
  {
    title: '标题',
    name: 'title',
  },
  {
    title: '分类',
    name: 'category',
    valueEnum: POST_CATEGORY,
    colProps: { xs: 12 },
  },
  {
    title: '作者',
    name: 'author',
    hideInSearch: true,
    valueType: 'text',
    colProps: { xs: 12 },
  },
  {
    title: '封面',
    name: 'cover',
    hideInSearch: true,
    valueType: 'image',
    renderFormItem: (props) => <IconUploader {...props} max={1} multiple={false} />,
  },
  {
    title: '简介',
    name: 'intro',
    hideInSearch: true,
    valueType: 'textarea',
  },
  {
    title: '阅读所需时间（分钟）',
    name: 'duration',
    valueType: 'digit',
    colProps: { xs: 6 },
  },
  {
    title: '热度',
    name: 'heat',
    hideInSearch: true,
    valueType: 'digit',
    colProps: { xs: 6 },
  },
  {
    title: '阅读人数',
    name: 'read_count',
    hideInSearch: true,
    valueType: 'digit',
    colProps: { xs: 6 },
  },
  {
    title: '单词数量',
    name: 'word_count',
    hideInSearch: true,
    valueType: 'digit',
    colProps: { xs: 6 },
  },

  {
    title: '发布日期',
    name: 'deploy',
    valueType: 'date',
    hideInForm: true,
    hideInSearch: true,
    apiValue: (value) => value && new Date(value as string),
  },
  {
    title: '状态',
    name: 'status',
    hideInForm: true,
    valueEnum: {
      DRAFT: '草稿',
      DISABLED: '未发布',
      ENABLED: {
        text: '已发布',
        status: 'Success',
      },
    },
  },
  {
    title: '文章内容',
    name: 'paragraphs',
    hideInSearch: true,
    hideInTable: true,
    renderFormItem: createProFormList(PostEditor),
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <Popconfirm
        key="deploy"
        title={`${record.status === 'ENABLED' ? '取消' : '发布'}文章`}
        description={`你确定要${record.status === 'ENABLED' ? '下架' : '发布'}该竹简套餐吗？`}
        onConfirm={() =>
          axios
            .patch(`/api/post?id=${record.id}`, {
              status: record.status === 'ENABLED' ? 'DISABLED' : 'ENABLED',
              deploy: record.status === 'ENABLED' ? null : new Date(),
            })
            .then(() => action?.reload())
        }
        okText="Yes"
        cancelText="No"
      >
        <Button size="small">
          <CloudUploadOutlined /> {record.status === 'ENABLED' ? '下架' : '发布'}
        </Button>
      </Popconfirm>,
    ],
  },
]
