<template>
  <nav class="bottom-nav">
    <button
      :class="['nav-btn', { active: activeView === 'home' }]"
      @click="$emit('navigate', 'home')"
    >
      🚗
    </button>

    <button
      :class="['nav-btn', { active: activeView === 'routes' }]"
      @click="$emit('navigate', 'routes')"
    >
      🛣️
    </button>

    <button class="nav-btn">
      👤
    </button>
  </nav>
</template>

<script setup>
defineProps({
  activeView: String
});

defineEmits(['navigate']);
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

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
