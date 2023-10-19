import { prisma } from '@/utils/db'
import { Controller } from '@/core/controller'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { BadRequest, NotFoundError, UnSupportMethodError } from '@/core/api_error'
import { paginator } from '@/utils/paginator'
import { convertionApiValue } from '@/core/create-page'
import { postMetaList } from '@/sources/post'
import { omit } from 'lodash'
import { post_paragraph } from '@prisma/client'

/**
 * 创建时间：2023/10/16
 * 作者：xinouyang
 * restful api for post
 */
export default Controller(
  class Post {
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
      const data = await prisma.post.findFirst({
        include: {
          paragraphs: {
            select: {
              post_paragraph_type: true,
              content: true,
              content_cn: true,
              sort: true,
              id: true,
            },
            orderBy: {
              sort: 'asc',
            },
          },
        },
        where: { id: Number(request.query.id) },
      })

      if (!data) {
        throw new NotFoundError('文章不存在')
      }

      return data
    }

    /**
     * Retrieves a list of post types based on the specified category.
     *
     * @param {NextApiRequest} request - The request object.
     * @param {NextApiResponse} res - The response object.
     * @return  The list of post.
     */
    async GET_LIST(request: NextApiRequest) {
      request.checkAuthorization()
      const { current, pageSize, ...query } = request.query

      return paginator(prisma.post, prisma.post.findMany, {
        include: {},
        where: convertionApiValue(query, postMetaList),
        current: Number(current) || 1,
        pageSize: Number(pageSize) || 20,
      })
    }

    /**
     * Creates a new post type.
     *
     * @param {NextApiRequest} request - the HTTP request object
     * @return - a promise that resolves to the newly created post
     */
    async POST(request: NextApiRequest) {
      request.checkAuthorization()
      const { ...other } = request.body

      if (!other.paragraphs || !Array.isArray(other.paragraphs) || other.paragraphs.length === 0) {
        throw new BadRequest('文章内容不能为空1')
      }

      const paragraphs = other.paragraphs as Array<post_paragraph>
      const hasEmptyParagraph = paragraphs.some((item) => !item.content?.trim())
      if (hasEmptyParagraph) {
        throw new BadRequest('请先清理空内容')
      }

      const post = await prisma.post.create({ data: omit(other, 'paragraphs') })
      await prisma.post_paragraph.createMany({
        data: paragraphs.map((item, index) => ({
          content: item.content,
          content_cn: item.content_cn,
          post_id: post.id,
          post_paragraph_type: item.post_paragraph_type,
          sort: item.sort ?? index + 1,
          speak_url: item.speak_url,
        })),
      })

      return post
    }

    /**
     * Updates an post type based on the specified ID.
     *
     * @param {NextApiRequest} request - The HTTP request object.
     * @return  - A promise that resolves to the updated post.
     */
    async PATCH(request: NextApiRequest) {
      request.checkAuthorization()
      const { ...other } = request.body
      return prisma.post.update({
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

      const paragraphs = other.paragraphs as Array<post_paragraph>
      const hasEmptyParagraph = paragraphs.some((item) => !item.content?.trim())
      if (hasEmptyParagraph) {
        throw new BadRequest('请先清理空内容')
      }

      const [post] = await prisma.$transaction([
        prisma.post.update({
          where: {
            id: Number(request.query.id),
          },
          data: omit(other, 'paragraphs'),
        }),
        ...(other.paragraphs?.map((item: post_paragraph, index: number) => {
          return item.id
            ? prisma.post_paragraph.update({ where: { id: item.id }, data: { ...item, sort: index + 1 } })
            : prisma.post_paragraph.create({ data: { ...item, post_id: Number(request.query.id), sort: index + 1 } })
        }) ?? []),
      ])
      return post
    }

    /**
     * Delete function that handles HTTP DELETE requests.
     *
     * @param {NextApiRequest} request - The request object.
     * @return - A promise that resolves to the deleted post type.
     */
    async DELETE(request: NextApiRequest) {
      request.checkAuthorization()
      return prisma.post.delete({ where: { id: Number(request.query.id) } })
    }
  }
)
