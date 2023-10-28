import { createPage } from '@/core/create-page'
import { promptTemplateMetaList } from '@/sources/prompt-template'
import { prompt_template_content } from '@prisma/client'
import { Modal } from 'antd'

export default createPage({
  api: '/api/prompt-template',
  title: 'prompt 模板',
  columns: promptTemplateMetaList,
  async interceptor(values) {
    let table = ['user', 'assistant']
    const prompt_template_contents = values.prompt_template_contents as prompt_template_content[]
    for (let index = 0; index < prompt_template_contents.length; index++) {
      const element = prompt_template_contents[index]
      if (table[index % 2] !== element.role) {
        Modal.error({
          title: '错误',
          content: `角色不匹配, 角色必须以用户开始，并且交替设置，第${index + 1}个角色为${element.role}应该修改为${
            table[index % 2]
          }`,
        })
        throw new Error('角色不匹配')
      }
    }

    if (prompt_template_contents.length % 2 !== 1 && values.prompt_template_type === 'CHAT') {
      Modal.error({
        title: '错误',
        content: `角色不匹配, 角色必须以用户开始, 以用户结束`,
      })
      throw new Error('角色不匹配')
    }
  },
})
