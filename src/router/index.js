import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/archive/HomeView.vue'
import ProjectCalendar from "@/views/ProjectCalendar.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'project-calendar',
      component: ProjectCalendar
    },
    {
      path: '/project/:id',
      name: 'project',
      component: () => import('@/views/Project.vue'),
      props: true
    },
    {
      path: '/stage',
      name: 'stage',
      component: () => import('@/views/Stage.vue')
    },
  ]
})

export default router
