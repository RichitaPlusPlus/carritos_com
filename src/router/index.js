import { createRouter, createWebHistory } from 'vue-router';
import { watch } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import LoginView from '@/views/LoginView.vue';
import HomeView from '@/views/HomeView.vue';
import RoutesView from '@/views/RoutesView.vue';
import RouteDetailView from '@/views/RouteDetailView.vue';

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
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  // ── CRUD Form routes (must come BEFORE the :id catch-all) ──
  {
    path: '/cars/new',
    name: 'CarCreate',
    component: () => import('@/views/CarForm.vue'),
    meta: { requiresAdmin: true }
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
    component: () => import('@/views/RouteForm.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/routes/:id/edit',
    name: 'RouteEdit',
    component: () => import('@/views/RouteForm.vue'),
    props: true
  },
  {
    path: '/car/:id',
    name: 'RouteDetail', 
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

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  if (authStore.loading) {
    await new Promise(resolve => {
      if (!authStore.loading) resolve();
      else {
        const unwatch = watch(() => authStore.loading, (newVal) => {
          if (!newVal) {
            unwatch();
            resolve();
          }
        });
      }
    });
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next({ path: '/menu' });
  }
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ path: '/' });
  }

  next();
});

export default router;
