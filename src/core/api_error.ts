export class ApiError {
  protected constructor(
    public status: number,
    public message: string
  ) {}
}

export class BadRequest extends ApiError {
  constructor(public message = '请求错误，请检查参数') {
    super(400, message)
  }
}

export class UnAuthorizationError extends ApiError {
  constructor(public message = '未登录') {
    super(401, message)
  }
}

export class ForbidError extends ApiError {
  constructor(public message = '权限不足，禁止访问') {
    super(403, message)
  }
}

export class NotFoundError extends ApiError {
  constructor(public message = '资源未找到') {
    super(404, message)
  }
}

export class UnSupportMethodError extends ApiError {
  constructor(public message = '不支持的请求方法') {
    super(405, message)
  }
}

export class UnavailableServiceError extends ApiError {
  constructor(public message = '服务器异常') {
    super(500, message)
  }
}
