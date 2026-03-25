<template>
  <div class="user-menu-view">
    <header class="menu-header">
      <h2>Menú</h2>
    </header>

    <div class="menu-options">
      <button class="menu-btn" @click="handleProfile">
        <span class="icon">👤</span> Perfil
      </button>
      <button class="menu-btn" @click="goTo('CarCreate')">
        <span class="icon">🚘</span> Crear un carrito
      </button>
      <button class="menu-btn" @click="goTo('RouteCreate')">
        <span class="icon">🛣️</span> Crear una ruta
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goTo = (routeName) => {
  router.push({ name: routeName });
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.user-menu-view {
  padding: 24px;
  padding-bottom: 100px;
}

.menu-header {
  margin-bottom: 30px;

  h2 {
    font-size: 28px;
    font-weight: 700;
    color: #333;
    margin: 0;
  }
}

.menu-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.menu-btn {
  display: flex;
  align-items: center;
  background: white;
  border: none;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  font-size: 16px;
  font-weight: 600;
  color: #444;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }

  .icon {
    margin-right: 15px;
    font-size: 24px;
  }
}
</style>
