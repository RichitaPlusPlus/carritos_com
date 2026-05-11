<template>
  <nav class="bottom-nav">
    <button
      :class="['nav-btn', { active: activeView === 'home' }]"
      @click="$emit('navigate', 'home')"
    >
      <img class="icon" :src="getIconUrl('coche-3d.png')" alt="Carritos" />
    </button>

    <button
      :class="['nav-btn', { active: activeView === 'routes' }]"
      @click="$emit('navigate', 'routes')"
    >
      <img class="icon" :src="getIconUrl('mapa-3d.png')" alt="Rutas" />
    </button>

    <button
      :class="['nav-btn', { active: activeView === 'menu' }]"
      @click="$emit('navigate', 'menu')"
    >
      <img class="icon" :src="getIconUrl('contacto-3d.png')" alt="Perfil" />
    </button>
  </nav>
</template>

<script setup>
import { getIconUrl } from '../composables/useSupabaseStorage';
defineProps({
  activeView: String
});

defineEmits(['navigate']);
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: $blue-gray;
  border-radius: 24px 24px 0 0;
  box-shadow: $shadow-lg;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 16px 0;
  max-width: 414px;
  margin: 0 auto;
  z-index: 100;
}

.icon {
  width: 32px;
  height: 32px;
  object-fit: cover;
}
.nav-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 8px 24px;
  opacity: 0.6;
  transition: opacity 0.3s;

  &.active {
    opacity: 1;
  }

  &:hover {
    opacity: 1;
  }
}
</style>
