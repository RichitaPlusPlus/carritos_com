<template>
  <div class="login-view">
    <div class="login-view__bg"></div>
    <div class="login-view__overlay"></div>
    
    <div class="login-view__content">
      <div class="login-view__header">
        <h1 class="login-view__title">Carritos.Com</h1>
        <p class="login-view__subtitle">¿Cual es tu siguiente parada?</p>
      </div>

      <button class="login-view__btn" @click="$router.push('/home')">
        Entrar
      </button>

      <p class="login-view__footer">Hecho por Richard Romero</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.login-view {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  overflow: hidden;

  &__bg {
    position: absolute;
    inset: 0;
    background: url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800') center/cover;
    filter: blur(8px);
    z-index: 0;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1;
  }

  &__content {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  &__header {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  &__title {
    font-family: $font-serif;
    font-size: 48px;
    font-weight: 700;
    color: $white;
    margin: 0 0 12px;
  }

  &__subtitle {
    font-family: $font-serif;
    font-size: 18px;
    color: $white;
    margin: 0;
  }

  &__btn {
    width: 100%;
    background: $blue-gray;
    color: $white;
    border: none;
    border-radius: $radius-lg;
    padding: 16px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: $shadow-lg;
    margin-bottom: 32px;

    &:hover {
      background: darken($blue-gray, 5%);
    }
  }

  &__footer {
    font-size: 12px;
    color: $white;
    margin: 0;
  }
}
</style>