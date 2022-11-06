import express from 'express';
import cors from 'cors'
import * as trpcExpress from '@trpc/server/adapters/express'
import { appRouter } from './router'
import { ZodError } from 'zod'

export type AppRouter = typeof appRouter

const app = express();

app.use(cors())

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
    onError({ error }) {
      // `error.cause`がZodErrorのインスタンスの場合には`error.message`をZodのエラーメッセージに上書きする
      if (error.cause instanceof ZodError) {
        error.message = error.cause.issues[0].message
      }
    }
  })
);

app.listen(4000, () => {
  console.log('server起動 port 4000')
});
