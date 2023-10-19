import { prisma } from '@/utils/db'
import { Controller } from '@/core/controller'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { BadRequest, UnSupportMethodError } from '@/core/api_error'
import { paginator } from '@/utils/paginator'
import { convertionApiValue } from '@/core/create-page'
import { merge, omit } from 'lodash'
import { channelMetaList } from '@/sources/channel'

/**
 * 创建时间：2023/10/16
 * 作者：xinouyang
 * restful api for channel
 */
export default Controller(
  class Channel {
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
      return prisma.channel.findFirst({ where: { id: Number(request.query.id) } })
    }

    /**
     * Retrieves a list of channel types based on the specified category.
     *
     * @param {NextApiRequest} request - The request object.
     * @param {NextApiResponse} res - The response object.
     * @return  The list of channel.
     */
    async GET_LIST(request: NextApiRequest) {
      request.checkAuthorization()
      const { current, pageSize, ...query } = request.query

      return paginator(prisma.channel, prisma.channel.findMany, {
        include: {
          robot: {
            select: {
              robot_name: true,
            },
          },
          scene: {
            select: {
              scenes_name: true,
            },
          },
          scene_context: {
            select: {
              short_scenes_context_description: true,
            },
          },
        },
        where: convertionApiValue(query, channelMetaList),
        current: Number(current) || 1,
        pageSize: Number(pageSize) || 20,
      })
    }

    /**
     * Creates a new channel type.
     *
     * @param {NextApiRequest} request - the HTTP request object
     * @return - a promise that resolves to the newly created channel
     */
    async POST(request: NextApiRequest) {
      request.checkAuthorization()
      const { ...other } = request.body
      return prisma.channel.create({
        data: other,
      })
    }

    /**
     * Updates an channel type based on the specified ID.
     *
     * @param {NextApiRequest} request - The HTTP request object.
     * @return  - A promise that resolves to the updated channel.
     */
    async PATCH(request: NextApiRequest) {
      request.checkAuthorization()
      const { ...other } = request.body
      return prisma.channel.update({
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

      const [channel] = await prisma.$transaction([
        prisma.channel.update({
          where: { id: Number(request.query.id) },
          data: merge(
            omit(
              other
              // '#child#'
            ),
            { updated_time: new Date() }
          ),
        }),
        // ...(other.#child#s?.map((item: #child#) => {
        //   return item.id
        //     ? prisma.#child#.update({ where: { id: item.id }, data: item })
        //     : prisma.#child#.create({ data: { ...item, robot_id: Number(request.query.id) } })
        // }) ?? []),
      ])

      return channel
    }

    /**
     * Delete function that handles HTTP DELETE requests.
     *
     * @param {NextApiRequest} request - The request object.
     * @return - A promise that resolves to the deleted channel type.
     */
    async DELETE(request: NextApiRequest) {
      request.checkAuthorization()

      // await prisma.channel.update({
      //   where: { id: Number(request.query.id) },
      //   data: { #child#: { deleteMany: {} } },
      // })

      return prisma.channel.delete({ where: { id: Number(request.query.id) } })
    }
  }
)
