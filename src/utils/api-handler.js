export const apiHandler =
  (req, res) =>
  (options = {}) => {
    switch (req.method) {
      case 'GET':
        if (options.GET) {
          return options.GET()
        }
      case 'POST':
        if (options.POST) {
          return options.POST()
        }
      case 'PUT':
        if (options.PUT) {
          return options.PUT()
        }
      case 'PATCH':
        if (options.PATCH) {
          return options.PATCH()
        }
      case 'DELETE':
        if (options.DELETE) {
          return options.DELETE()
        }
      default:
        res.status(405).end() //Method Not Allowed
        break
    }
  }

export const checkAuthorization = (req, res) => {
  const user = req.session.user
  if (!user) {
    res.status(401).json({ ok: false, message: 'Unauthorized' })
    return true
  }
  if (user.expires < Date.now()) {
    res.status(403).json({ ok: false, message: 'Forbidden, session expired' })
    return true
  }
  return false
}
