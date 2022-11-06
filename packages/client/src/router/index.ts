import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/todos',
      name: 'todos',
      component: () => import('../pages/todos/TodoIndexPage.vue')
    },
  ]
})

export default router
