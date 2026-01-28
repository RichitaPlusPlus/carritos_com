<template>
  <div class="stop-detail-view">
    <div class="stop-header">
      <div class="stop-header__image">
        <img
          src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop"
          alt="Parada"
        />
      </div>
    </div>

    <div class="stop-content">
      <h2 class="stop-content__title">C3</h2>
      <p class="stop-content__description">
        Circunvalacion 3 - Parada cuatricentenario
      </p>

      <div class="stop-content__tags">
        <StatusTag text="Larga espera" type="danger" />
        <StatusTag text="Horrible" type="danger" />
      </div>

      <div class="info-box info-box--warning">
        <p>
          Avendo Circunvalacion 3, Simon Rey de Reyes, Francisco Eugenio Bustamante,
          Estado Zulia
        </p>
      </div>

      <div class="info-box info-box--alert">
        <p>
          De las peores ubicaciones para esperar un pasaje público. Evitar si es
          posible en especial si eres mujer o eres muy propenso a ti a que te pase
          algo, propenso al malandreo
        </p>
      </div>

      <div class="attributes-box">
        <div
          v-for="(attr, index) in attributes"
          :key="index"
          class="attribute-item"
        >
          <span class="attribute-item__icon">{{ attr.icon }}</span>
          <p class="attribute-item__text">{{ attr.text }}</p>
        </div>
      </div>

      <button class="gps-button">
        <span class="icon">📍</span>
        Ubicacion GPS
      </button>
    </div>
  </div>
</template>

<script setup>
import StatusTag from '@/components/StatusTag.vue';

const attributes = [
  { icon: '💸', text: 'Tendencia a pasajes altos' },
  { icon: '🦺', text: 'Sin vigilancia policial' },
  { icon: '🏚️', text: 'Calles horribles' },
  { icon: '☀️', text: 'Caluroso' },
  { icon: '🏠', text: 'Techos con sombra' },
  { icon: '📍', text: 'hay faroles' },
  { icon: '🪑', text: 'Asientos de espera' },
  { icon: '🏪', text: 'Tiendas cerca' },
  { icon: '♿', text: 'Personal capacitado' }
];
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.stop-detail-view {
  padding-bottom: 120px;
}

.stop-header {
  background: $blue-gray;
  padding: 24px 24px 16px;
  border-radius: 0 0 40px 40px;

  &__image {
    background: $white;
    border-radius: $radius-lg;
    overflow: hidden;
    box-shadow: $shadow-lg;

    img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      display: block;
    }
  }
}

.stop-content {
  padding: 24px;

  &__title {
    font-size: 32px;
    font-weight: 700;
    margin: 0 0 8px;
  }

  &__description {
    font-size: 14px;
    color: #666;
    margin: 0 0 12px;
  }

  &__tags {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }
}

.info-box {
  border-radius: $radius-sm;
  padding: 16px;
  margin-bottom: 16px;

  p {
    font-size: 12px;
    margin: 0;
    line-height: 1.5;
  }

  &--warning {
    background: $light;
    color: #666;
  }

  &--alert {
    background: $blue-gray;
    color: $white;
  }
}

.attributes-box {
  background: $beige-gray;
  border-radius: $radius-sm;
  padding: 16px;
  margin-bottom: 24px;
}

.attribute-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }

  &__icon {
    font-size: 20px;
  }

  &__text {
    font-size: 14px;
    color: $black;
    margin: 0;
  }
}

.gps-button {
  width: 100%;
  background: $dark-green;
  color: $white;
  border: none;
  border-radius: $radius-lg;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: $shadow-lg;

  .icon {
    font-size: 20px;
  }

  &:hover {
    background: lighten($dark-green, 5%);
  }
}
</style>
