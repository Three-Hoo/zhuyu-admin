import { prisma } from '@/utils/db'
import { Controller } from '@/core/controller'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { BadRequest } from '@/core/api_error'
import { paginator } from '@/utils/paginator'
import { convertionApiValue } from '@/core/create-page'
import { omit } from 'lodash'
import { messageMetaList } from '@/sources/message'

/**
 * 创建时间：2023/10/16
 * 作者：xinouyang
 * restful api for message
 */
export default Controller(
  class Message {
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
      return prisma.message.findFirst({ where: { id: Number(request.query.id) } })
    }

    /**
     * Retrieves a list of message types based on the specified category.
     *
     * @param {NextApiRequest} request - The request object.
     * @param {NextApiResponse} res - The response object.
     * @return  The list of message.
     */
    async GET_LIST(request: NextApiRequest) {
      request.checkAuthorization()
      const { current, pageSize, ...query } = request.query

      return paginator(prisma.message, prisma.message.findMany, {
        include: {
          channel: { select: { channel_name: true } },
        },
        where: convertionApiValue(query, messageMetaList),
        current: Number(current) || 1,
        pageSize: Number(pageSize) || 20,
      })
    }

    /**
     * Creates a new message type.
     *
     * @param {NextApiRequest} request - the HTTP request object
     * @return - a promise that resolves to the newly created message
     */
    async POST(request: NextApiRequest) {
      request.checkAuthorization()
      const { ...other } = request.body
      return prisma.message.create({
        data: convertionApiValue(other, messageMetaList) as any,
      })
    }

    /**
     * Updates an message type based on the specified ID.
     *
     * @param {NextApiRequest} request - The HTTP request object.
     * @return  - A promise that resolves to the updated message.
     */
    async PATCH(request: NextApiRequest) {
      request.checkAuthorization()
      const { ...other } = request.body
      return prisma.message.update({
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

      const [message] = await prisma.$transaction([
        prisma.message.update({
          where: { id: Number(request.query.id) },
          data: omit(
            convertionApiValue(other, messageMetaList) as any
            // '#child#'
          ),
        }),
        // ...(other.#child#s?.map((item: #child#) => {
        //   return item.id
        //     ? prisma.#child#.update({ where: { id: item.id }, data: item })
        //     : prisma.#child#.create({ data: { ...item, robot_id: Number(request.query.id) } })
        // }) ?? []),
      ])

      return message
    }

    /**
     * Delete function that handles HTTP DELETE requests.
     *
     * @param {NextApiRequest} request - The request object.
     * @return - A promise that resolves to the deleted message type.
     */
    async DELETE(request: NextApiRequest) {
      request.checkAuthorization()

      // await prisma.message.update({
      //   where: { id: Number(request.query.id) },
      //   data: { #child#: { deleteMany: {} } },
      // })

      return prisma.message.delete({ where: { id: Number(request.query.id) } })
    }
  }
)
