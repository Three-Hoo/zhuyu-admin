import { prisma } from '@/utils/db'
import { Controller } from '@/core/controller'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { BadRequest, UnSupportMethodError } from '@/core/api_error'
import { paginator } from '@/utils/paginator'
import { convertionApiValue } from '@/core/create-page'
import { scenesContextMetaList } from '@/sources/scenes-context'
import { omit } from 'lodash'
import { prompt_template_content, scene_context_guide, scene_context_reminder } from '@prisma/client'

/**
 * 创建时间：2023/10/16
 * 作者：xinouyang
 * restful api for scenes_context
 */
export default Controller(
  class ScenesContext {
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
      const scenes_context = await prisma.scenes_context.findFirst({
        include: {
          scene_context_reminders: true,
          scene_context_guides: true,
          prompt_template: {
            include: {
              prompt_template_contents: true,
            },
          },
        },
        where: {
          id: Number(request.query.id),
        },
      })

      return scenes_context
    }

    /**
     * Retrieves a list of scenes_context types based on the specified category.
     *
     * @param {NextApiRequest} request - The request object.
     * @param {NextApiResponse} res - The response object.
     * @return  The list of scenes_context.
     */
    async GET_LIST(request: NextApiRequest) {
      request.checkAuthorization()
      const { current, pageSize, ...query } = request.query

      return paginator(prisma.scenes_context, prisma.scenes_context.findMany, {
        include: {
          scene: true,
          prompt_template: true,
        },
        where: convertionApiValue(query, scenesContextMetaList),
        orderBy: { created_time: 'desc' },
        current: Number(current) || 1,
        pageSize: Number(pageSize) || 20,
      })
    }

    /**
     * Creates a new scenes_context type.
     *
     * @param {NextApiRequest} request - the HTTP request object
     * @return - a promise that resolves to the newly created scenes_context
     */
    async POST(request: NextApiRequest) {
      request.checkAuthorization()
      const { ...other } = request.body

      const response = await prisma.scenes_context.create({
        data: {
          scenes_id: other.scenes_id,
          scenes_context_description: other.scenes_context_description,
          scenes_context_description_cn: other.scenes_context_description_cn,
          short_scenes_context_description: other.short_scenes_context_description,
          prompt_template_id: other.prompt_template_id,
          scene_context_reminders: { create: other.scene_context_reminders ?? [] },
          scene_context_guides: { create: other.scene_context_guides ?? [] },
        },
      })

      return response
    }

    /**
     * Updates an scenes_context type based on the specified ID.
     *
     * @param {NextApiRequest} request - The HTTP request object.
     * @return  - A promise that resolves to the updated scenes_context.
     */
    async PATCH(request: NextApiRequest) {
      request.checkAuthorization()
      const { ...other } = request.body
      return prisma.scenes_context.update({
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

      const [scenes_context] = await prisma.$transaction([
        prisma.scenes_context.update({
          where: { id: Number(request.query.id) },
          data: omit(other, 'scene_context_reminders', 'scene_context_guides', 'scene_context_prompts'),
        }),
        ...(other.scene_context_reminders?.map((item: scene_context_reminder) => {
          return item.id
            ? prisma.scene_context_reminder.update({ where: { id: item.id }, data: item })
            : prisma.scene_context_reminder.create({ data: { ...item, scenes_context_id: Number(request.query.id) } })
        }) ?? []),
        ...(other.scene_context_guides?.map((item: scene_context_guide) => {
          return item.id
            ? prisma.scene_context_guide.update({ where: { id: item.id }, data: item })
            : prisma.scene_context_guide.create({ data: { ...item, scene_context_id: Number(request.query.id) } })
        }) ?? []),
        // ...(other.scene_context_prompts?.map((item: scene_context_prompt) => {
        //   return item.id
        //     ? prisma.scene_context_prompt.update({ where: { id: item.id }, data: item })
        //     : prisma.scene_context_prompt.create({ data: { ...item, scene_context_id: Number(request.query.id) } })
        // }) ?? []),
      ])

      return scenes_context
    }

    /**
     * Delete function that handles HTTP DELETE requests.
     *
     * @param {NextApiRequest} request - The request object.
     * @return - A promise that resolves to the deleted scenes_context type.
     */
    async DELETE(request: NextApiRequest) {
      request.checkAuthorization()
      await prisma.scenes_context.update({
        where: { id: Number(request.query.id) },
        data: {
          scene_context_reminders: { deleteMany: {} },
          scene_context_guides: { deleteMany: {} },
          // scene_context_prompts: { deleteMany: {} },
        },
      })

      return prisma.scenes_context.delete({ where: { id: Number(request.query.id) } })
    }
  }
)
