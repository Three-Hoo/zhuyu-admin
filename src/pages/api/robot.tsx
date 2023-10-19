import { prisma } from '@/utils/db'
import { Controller } from '@/core/controller'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { BadRequest, UnSupportMethodError } from '@/core/api_error'
import { paginator } from '@/utils/paginator'
import { convertionApiValue } from '@/core/create-page'
import { robotMetaList } from '@/sources/robot'
import { omit } from 'lodash'
import { tone } from '@prisma/client'

/**
 * 创建时间：2023/10/16
 * 作者：xinouyang
 * restful api for robot
 */
export default Controller(
  class Robot {
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
      return prisma.robot.findFirst({
        include: {
          tones: true,
        },
        where: { id: Number(request.query.id) },
      })
    }

    /**
     * Retrieves a list of robot types based on the specified category.
     *
     * @param {NextApiRequest} request - The request object.
     * @param {NextApiResponse} res - The response object.
     * @return  The list of robot.
     */
    async GET_LIST(request: NextApiRequest) {
      request.checkAuthorization()
      const { current, pageSize, ...query } = request.query

      const where = convertionApiValue(query, robotMetaList)

      return paginator(prisma.robot, prisma.robot.findMany, {
        include: {
          _count: {
            select: {
              tones: true,
            },
          },
        },
        where: omit(where, 'api'),
        current: Number(current) || 1,
        pageSize: Number(pageSize) || 20,
      })
    }

    /**
     * Creates a new robot type.
     *
     * @param {NextApiRequest} request - the HTTP request object
     * @return - a promise that resolves to the newly created robot
     */
    async POST(request: NextApiRequest) {
      request.checkAuthorization()
      const { ...other } = request.body
      return prisma.robot.create({
        data: {
          ...other,
          tones: {
            create: other.tones,
          },
        },
      })
    }

    /**
     * Updates an robot type based on the specified ID.
     *
     * @param {NextApiRequest} request - The HTTP request object.
     * @return  - A promise that resolves to the updated robot.
     */
    async PATCH(request: NextApiRequest) {
      request.checkAuthorization()
      const { ...other } = request.body
      return prisma.robot.update({
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

      const [robot] = await prisma.$transaction([
        prisma.robot.update({
          where: { id: Number(request.query.id) },
          data: omit(other, 'tones'),
        }),
        ...(other.tones?.map((item: tone) => {
          return item.id
            ? prisma.tone.update({ where: { id: item.id }, data: item })
            : prisma.tone.create({ data: { ...item, robot_id: Number(request.query.id) } })
        }) ?? []),
      ])

      return robot
    }

    /**
     * Delete function that handles HTTP DELETE requests.
     *
     * @param {NextApiRequest} request - The request object.
     * @return - A promise that resolves to the deleted robot type.
     */
    async DELETE(request: NextApiRequest) {
      request.checkAuthorization()
      return prisma.robot.delete({ where: { id: Number(request.query.id) } })
    }
  }
)
