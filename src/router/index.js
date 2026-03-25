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
  // ── CRUD Form routes (must come BEFORE the :id catch-all) ──
  {
    path: '/cars/new',
    name: 'CarCreate',
    component: () => import('@/views/CarForm.vue')
  },
  {
    path: '/cars/:id/edit',
    name: 'CarEdit',
    component: () => import('@/views/CarForm.vue'),
    props: true
  },
  {
    path: '/routes/new',
    name: 'RouteCreate',
    component: () => import('@/views/RouteForm.vue')
  },
  {
    path: '/routes/:id/edit',
    name: 'RouteEdit',
    component: () => import('@/views/RouteForm.vue'),
    props: true
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
  {
    path: '/menu',
    name: 'UserMenu',
    component: () => import('@/views/UserMenuView.vue')
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
