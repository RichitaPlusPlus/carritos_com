
<template>
  <div id="app" class="app-container">
    <AppHeader />
    <div v-if="authStore.loading" class="global-loader">
      Loading...
    </div>
    <template v-else>
      <RouterView />

      <BottomNav
        v-if="showBottomNav"
        :activeView="currentRoute"
        @navigate="handleNavigation"
      />
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BottomNav from '@/components/BottomNav.vue';
import AppHeader from '@/components/AppHeader.vue';
import { useAuthStore } from '@/stores/authStore';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const showBottomNav = computed(() => {
  return ['Home', 'Routes', 'CarDetail', 'RouteDetail', 'UserMenu'].includes(route.name);
});

const currentRoute = computed(() => {
  if (route.name === 'Home') return 'home';
  if (route.name === 'Routes') return 'routes';
  if (route.name === 'UserMenu') return 'menu';
  return '';
});

const handleNavigation = (view) => {
  if (view === 'home') {
    router.push('/home');
  } else if (view === 'routes') {
    router.push('/routes');
  } else if (view === 'menu') {
    router.push('/menu');
  }
};
</script>

<style lang="scss">
@use '@/assets/styles/variables' as *;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: $font-sans;
  background: $bg-app;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-container {
  max-width: 414px;
  min-height: 100vh;
  margin: 0 auto;
  background: $bg-app;
  position: relative;
  display: flex;
  flex-direction: column;
}

.global-loader {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: $font-serif;
  color: $blue-gray;
  font-size: 1.2rem;
}
</style>
