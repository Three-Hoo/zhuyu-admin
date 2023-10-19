import { prisma } from '@/utils/db'
import { Controller } from '@/core/controller'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { BadRequest, UnSupportMethodError } from '@/core/api_error'
import { paginator } from '@/utils/paginator'
import { convertionApiValue } from '@/core/create-page'
import { scenesMetaList } from '@/sources/scenes'

/**
 * 创建时间：2023/10/16
 * 作者：xinouyang
 * restful api for scenes
 */
export default Controller(
  class Scenes {
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
      return prisma.scenes.findFirst({ where: { id: Number(request.query.id) } })
    }

    /**
     * Retrieves a list of scenes types based on the specified category.
     *
     * @param {NextApiRequest} request - The request object.
     * @param {NextApiResponse} res - The response object.
     * @return  The list of scenes.
     */
    async GET_LIST(request: NextApiRequest) {
      request.checkAuthorization()
      const { current, pageSize, ...query } = request.query

      return paginator(prisma.scenes, prisma.scenes.findMany, {
        include: {},
        where: convertionApiValue(query, scenesMetaList),
        current: Number(current) || 1,
        pageSize: Number(pageSize) || 20,
      })
    }

    /**
     * Creates a new scenes type.
     *
     * @param {NextApiRequest} request - the HTTP request object
     * @return - a promise that resolves to the newly created scenes
     */
    async POST(request: NextApiRequest) {
      request.checkAuthorization()
      const { ...other } = request.body
      return prisma.scenes.create({
        data: other,
      })
    }

    /**
     * Updates an scenes type based on the specified ID.
     *
     * @param {NextApiRequest} request - The HTTP request object.
     * @return  - A promise that resolves to the updated scenes.
     */
    async PATCH(request: NextApiRequest) {
      request.checkAuthorization()
      const { ...other } = request.body
      return prisma.scenes.update({
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
      return prisma.scenes.update({
        where: { id: Number(request.query.id) },
        data: other,
      })
    }

    /**
     * Delete function that handles HTTP DELETE requests.
     *
     * @param {NextApiRequest} request - The request object.
     * @return - A promise that resolves to the deleted scenes type.
     */
    async DELETE(request: NextApiRequest) {
      request.checkAuthorization()
      return prisma.scenes.delete({ where: { id: Number(request.query.id) } })
    }
  }
)
