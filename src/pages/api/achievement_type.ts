import { prisma } from '@/utils/db'
import { Controller } from '@/core/controller'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { achievement_type } from '@prisma/client'
import { BadRequest, UnSupportMethodError } from '@/core/api_error'

/**
 * 创建时间：2022-10-19
 * 作者：zhuYu
 * restful api for achievement_type
 */
export default Controller(
  class AchievementType {
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
      return prisma.achievement_type.findFirst({ where: { id: Number(request.query.id) } })
    }

    /**
     * Retrieves a list of achievement types based on the specified category.
     *
     * @param {NextApiRequest} request - The request object.
     * @param {NextApiResponse} res - The response object.
     * @return  The list of achievement types.
     */

    async GET_LIST(request: NextApiRequest, res: NextApiResponse) {
      request.checkAuthorization()
      const data: achievement_type[] = await prisma.achievement_type.findMany({
        where: { category: request.query.category as string },
      })
      return data
    }

    /**
     * Creates a new achievement type.
     *
     * @param {NextApiRequest} request - the HTTP request object
     * @return - a promise that resolves to the newly created achievement type
     */
    async POST(request: NextApiRequest) {
      request.checkAuthorization()
      const { name, category } = request.body
      if (!name || !category) {
        throw new BadRequest(`参数错误, name: ${name}, category: ${category}`)
      }
      return prisma.achievement_type.create({
        data: { name, category },
      })
    }

    /**
     * Updates an achievement type based on the specified ID.
     *
     * @param {NextApiRequest} request - The HTTP request object.
     * @return  - A promise that resolves to the updated achievement type.
     */
    async PATCH(request: NextApiRequest) {
      request.checkAuthorization()
      const { name } = request.body
      if (!name) {
        throw new BadRequest(`参数错误, name: ${name}`)
      }
      return prisma.achievement_type.update({
        where: { id: Number(request.query.id) },
        data: { name },
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
      throw new UnSupportMethodError()
    }

    /**
     * Delete function that handles HTTP DELETE requests.
     *
     * @param {NextApiRequest} request - The request object.
     * @return - A promise that resolves to the deleted achievement type.
     */
    async DELETE(request: NextApiRequest) {
      request.checkAuthorization()
      const achievement = await prisma.achievement.findFirst({ where: { type_id: request.body.id } })
      if (achievement) {
        throw new BadRequest(`该分类存在成就不能删除`)
      }

      return prisma.achievement_type.delete({ where: { id: request.body.id } })
    }
  }
)
