src/App.vue`
```vue
<template>
  <div id="app" class="app-container">
    <RouterView />

    <BottomNav
      v-if="showBottomNav"
      :activeView="currentRoute"
      @navigate="handleNavigation"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BottomNav from '@/components/BottomNav.vue';

const route = useRoute();
const router = useRouter();

const showBottomNav = computed(() => {
  return ['Home', 'Routes', 'RouteDetail'].includes(route.name);
});

const currentRoute = computed(() => {
  if (route.name === 'Home') return 'home';
  if (route.name === 'Routes') return 'routes';
  return '';
});

const handleNavigation = (view) => {
  if (view === 'home') {
    router.push('/home');
  } else if (view === 'routes') {
    router.push('/routes');
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/variables';

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
}
</style>
