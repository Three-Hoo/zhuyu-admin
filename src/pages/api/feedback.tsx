import { prisma } from '@/utils/db'
import { Controller } from '@/core/controller'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { BadRequest, NotFoundError, UnSupportMethodError } from '@/core/api_error'
import { paginator } from '@/utils/paginator'
import { convertionApiValue } from '@/core/create-page'
import { feedbackMetaList } from '@/sources/feedback'

/**
 * 创建时间：2023/10/16
 * 作者：xinouyang
 * restful api for feedback
 */
export default Controller(
  class Feedback {
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
      return prisma.feedback.findFirst({ where: { id: Number(request.query.id) } })
    }

    /**
     * Retrieves a list of feedback types based on the specified category.
     *
     * @param {NextApiRequest} request - The request object.
     * @param {NextApiResponse} res - The response object.
     * @return  The list of feedback.
     */
    async GET_LIST(request: NextApiRequest) {
      request.checkAuthorization()
      const { current, pageSize, ...query } = request.query

      return paginator(prisma.feedback, prisma.feedback.findMany, {
        include: {},
        where: convertionApiValue(query, feedbackMetaList),
        current: Number(current) || 1,
        pageSize: Number(pageSize) || 20,
      })
    }

    /**
     * Creates a new feedback type.
     *
     * @param {NextApiRequest} request - the HTTP request object
     * @return - a promise that resolves to the newly created feedback
     */
    async POST(request: NextApiRequest) {
      request.checkAuthorization()
      const { ...other } = request.body
      return prisma.feedback.create({
        data: other,
      })
    }

    /**
     * Updates an feedback type based on the specified ID.
     *
     * @param {NextApiRequest} request - The HTTP request object.
     * @return  - A promise that resolves to the updated feedback.
     */
    async PATCH(request: NextApiRequest) {
      request.checkAuthorization()
      const { ...other } = request.body
      return prisma.feedback.update({
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

      const feedback = await prisma.feedback.findUnique({
        where: { id: Number(request.query.id) },
        select: {
          id: true,
          status: true,
        },
      })

      if (!feedback) {
        throw new NotFoundError()
      }

      return prisma.feedback.update({
        where: { id: Number(request.query.id) },
        data: {
          ...other,
          status: other.reply ? 'REPLIED' : other.status ? other.status : feedback.status ?? 'UNREAD',
        },
      })
    }

    /**
     * Delete function that handles HTTP DELETE requests.
     *
     * @param {NextApiRequest} request - The request object.
     * @return - A promise that resolves to the deleted feedback type.
     */
    async DELETE(request: NextApiRequest) {
      request.checkAuthorization()
      return prisma.feedback.delete({ where: { id: Number(request.query.id) } })
    }
  }
)
