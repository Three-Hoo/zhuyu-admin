// next/dist/shared/lib/utils
import { IncomingMessage } from 'http'

declare module 'next/dist/shared/lib/utils' {
  interface NextApiRequest extends IncomingMessage {
    session: {
      user?: {
        expires: number
        admin: boolean
        username: string
      }

      save(): Promise<void>
      destroy: () => void
    }
    checkAuthorization(): void
  }
}
