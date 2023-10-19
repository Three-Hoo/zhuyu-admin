import { prisma } from '@/utils/db'
import { Controller } from '@/core/controller'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { BadRequest, UnSupportMethodError } from '@/core/api_error'
import { paginator } from '@/utils/paginator'
import { convertionApiValue } from '@/core/create-page'
import { sceneContextReminderMetaList } from '@/sources/scene-context-reminder'

/**
 * 创建时间：2023/10/16
 * 作者：xinouyang
 * restful api for scene_context_reminder
 */
export default Controller(
  class SceneContextReminder {
    /**
     * Executes a GET request.
     *
     * @param {NextApiRequest} request - The request object.
     */
    async GET(request: NextApiRequest) {
      request.checkAuthorization()
      if (!Number(request.query.id)) {
        throw new BadRequest('参数错误')
      }
      return prisma.scene_context_reminder.findFirst({ where: { id: Number(request.query.id) } })
    }

    /**
     * Retrieves a list of scene_context_reminder types based on the specified category.
     *
     * @param {NextApiRequest} request - The request object.
     * @param {NextApiResponse} res - The response object.
     * @return  The list of scene_context_reminder.
     */
    async GET_LIST(request: NextApiRequest) {
      request.checkAuthorization()
      const { current, pageSize, ...query } = request.query

      return paginator(prisma.scene_context_reminder, prisma.scene_context_reminder.findMany, {
        include: {},
        where: convertionApiValue(query, sceneContextReminderMetaList),
        current: Number(current) || 1,
        pageSize: Number(pageSize) || 20,
      })
    }

    /**
     * Creates a new scene_context_reminder type.
     *
     * @param {NextApiRequest} request - the HTTP request object
     * @return - a promise that resolves to the newly created scene_context_reminder
     */
    async POST(request: NextApiRequest) {
      request.checkAuthorization()
      const { ...other } = request.body
      return prisma.scene_context_reminder.create({
        data: other,
      })
    }

    /**
     * Updates an scene_context_reminder type based on the specified ID.
     *
     * @param {NextApiRequest} request - The HTTP request object.
     * @return  - A promise that resolves to the updated scene_context_reminder.
     */
    async PATCH(request: NextApiRequest) {
      request.checkAuthorization()
      const { ...other } = request.body
      return prisma.scene_context_reminder.update({
        where: { id: Number(request.query.id) },
        data: other,
      })
    }

    /**
     * Handles a PUT request.
     *
     * @param {NextApiRequest} request - The request object.
     * @return - A promise that resolves when the request is handled.
     */
    async PUT(request: NextApiRequest) {
      request.checkAuthorization()
      const { ...other } = request.body
      return prisma.scene_context_reminder.update({
        where: { id: Number(request.query.id) },
        data: other,
      })
    }

    /**
     * Delete function that handles HTTP DELETE requests.
     *
     * @param {NextApiRequest} request - The request object.
     * @return - A promise that resolves to the deleted scene_context_reminder type.
     */
    async DELETE(request: NextApiRequest) {
      request.checkAuthorization()
      return prisma.scene_context_reminder.delete({ where: { id: Number(request.query.id) } })
    }
  }
)
