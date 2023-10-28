import { prisma } from '@/utils/db'
import { Controller } from '@/core/controller'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { BadRequest, UnSupportMethodError } from '@/core/api_error'
import { paginator } from '@/utils/paginator'
import { convertionApiValue } from '@/core/create-page'
import { omit } from 'lodash'
import { promptTemplateMetaList } from '@/sources/prompt-template'
import { prompt_template, prompt_template_content } from '@prisma/client'

/**
 * 创建时间：2023/10/16
 * 作者：xinouyang
 * restful api for prompt_template
 */
export default Controller(
  class PromptTemplate {
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
      return prisma.prompt_template.findFirst({
        where: { id: Number(request.query.id) },
        include: { prompt_template_contents: true },
      })
    }

    /**
     * Retrieves a list of prompt_template types based on the specified category.
     *
     * @param {NextApiRequest} request - The request object.
     * @param {NextApiResponse} res - The response object.
     * @return  The list of prompt_template.
     */
    async GET_LIST(request: NextApiRequest) {
      request.checkAuthorization()
      const { current, pageSize, ...query } = request.query

      return paginator(prisma.prompt_template, prisma.prompt_template.findMany, {
        include: {},
        where: convertionApiValue(query, promptTemplateMetaList),
        current: Number(current) || 1,
        pageSize: Number(pageSize) || 20,
      })
    }

    /**
     * Creates a new prompt_template type.
     *
     * @param {NextApiRequest} request - the HTTP request object
     * @return - a promise that resolves to the newly created prompt_template
     */
    async POST(request: NextApiRequest) {
      request.checkAuthorization()
      const { ...other } = request.body
      return prisma.prompt_template.create({
        data: {
          ...(omit(other, 'prompt_template_contents') as prompt_template),
          prompt_template_contents: {
            create: other.prompt_template_contents,
          },
        },
      })
    }

    /**
     * Updates an prompt_template type based on the specified ID.
     *
     * @param {NextApiRequest} request - The HTTP request object.
     * @return  - A promise that resolves to the updated prompt_template.
     */
    async PATCH(request: NextApiRequest) {
      request.checkAuthorization()
      const { ...other } = request.body
      return prisma.prompt_template.update({
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

      const [prompt_template] = await prisma.$transaction([
        prisma.prompt_template.update({
          where: { id: Number(request.query.id) },
          data: omit(other, 'prompt_template_contents'),
        }),
        ...(other.prompt_template_contents?.map((item: prompt_template_content) => {
          return item.id
            ? prisma.prompt_template_content.update({ where: { id: item.id }, data: item })
            : prisma.prompt_template_content.create({ data: { ...item, prompt_template_id: Number(request.query.id) } })
        }) ?? []),
      ])

      return prompt_template
    }

    /**
     * Delete function that handles HTTP DELETE requests.
     *
     * @param {NextApiRequest} request - The request object.
     * @return - A promise that resolves to the deleted prompt_template type.
     */
    async DELETE(request: NextApiRequest) {
      request.checkAuthorization()

      // await prisma.prompt_template.update({
      //   where: { id: Number(request.query.id) },
      //   data: { #child#: { deleteMany: {} } },
      // })

      return prisma.prompt_template.delete({ where: { id: Number(request.query.id) } })
    }
  }
)
