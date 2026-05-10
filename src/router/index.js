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
    path: '/menu/cars/new',
    name: 'CarCreate',
    component: () => import('@/views/CarForm.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/menu/cars/:id/edit',
    name: 'CarEdit',
    component: () => import('@/views/CarForm.vue'),
    props: true,
    meta: { requiresAdmin: true }
  },
  {
    path: '/menu/routes/new',
    name: 'RouteCreate',
    component: () => import('@/views/RouteForm.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/menu/routes/:id/edit',
    name: 'RouteEdit',
    component: () => import('@/views/RouteForm.vue'),
    props: true,
    meta: { requiresAdmin: true }
  },
  {
    path: '/car/:id',
    name: 'CarDetail', 
    component: () => import('@/views/CarDetailView.vue')
  },
  {
    path: '/route/:id',
    name: 'RouteDetail',
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
      return { name: 'RouteDetail', params: { id: to.params.id } }
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
    try {
      await Promise.race([
        new Promise(resolve => {
          const unwatch = watch(() => authStore.loading, (val) => {
            if (!val) {
              unwatch();
              resolve();
            }
          });
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Auth timeout')), 5000))
      ]);
    } catch (error) {
      console.error('Auth initialization timeout:', error);
      // We continue but might fail role checks later if it never loads
      // Alternatively, we could redirect to an error page if we had one
    }
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
