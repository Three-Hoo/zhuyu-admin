import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import * as ApiErrors from './api_error'
import { UnAuthorizationError, UnSupportMethodError } from './api_error'
import { checkUnAuthorizationAPI } from '@/utils/authorization-check'
import { withSessionRoute } from '@/utils/session'
import { getIronSession } from 'iron-session'
import { cookieOption } from '@/config/cookie'

type ControllerInstance = {
  GET?(req: NextApiRequest, res: NextApiResponse): Record<any, any> | Promise<Record<any, any>> | void
  GET_LIST?(req: NextApiRequest, res: NextApiResponse): Record<any, any> | Promise<Record<any, any>> | void
  POST?(req: NextApiRequest, res: NextApiResponse): Record<any, any> | Promise<Record<any, any>> | void
  PUT?(req: NextApiRequest, res: NextApiResponse): Record<any, any> | Promise<Record<any, any>> | void
  PATCH?(req: NextApiRequest, res: NextApiResponse): Record<any, any> | Promise<Record<any, any>> | void
  DELETE?(req: NextApiRequest, res: NextApiResponse): Record<any, any> | Promise<Record<any, any>> | void
}

export const Controller = (ControllerImp: { new (): ControllerInstance }) => {
  const ControllerHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const controller = new ControllerImp()
    const {id, current, pageSize} = req.query
    const isQueryList = current && pageSize

    req.checkAuthorization = function () {
      const session = getIronSession(req, res, cookieOption)
      Reflect.set(req, 'session', session, { writable: false })

      const hasPermission = checkUnAuthorizationAPI(req, res)
      if (!hasPermission) {
        throw new UnAuthorizationError(hasPermission)
      }
    }

    try {
      if (req.method?.toUpperCase() === 'POST' && controller.POST) {
        const response = await controller.POST(req, res)
        if (response) {
          res.status(200).json({ success: true, data: response })
        }
        return
      }
      if (req.method?.toUpperCase() === 'PUT' && controller.PUT) {
        const response = await controller.PUT(req, res)
        if (response) {
          res.status(200).json({ success: true, data: response })
        }
        return
      }
      if (req.method?.toUpperCase() === 'PATCH' && controller.PATCH) {
        const response = await controller.PATCH(req, res)
        if (response) {
          res.status(200).json({ success: true, data: response })
        }
        return
      }
      if (req.method?.toUpperCase() === 'DELETE' && controller.DELETE) {
        const response = await controller.DELETE(req, res)
        if (response) {
          res.status(200).json({ success: true, data: response })
        }
        return
      }
      if (req.method?.toUpperCase() === 'GET' && controller.GET && !isQueryList) {
        const response = await controller.GET(req, res)
        if (response) {
          res.status(200).json({ success: true, data: response })
        }
        return
      }
      if (req.method?.toUpperCase() === 'GET' && controller.GET_LIST && isQueryList) {
        const response = await controller.GET_LIST(req, res)
        if (response) {
          res.status(200).json({ success: true, data: response })
        }
        return
      }
      throw new UnSupportMethodError()
    } catch (error) {
      console.log('error', error)
      if (error instanceof ApiErrors.ApiError) {
        res.status(error.status).json({ success: false, message: error.message })
        return
      }
      res.status(500).json({ success: false, message: '服务器不可用' })
    }
  }

  return withSessionRoute(ControllerHandler)
}
