import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // IMPORTANT: Check if HomeView.vue exists at this path
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/car/:id',
      name: 'car-details',
      component: () => import('@/views/CarDetails.vue'),
      props: true
    },
    // Optional: Add a 404 page
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
})

export default router
