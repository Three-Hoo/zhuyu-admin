import { prisma } from '@/utils/db'
import { Controller } from '@/core/controller'
import { NextApiRequest } from 'next/dist/shared/lib/utils'

/**
 * 创建时间：2023/10/16
 * 作者：xinouyang
 * restful api for scene_context_prompt
 */
export default Controller(
  class SceneContextPrompt {
    /**
     * Delete function that handles HTTP DELETE requests.
     *
     * @param {NextApiRequest} request - The request object.
     * @return - A promise that resolves to the deleted scene_context_prompt type.
     */
    async DELETE(request: NextApiRequest) {
      request.checkAuthorization()
      return prisma.prompt_template_content.delete({ where: { id: Number(request.query.id) } })
    }
  }
)
