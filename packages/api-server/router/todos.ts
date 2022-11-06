import { router, publicProcedure } from '../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

const todos = [
  { id: 1, status: 'todo', title: '本を読む' },
  { id: 2, status: 'doing', title: 'trpcを勉強する' },
  { id: 3, status: 'done', title: 'vueを勉強する' },
]

export const todosRouter = router({
  index: publicProcedure.query(() => {
    return todos
  }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string().refine((val) => val.length > 5, {
          message: '必ず5文字以上入力してください'
        })
      })
    )
    .mutation(({ input }) => {
      const newTodo = { id: todos.length + 1, status: 'todo', title: input.title }
      todos.push(newTodo)
      return newTodo
    }),
  
  delete: publicProcedure
    .input(
      z.object({
        id: z.number()
      })
    )
    .mutation(({ input }) => {
      const idx = todos.findIndex(todo => todo.id === input.id)
      if (idx === -1) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '削除対象のtodoが見つかりませんでした'
        })
      }
      const deletedTodo = todos.splice(idx, 1)
      return deletedTodo[0]
    }),
  
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.union([z.literal('todo'), z.literal('doing'), z.literal('done')])
      })
    )
    .mutation(({ input }) => {
      for(const todo of todos) {
        if (todo.id !== input.id) continue

        todo.status = input.status
        return todo
      }
    })
})