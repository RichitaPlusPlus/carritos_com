import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import HomeView from '@/views/HomeView.vue';
import RoutesView from '@/views/RoutesView.vue';
import RouteDetailView from '@/views/RouteDetailView.vue';
import StopDetailView from '@/views/StopDetailView.vue';

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
    path: '/route/:id',
    name: 'RouteDetail',
    component: RouteDetailView
  },
  {
    path: '/stop/:id',
    name: 'StopDetail',
    component: StopDetailView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
