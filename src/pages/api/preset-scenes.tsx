import { prisma } from '@/utils/db'
import { Controller } from '@/core/controller'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { BadRequest, UnSupportMethodError } from '@/core/api_error'
import { paginator } from '@/utils/paginator'
import { convertionApiValue } from '@/core/create-page'
import { presetScenesMetaList } from '@/sources/preset-scenes'
import { omit } from 'lodash'

/**
 * 创建时间：2023/10/16
 * 作者：xinouyang
 * restful api for preset_scenes
 */
export default Controller(
  class PresetScenes {
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
      return prisma.preset_scenes.findFirst({ where: { id: Number(request.query.id) } })
    }

    /**
     * Retrieves a list of preset_scenes types based on the specified category.
     *
     * @param {NextApiRequest} request - The request object.
     * @param {NextApiResponse} res - The response object.
     * @return  The list of preset_scenes.
     */
    async GET_LIST(request: NextApiRequest) {
      request.checkAuthorization()
      const { current, pageSize, ...query } = request.query

      return paginator(prisma.preset_scenes, prisma.preset_scenes.findMany, {
        include: {},
        where: convertionApiValue(query, presetScenesMetaList),
        current: Number(current) || 1,
        pageSize: Number(pageSize) || 20,
      })
    }

    /**
     * Creates a new preset_scenes type.
     *
     * @param {NextApiRequest} request - the HTTP request object
     * @return - a promise that resolves to the newly created preset_scenes
     */
    async POST(request: NextApiRequest) {
      request.checkAuthorization()
      const { ...other } = request.body
      return prisma.preset_scenes.create({
        data: other,
      })
    }

    /**
     * Updates an preset_scenes type based on the specified ID.
     *
     * @param {NextApiRequest} request - The HTTP request object.
     * @return  - A promise that resolves to the updated preset_scenes.
     */
    async PATCH(request: NextApiRequest) {
      request.checkAuthorization()
      const { ...other } = request.body
      return prisma.preset_scenes.update({
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

      const [preset_scenes] = await prisma.$transaction([
        prisma.preset_scenes.update({
          where: { id: Number(request.query.id) },
          data: omit(
            other
            // '#child#'
          ),
        }),
        // ...(other.#child#s?.map((item: #child#) => {
        //   return item.id
        //     ? prisma.#child#.update({ where: { id: item.id }, data: item })
        //     : prisma.#child#.create({ data: { ...item, robot_id: Number(request.query.id) } })
        // }) ?? []),
      ])

      return preset_scenes
    }

    /**
     * Delete function that handles HTTP DELETE requests.
     *
     * @param {NextApiRequest} request - The request object.
     * @return - A promise that resolves to the deleted preset_scenes type.
     */
    async DELETE(request: NextApiRequest) {
      request.checkAuthorization()

      // await prisma.preset_scenes.update({
      //   where: { id: Number(request.query.id) },
      //   data: { #child#: { deleteMany: {} } },
      // })

      return prisma.preset_scenes.delete({ where: { id: Number(request.query.id) } })
    }
  }
)
