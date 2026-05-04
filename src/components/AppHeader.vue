<template>
  <header class="app-header">
    <div class="header-content">
      <h1 class="app-title">Carritos.Com</h1>
      <div class="user-section">
        <template v-if="authStore.isAuthenticated">
          <div class="user-info">
            <img 
              v-if="authStore.user?.user_metadata?.avatar_url" 
              :src="authStore.user.user_metadata.avatar_url" 
              alt="Avatar" 
              class="user-avatar" 
            />
            <span class="user-name">{{ authStore.user?.user_metadata?.full_name || 'User' }}</span>
          </div>
          <button @click="authStore.signOut" class="btn-logout">Logout</button>
        </template>
        <template v-else>
          <button @click="authStore.signInWithGoogle" class="btn-login">Sign in with Google</button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/styles/variables' as *;

.app-header {
  background: $white;
  padding: 12px 16px;
  border-bottom: 1px solid $beige-gray;
  box-shadow: $shadow-sm;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .app-title {
    font-size: 1.25rem;
    color: $black;
    font-family: $font-serif;
    margin: 0;
  }

  .user-section {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: $radius-pill;
    object-fit: cover;
  }

  .user-name {
    font-size: 0.9rem;
    font-weight: 500;
    color: $black;
  }

  .btn-login,
  .btn-logout {
    padding: 8px 12px;
    border: none;
    border-radius: $radius-sm;
    font-size: 0.85rem;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
  }

  .btn-login {
    background: $blue-gray;
    color: $white;

    &:hover {
      background: color.adjust($blue-gray, $lightness: -10%);
    }
  }

  .btn-logout {
    background: $red;
    color: $black;

    &:hover {
      background: color.adjust($red, $lightness: -10%);
    }
  }
}
</style>
