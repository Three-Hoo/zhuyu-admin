import { prisma } from '@/utils/db'
import { Controller } from '@/core/controller'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { BadRequest, UnSupportMethodError } from '@/core/api_error'
import { paginator } from '@/utils/paginator'
import { convertionApiValue } from '@/core/create-page'
import { omit } from 'lodash'
import { toneMetaList } from '@/sources/tone'

/**
 * 创建时间：2023/10/16
 * 作者：xinouyang
 * restful api for tone
 */
export default Controller(
  class Tone {
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
      return prisma.tone.findFirst({ where: { id: Number(request.query.id) } })
    }

    /**
     * Retrieves a list of tone types based on the specified category.
     *
     * @param {NextApiRequest} request - The request object.
     * @param {NextApiResponse} res - The response object.
     * @return  The list of tone.
     */
    async GET_LIST(request: NextApiRequest) {
      request.checkAuthorization()
      const { current, pageSize, ...query } = request.query

      return paginator(prisma.tone, prisma.tone.findMany, {
        include: {},
        where: convertionApiValue(query, toneMetaList),
        current: Number(current) || 1,
        pageSize: Number(pageSize) || 20,
      })
    }

    /**
     * Creates a new tone type.
     *
     * @param {NextApiRequest} request - the HTTP request object
     * @return - a promise that resolves to the newly created tone
     */
    async POST(request: NextApiRequest) {
      request.checkAuthorization()
      const { ...other } = request.body
      return prisma.tone.create({
        data: other,
      })
    }

    /**
     * Updates an tone type based on the specified ID.
     *
     * @param {NextApiRequest} request - The HTTP request object.
     * @return  - A promise that resolves to the updated tone.
     */
    async PATCH(request: NextApiRequest) {
      request.checkAuthorization()
      const { ...other } = request.body
      return prisma.tone.update({
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

      const [tone] = await prisma.$transaction([
        prisma.tone.update({
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

      return tone
    }

    /**
     * Delete function that handles HTTP DELETE requests.
     *
     * @param {NextApiRequest} request - The request object.
     * @return - A promise that resolves to the deleted tone type.
     */
    async DELETE(request: NextApiRequest) {
      request.checkAuthorization()

      // await prisma.tone.update({
      //   where: { id: Number(request.query.id) },
      //   data: { #child#: { deleteMany: {} } },
      // })

      return prisma.tone.delete({ where: { id: Number(request.query.id) } })
    }
  }
)
