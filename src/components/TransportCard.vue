<template>
  <div class="transport-card" @click="$emit('click')">
    <div class="transport-card__content">
      <div class="transport-card__icon">{{ icon }}</div>

      <div class="transport-card__info">
        <h3 class="transport-card__title">{{ title }}</h3>
        <p class="transport-card__schedule">{{ schedule }}</p>

        <div class="transport-card__status">
          <StatusTag :text="status.text" :type="status.type" />
          <span class="transport-card__mood">{{ mood }}</span>
        </div>
      </div>

      <div class="transport-card__prices">
        <p class="price-primary">min: {{ prices[0] }}</p>
        <p class="price-secondary">max: {{ prices[1] }}</p>
      </div>
    </div>

    <div class="transport-card__links">
      <button class="link-btn">ver rutas &gt;</button>
      <button class="link-btn">Paradas &gt;</button>
    </div>
  </div>
</template>

<script setup>
import StatusTag from './StatusTag.vue';

defineProps({
  icon: String,
  title: String,
  schedule: String,
  status: Object,
  mood: String,
  prices: Array
});

defineEmits(['click']);
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.transport-card {
  background: $white;
  border-radius: $radius-lg;
  padding: 16px;
  box-shadow: $shadow-md;
  margin-bottom: 12px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  &__content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 8px;
  }

  &__icon {
    font-size: 32px;
    flex-shrink: 0;
  }

  &__info {
    flex: 1;
  }

  &__title {
    font-size: 18px;
    font-weight: 700;
    color: $black;
    margin: 0 0 4px;
  }

  &__schedule {
    font-size: 12px;
    color: #666;
    margin: 0 0 8px;
  }

  &__status {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__mood {
    font-size: 20px;
  }

  &__prices {
    background: $beige;
    border-radius: $radius-sm;
    padding: 8px;
    text-align: center;
    min-width: 80px;

    .price-primary {
      font-size: 20px;
      font-weight: 700;
      color: $black;
      margin: 0 0 2px;
    }

    .price-secondary {
      font-size: 20px;
      font-weight: 700;
      color: red;
      margin: 0;
    }
  }

  &__links {
    display: flex;
    justify-content: flex-end;
    gap: 12px;

    .link-btn {
      background: none;
      border: none;
      color: $blue-gray;
      font-size: 12px;
      cursor: pointer;
      padding: 4px 8px;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
