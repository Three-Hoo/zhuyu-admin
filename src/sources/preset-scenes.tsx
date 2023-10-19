import { PageCreateor } from '@/core/create-page'
import { robot, scenes, scenes_context, tone } from '@prisma/client'
import axios from 'axios'
import { VOICE_STYLE_MAP } from './value-enum/voice-style'
import { IconUploader } from '@/component/icon-uploader'

export const presetScenesMetaList: PageCreateor['columns'] = [
  {
    title: '描述',
    name: 'preset_scenes_description',
    required: true,
    valueType: 'textarea',
    copyable: true,
  },
  {
    title: '图片',
    name: 'preset_scenes_image',
    required: true,
    hideInSearch: true,
    valueType: 'image',
    renderFormItem: (props) => <IconUploader {...props} max={1} multiple={false} />,
    colProps: { xs: 6 },
  },
  {
    title: '默认语速',
    name: 'speed',
    required: true,
    valueType: 'slider',
    hideInSearch: true,
    colProps: { xs: 12 },
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
  },
  {
    title: '回复复杂性',
    name: 'complexity',
    required: true,
    valueEnum: { LOW: '低', HIGH: '高' },
    colProps: { xs: 24 },
  },
  {
    title: 'AI 角色',
    name: 'robot_id',
    required: true,
    colProps: { xs: 12 },
    request: async () => {
      return axios.get('/api/robot?current=0&pageSize=100').then((res) =>
        res.data.data.data.map((item: robot) => ({
          label: item.robot_name,
          value: item.id,
        }))
      )
    },
  },
  {
    title: '语气',
    name: 'tone_id',
    dependencies: ['robot_id'],
    required: true,
    hideInSearch: true,
    colProps: { xs: 12 },
    request: async ({ robot_id }) => {
      return axios.get(`/api/tone?current=0&pageSize=30&robot_id=${robot_id}`).then((res) =>
        res.data.data.data.map((item: tone) => ({
          label: VOICE_STYLE_MAP[item.microsoft_voice_style as string],
          value: item.id,
        }))
      )
    },
  },
  {
    title: '场景',
    name: 'scene_id',
    required: true,
    colProps: { xs: 12 },
    request: async () => {
      return axios.get(`/api/scenes?current=0&pageSize=100`).then((res) =>
        res.data.data.data.map((item: scenes) => ({
          label: item.scenes_name,
          value: item.id,
        }))
      )
    },
  },
  {
    title: '场景上下文',
    name: 'scene_context_id',
    required: true,
    hideInSearch: true,
    colProps: { xs: 12 },
    dependencies: ['scene_id'],
    request: async ({ scene_id }) => {
      return axios.get(`/api/scenes-context?current=0&pageSize=100&scenes_id=${scene_id}`).then((res) =>
        res.data.data.data.map((item: scenes_context) => ({
          label: item.short_scenes_context_description,
          value: item.id,
        }))
      )
    },
  },
]
