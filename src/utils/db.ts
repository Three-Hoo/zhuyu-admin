import { PrismaClient } from '@prisma/client'

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
