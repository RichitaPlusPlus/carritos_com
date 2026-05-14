<template>
  <div class="profile-view">
    <header class="profile-header">
      <button class="btn-back" @click="router.push('/menu')">← Volver al Menú</button>
    </header>

    <div class="profile-card">
      <div class="avatar-container">
        <img
          v-if="authStore.user?.user_metadata?.avatar_url"
          :src="authStore.user.user_metadata.avatar_url"
          alt="Avatar"
          class="avatar-img"
        />
        <div v-else class="avatar-placeholder">👤</div>
      </div>

      <div class="profile-info">
        <h2 class="user-name">{{ authStore.userDisplayName }}</h2>
        <p class="user-email">{{ authStore.user?.email }}</p>

        <div class="role-badge" :class="roleClass">
          {{ translatedRole }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const roleClass = computed(() => {
  if (authStore.role === 'admin') return 'role-admin';
  if (authStore.role === 'editor') return 'role-editor';
  return 'role-viewer';
});

const translatedRole = computed(() => {
  if (authStore.role === 'admin') return 'Administrador';
  if (authStore.role === 'editor') return 'Editor';
  return 'Usuario';
});
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/styles/variables' as *;

.profile-view {
  padding: 24px;
  min-height: 100%;
}

.profile-header {
  margin-bottom: 24px;

  .btn-back {
    background: none;
    border: none;
    font-size: 1rem;
    color: $blue-gray;
    cursor: pointer;
    font-weight: 600;
    padding: 0;

    &:hover {
      text-decoration: underline;
    }
  }
}

.profile-card {
  background: $white;
  border-radius: $radius-md;
  box-shadow: $shadow-md;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.avatar-container {
  margin-bottom: 16px;

  .avatar-img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid $beige-gray;
  }

  .avatar-placeholder {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: $light-beige;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 48px;
    border: 3px solid $beige-gray;
  }
}

.profile-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  .user-name {
    font-size: 1.5rem;
    font-weight: 700;
    color: $black;
    margin: 0;
  }

  .user-email {
    font-size: 1rem;
    color: $blue-gray;
    margin: 0 0 16px 0;
  }
}

.role-badge {
  padding: 6px 16px;
  border-radius: $radius-pill;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &.role-admin {
    background-color: rgba($red, 0.15);
    color: color.adjust($red, $lightness: -20%);
    border: 1px solid rgba($red, 0.3);
  }

  &.role-editor {
    background-color: rgba($yellow, 0.2);
    color: color.adjust($yellow, $lightness: -40%);
    border: 1px solid rgba($yellow, 0.4);
  }

  &.role-viewer {
    background-color: rgba($blue-gray, 0.1);
    color: $blue-gray;
    border: 1px solid rgba($blue-gray, 0.2);
  }
}
</style>
