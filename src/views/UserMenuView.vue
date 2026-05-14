<template>
  <div class="user-menu-view">
    <header class="menu-header">
      <h2>Menú</h2>
    </header>

    <div class="menu-options">
      <button class="menu-btn" @click="handleProfile">
        <span class="icon">
          <img :src="getIconUrl('contacto-3d.png')" class="menu-icon-img" alt="Perfil" />
        </span> Perfil
      </button>
      <template v-if="authStore.isAdmin">
        <button class="menu-btn" @click="goTo('CarCreate')">
          <span class="icon">
            <img :src="getIconUrl('coche-3d.png')" class="menu-icon-img" alt="Carrito" />
          </span> Crear un carrito
        </button>
        <button class="menu-btn" @click="goTo('RouteCreate')">
          <span class="icon">
            <img :src="getIconUrl('mapa-3d.png')" class="menu-icon-img" alt="Mapa" />
          </span> Crear una ruta
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { getIconUrl } from '../composables/useSupabaseStorage';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const goTo = (routeName) => {
  router.push({ name: routeName });
};

const handleProfile = () => {
  router.push('/profile');
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

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
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .menu-icon-img {
    width: 32px;
    height: 32px;
    object-fit: contain;
  }
}
</style>
