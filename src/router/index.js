import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import HomeView from '@/views/HomeView.vue';
import RoutesView from '@/views/RoutesView.vue';
import RouteDetailView from '@/views/RouteDetailView.vue'; // This is now Stop Detail
// CarDetailView will be dynamic or added here if preferred.
// I used dynamic import in the route definition above.
// StopDetailView import is no longer strictly needed if redirected.

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/routes',
    name: 'Routes',
    component: RoutesView
  },
  {
    path: '/car/:id',
    name: 'RouteDetail', // Kept name for compatibility with HomeView link, but component is CarDetailView
    component: () => import('@/views/CarDetailView.vue')
  },
  {
    path: '/route/:id',
    name: 'route-details',
    component: RouteDetailView
  },
  // Keep StopDetail as fallback or alias if needed, but RouteDetailView is the new one
  {
    path: '/stop/:id',
    name: 'StopDetail',
    redirect: to => {
      return { name: 'route-details', params: { id: to.params.id } }
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
