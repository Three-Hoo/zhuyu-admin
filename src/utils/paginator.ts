import { omit } from 'lodash'

export const paginator = async <
  M extends Record<any, any>,
  FindFn extends (...args: any[]) => unknown,
  O extends Parameters<FindFn>[0] & { current: number; pageSize: number },
>(
  model: M,
  findFn: FindFn,
  options: O
) => {
  const page = Number(options?.current) || 1
  const perPage = Number(options?.perPage) || 20
  const skip = page > 0 ? perPage * (page - 1) : 0

  const query = omit(options, 'current', 'pageSize')
  const [total, data] = await Promise.all([
    model.count({ where: query.where }),
    findFn.call(model, {
      ...query,
      take: perPage,
      skip,
    }),
  ])
  const lastPage = Math.ceil(total / perPage)

  return {
    data,
    total,
    success: true,
    meta: {
      total,
      lastPage,
      currentPage: page,
      perPage,
      prev: page > 1 ? page - 1 : null,
      next: page < lastPage ? page + 1 : null,
    },
  }
}
