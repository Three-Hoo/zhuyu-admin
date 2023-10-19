import { IconUploader } from '@/component/icon-uploader'
import { PageCreateor } from '@/core/create-page'

export const scenesMetaList: PageCreateor['columns'] = [
  { title: '场景类型名称', dataIndex: 'scenes_name', formItemProps: { required: true } },
  {
    title: '场景类型图片',
    formItemProps: { required: true },
    width: 'md',
    name: 'icon',
    dataIndex: 'icon',
    colProps: { xs: 12 },
    valueType: 'image',
    hideInSearch: true,
    renderFormItem: (props) => <IconUploader {...props} max={1} multiple={false} />,
  },
  { title: '排序', dataIndex: 'sort', valueType: 'digit', hideInSearch: true },
]
