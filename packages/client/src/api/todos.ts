import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { trpc } from './trpc'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from 'api-server'

const QUERY_KEY = 'todos'

type RouterInput = inferRouterInputs<AppRouter>
type RouterOutput = inferRouterOutputs<AppRouter>

type Todos = RouterOutput['todos']['index']

/** todo一覧を取得する */
export const useTodoIndex = () => {
  return useQuery([QUERY_KEY], () => trpc.todos.index.query())
}

/** todoを新規作成する */
export const useTodoCreate = () => { 
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: trpc.todos.create.mutate,
    onSuccess: async (res) => {
      // データ追加の際は一度クエリをキャンセルしなければならない
      await queryClient.cancelQueries([QUERY_KEY])

      queryClient.setQueryData<Todos>([QUERY_KEY], (old) => [...old!, res])
    }
  })
}

/** クリックしたtodoを削除する */
export const useTodoDelete = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => { 
      return trpc.todos.delete.mutate({ id })
    },
    onSuccess: async (res) => {
      await queryClient.cancelQueries([QUERY_KEY])

      queryClient.setQueryData<Todos>([QUERY_KEY], (old) => {
        return old!.filter(oldTodo => oldTodo.id !== res.id)
      })
    }
  })
}

/** useTodoUpdateの引数 */
export type UseTodoUpdateInput = RouterInput['todos']['update']

/** todoのステータスを変更する */
export const useTodoUpdate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UseTodoUpdateInput) => {
      return trpc.todos.update.mutate(input)
    },
    onSuccess: async (res) => {
      await queryClient.cancelQueries([QUERY_KEY])

      queryClient.setQueryData<Todos>([QUERY_KEY], (old) => {
        // オブジェクトのアップデートの場合、vueが反応せず画面の再描写が行われない
        // どうやら同一オブジェクトとみなして、値が変更されていないと判定される模様
        // ディープコピーを作成することで、別オブジェクトとみなされ再描写される
        // https://github.com/DamianOsipiuk/vue-query/issues/148
        const newData = structuredClone(old!)
        for(const todo of newData) {
          if (todo.id !== res!.id) continue
  
          todo.status = res!.status
        }
        return newData
      })
    }
  })
}