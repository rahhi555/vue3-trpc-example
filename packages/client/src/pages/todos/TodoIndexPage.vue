<script setup lang="ts">
import AError from '@/components/atoms/AError.vue';
import { reactive, ref } from 'vue'
import { useTodoIndex, useTodoCreate, useTodoDelete, useTodoUpdate, type UseTodoUpdateInput } from '@/api/todos'

const newTodo = reactive({
  title: ''
})

const { data: todos } = useTodoIndex()

const { mutate: createTodo, error: createTodoE } = useTodoCreate()

const { mutate: deleteTodo } = useTodoDelete()

const { mutate: updateTodo } = useTodoUpdate()
const selectedStatus = ref<UseTodoUpdateInput>({
  id: 0,
  status: 'todo'
})
</script>

<template>
  <div>
    <form @submit.prevent="createTodo(newTodo)">
      <label for="new-todo-title">新規Todo</label>
      <input id="new-todo-title" type="text" v-model="newTodo.title" />
      <input type="submit" value="追加" />
    </form>

    <ul>
      <li 
        v-for="todo in todos"
        :key="todo.id"
      >
        {{ todo.status }}:  {{ todo.title }}
        <select v-model="selectedStatus" @change="updateTodo(selectedStatus)">
          <option :value="{ id: todo.id, status: 'todo' }">todo</option>
          <option :value="{ id: todo.id, status: 'doing' }">doing</option>
          <option :value="{ id: todo.id, status: 'done' }">done</option>
        </select>
        <button @click="deleteTodo(todo.id)">削除</button>
      </li>
    </ul>

    <AError :e="createTodoE" />
  </div>
</template>