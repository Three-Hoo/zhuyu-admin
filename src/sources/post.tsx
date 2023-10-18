import { IconUploader } from '@/component/icon-uploader'
import { PageCreateor } from '@/core/create-page'
import { POST_CATEGORY } from './value-enum/post-category'
import { BetaSchemaForm, nanoid } from '@ant-design/pro-components'
import { Button, Col, Input, Popconfirm, Row, Select, Space, Upload, message, notification } from 'antd'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import TextArea from 'antd/lib/input/TextArea'
import {
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

const typeEnum = {
  text: '文本',
  audio: '音频',
  video: '视频',
  image: '图片',
  h2: '标题',
  h3: '副标题',
  h4: '小副标题',
}

const Paragraph = (props: {
  onDelete?: () => void
  onConfirm?: (value: post_paragraph) => void
  value?: post_paragraph
}) => {
  const value = (props.value ?? {}) as post_paragraph

  const handleChange = useMemoizedFn(
    (options: { content?: string; content_cn?: string; post_paragraph_type?: string; speak_url?: string }) => {
      props.onConfirm?.({
        ...props.value,
        content: 'content' in options ? options.content ?? '' : props.value?.content,
        content_cn: 'content_cn' in options ? options.content_cn ?? '' : props.value?.content_cn,
        post_paragraph_type:
          'post_paragraph_type' in options ? options.post_paragraph_type ?? '' : props.value?.post_paragraph_type,
        speak_url: 'speak_url' in options ? options.speak_url ?? '' : props.value?.speak_url,
      } as post_paragraph)
    }
  )

  const isSource = ['audio', 'video', 'image'].includes(value.post_paragraph_type as string)
  const validate = () => {
    if (!value.content?.trim()) {
      return false
    }
    if (!isSource && !value.content_cn?.trim()) {
      return false
    }
    return true
  }

  return (
    <Row gutter={[16, 4]}>
      <Col span={18}>
        <Row gutter={[16, 4]}>
          <Col span={2}>{typeEnum[value.post_paragraph_type as keyof typeof typeEnum] ?? typeEnum.text}</Col>
          <Col span={22}>
            {isSource ? (
              <Upload
                {...{
                  customRequest: async (options) => {
                    const url = await uploadFile({
                      file: options.file as RcFile,
                      category: value.post_paragraph_type as string,
                      onProgress: options.onProgress,
                    })
                    options.onSuccess?.({ file: url })
                    handleChange({ content: url })
                  },
                  maxCount: 1,
                  multiple: false,
                  listType: value.post_paragraph_type === 'image' ? 'picture' : 'text',
                  defaultFileList: [{ url: value?.content ?? '', uid: nanoid(), name: value?.content ?? nanoid() }],
                  onRemove(file) {
                    handleChange({ content: '' })
                  },
                  accept:
                    value.post_paragraph_type === 'image'
                      ? 'image/*'
                      : value.post_paragraph_type === 'audio'
                      ? 'audio/*'
                      : 'video/*',
                  onChange(info) {
                    if (info.file.status !== 'uploading') {
                      console.log(info.file, info.fileList)
                    }
                    if (info.file.status === 'done') {
                      message.success(`${info.file.name} file uploaded successfully`)
                    } else if (info.file.status === 'error') {
                      message.error(`${info.file.name} file upload failed.`)
                    }
                    console.log('info', info)
                  },
                }}
              >
                <Button icon={<UploadOutlined />}>上传资源</Button>
              </Upload>
            ) : (
              <TextArea value={value?.content ?? ''} onChange={(e) => handleChange({ content: e.target.value })} />
            )}
          </Col>
          {isSource ? null : (
            <>
              <Col span={2}>
                <span style={{ color: '#bbb' }}>翻译</span>
              </Col>
              <Col span={22}>
                <TextArea
                  style={{ borderStyle: 'dashed' }}
                  value={value?.content_cn ?? ''}
                  onChange={(e) => handleChange({ content_cn: e.target.value })}
                />
              </Col>
            </>
          )}
        </Row>
      </Col>
      <Col span={6}>
        <div style={{ marginBottom: 8 }}>
          <Space>
            <Button
              size="small"
              type="primary"
              ghost
              disabled={!props.value?.content || Boolean(props.value?.content_cn) || isSource}
              onClick={async () => {
                const response = await axios.get('/api/translation', { params: { q: value.content } })
                const translation = response.data?.data?.translation?.[0]
                const speakUrl = response.data?.data?.speakUrl
                if (!translation || !speakUrl) {
                  notification.error({
                    message: '翻译/发音失败',
                    description: `未找到${!translation ? '翻译' : '发音'}结果`,
                  })
                  return
                }

                const speakResponse = await axios.get(speakUrl, { responseType: 'blob' })
                const fileBlob = speakResponse.data
                Reflect.set(fileBlob, 'name', 'speak.mp3')
                const downloadedSpeakUrl = await uploadFile({ file: speakResponse.data, category: 'audio' })

                handleChange({
                  speak_url: downloadedSpeakUrl,
                  content_cn: translation,
                })
              }}
            >
              翻译/发音生成
            </Button>
            <Popconfirm title="确定要删除该段落吗？" onConfirm={props.onDelete}>
              <Button size="small" danger>
                删除
              </Button>
            </Popconfirm>
            {validate() ? (
              <CheckCircleOutlined style={{ color: 'green' }} />
            ) : (
              <WarningOutlined style={{ color: 'red', fontWeight: 'bold', fontSize: 16 }} />
            )}
            <DragOutlined />
          </Space>
        </div>
        <Space.Compact block>
          <Select
            defaultValue="text"
            onChange={(value) => handleChange({ post_paragraph_type: value })}
            value={props.value?.post_paragraph_type ?? 'text'}
          >
            {Object.entries(typeEnum).map((item) => (
              <Select.Option key={item[0]} value={item[0]}>
                {item[1]}
              </Select.Option>
            ))}
          </Select>
        </Space.Compact>
        {value.speak_url ? <audio controls src={value.speak_url} /> : null}
      </Col>
    </Row>
  )
}

const PostEditor = (props: { onChange?: any; value?: any }) => {
  return (
    <div>
      <Space>
        <Button
          type="primary"
          onClick={() => {
            const newParagraph = {
              client_id: nanoid(),
              sort: (props.value?.length ?? 0) + 1,
              post_paragraph_type: 'text',
              content: '',
              content_cn: '',
            }

            props.onChange?.([...(props.value ?? []), newParagraph].filter(Boolean))
          }}
        >
          添加段落
        </Button>
        <BetaSchemaForm
          title="markdown 内容"
          columns={[{ name: 'content', valueType: 'textarea', formItemProps: { rules: [{ required: true }] } }]}
          layoutType="ModalForm"
          trigger={
            <Button type="primary" ghost>
              导入 Markdown 内容
            </Button>
          }
          onFinish={async (values: { content: string }) => {
            const contents = values.content.split(/\n/).map((item, index) => {
              const content = item.trim()
              if (content.startsWith('####')) {
                return {
                  client_id: nanoid(),
                  post_paragraph_type: 'h4',
                  content: content.slice(4),
                  content_cn: '',
                  sort: index + 1,
                }
              }
              if (content.startsWith('###')) {
                return {
                  client_id: nanoid(),
                  post_paragraph_type: 'h3',
                  content: content.slice(3),
                  content_cn: '',
                  sort: index + 1,
                }
              }
              if (content.startsWith('#')) {
                return {
                  client_id: nanoid(),
                  post_paragraph_type: 'h2',
                  content: content.slice(content.match(/^#+(.*?)$/)?.[1].length),
                  content_cn: '',
                  sort: index + 1,
                }
              }
              if (/!\[.*?\]\((.*?)\)/.test(content)) {
                return {
                  client_id: nanoid(),
                  post_paragraph_type: 'image',
                  content: content.match(/!\[.*?\]\((.*?)\)/)?.[1],
                  content_cn: '',
                  sort: index + 1,
                }
              }
              return {
                client_id: nanoid(),
                post_paragraph_type: 'text',
                content: content,
                content_cn: '',
                sort: index + 1,
              }
            })

            props.onChange([...(props.value ?? []), ...contents])
            return true
          }}
        />
        <Popconfirm
          title="确定要清空当前内容吗？"
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
      <div style={{ marginTop: 16, maxHeight: '50vh', overflow: 'auto' }}>
        <DragDropContext
          onDragEnd={(operation) => {
            if (
              operation.source.index === operation.destination?.index ||
              typeof operation.destination?.index === 'undefined'
            ) {
              return
            }

            const tmp = props.value[operation.source.index]
            props.value[operation.source.index] = props.value[operation.destination.index]
            props.value[operation.destination.index] = tmp

            props.onChange?.([...props.value].map((item, index) => ({ ...item, sort: index + 1 })))
          }}
        >
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ opacity: snapshot.isDraggingOver ? 0.5 : 1 }}
              >
                {props.value?.map((item: post_paragraph & { client_id: string }, index: number) => (
                  <Draggable key={item.client_id} draggableId={item.client_id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{ ...provided.draggableProps.style, marginBottom: 16 }}
                      >
                        <Paragraph
                          value={item}
                          onConfirm={(newValue) => {
                            props.onChange?.(
                              props.value?.map((currentItem: post_paragraph & { client_id: string }) => {
                                if (currentItem.client_id === item.client_id) {
                                  return { ...currentItem, ...newValue }
                                }
                                return currentItem
                              })
                            )
                          }}
                          onDelete={async () => {
                            if (item.id) {
                              await axios.delete(`/api/post-paragraph?id=${item.id}`)
                            }

                            props.onChange?.(
                              props.value?.filter((currentItem: post_paragraph & { client_id: string }) => {
                                if (currentItem.client_id === item.client_id) {
                                  return false
                                }
                                return true
                              })
                            )
                          }}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
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
    title: '阅读所需时间',
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
    renderFormItem: (props, config, form) => {
      return <PostEditor />
    },
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
