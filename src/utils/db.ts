import pgLib from 'pg-promise'
import { PrismaClient } from '@prisma/client'

export function createSingleton(name, create) {
  const s = Symbol.for(name)
  let scope = global[s]
  if (!scope) {
    scope = { ...create() }
    global[s] = scope
  }
  return scope
}

export function getDB() {
  return createSingleton('my-app-db-space', () => {
    const pgp = pgLib()
    return {
      db: pgp(process.env.DB_URL),
      pgp: pgp,
    }
  })
}

const dbInst = getDB()

export const db = dbInst.db
export const pgp = dbInst.pgp

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'stdout',
        level: 'error',
      },
      {
        emit: 'stdout',
        level: 'info',
      },
      {
        emit: 'stdout',
        level: 'warn',
      },
    ],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// const querylistener = (e: any) => {
//   console.log('Query: ' + e.query, e.params)
//   console.log('Duration: ' + e.duration + 'ms')
// }

// if (!(globalThis as any).querylistener) {
//   // @ts-ignore
//   prisma.$on('query', querylistener)
//   (globalThis as any).querylistener = querylistener
// }
