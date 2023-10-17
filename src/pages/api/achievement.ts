import { prisma } from '@/utils/db'
import { Controller } from '@/core/controller'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { BadRequest, UnSupportMethodError } from '@/core/api_error'
import { paginator } from '@/utils/paginator'
import { convertionApiValue } from '@/core/create-page'
import { achievementMetaList } from '@/sources/achievement'

/**
 * 创建时间：2023/10/16
 * 作者：xinouyang
 * restful api for achievement
 */
export default Controller(
  class Achievement {
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
      return prisma.achievement.findFirst({ where: { id: Number(request.query.id) } })
    }

    /**
     * Retrieves a list of achievement types based on the specified category.
     *
     * @param {NextApiRequest} request - The request object.
     * @param {NextApiResponse} res - The response object.
     * @return  The list of achievement.
     */
    async GET_LIST(request: NextApiRequest) {
      request.checkAuthorization()
      const { current, pageSize, ...query } = request.query

      return paginator(prisma.achievement, prisma.achievement.findMany, {
        include: {
          achievement_type: true,
          _count: {
            select: {user_achievements: true}
          }
        },
        where: convertionApiValue(query, achievementMetaList),
        current: Number(current) || 1,
        pageSize: Number(pageSize) || 20,
      })
    }

    /**
     * Creates a new achievement type.
     *
     * @param {NextApiRequest} request - the HTTP request object
     * @return - a promise that resolves to the newly created achievement
     */
    async POST(request: NextApiRequest) {
      request.checkAuthorization()
      const { ...other } = request.body
      return prisma.achievement.create({
        data: other,
      })
    }

    /**
     * Updates an achievement type based on the specified ID.
     *
     * @param {NextApiRequest} request - The HTTP request object.
     * @return  - A promise that resolves to the updated achievement.
     */
    async PATCH(request: NextApiRequest) {
      request.checkAuthorization()
      const { ...other } = request.body
      return prisma.achievement.update({
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
      return prisma.achievement.update({
        where: { id: Number(request.query.id) },
        data: other,
      })
    }

    /**
     * Delete function that handles HTTP DELETE requests.
     *
     * @param {NextApiRequest} request - The request object.
     * @return - A promise that resolves to the deleted achievement type.
     */
    async DELETE(request: NextApiRequest) {
      request.checkAuthorization()
      const userAchievement = await prisma.user_achievement.findFirst({where: {achievement_id: Number(request.query.id)}})
      if (userAchievement) {
        throw new BadRequest(`该成就已经被用户使用不能删除`)
      }
      return prisma.achievement.delete({ where: { id: Number(request.query.id) } })
    }
  }
)
