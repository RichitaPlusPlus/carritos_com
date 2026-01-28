<template>
  <div class="stop-card" @click="$emit('click')">
    <h3 class="stop-card__title">{{ title }}</h3>
    <p class="stop-card__description">{{ description }}</p>

    <div class="stop-card__tags">
      <StatusTag :text="waitStatus.text" :type="waitStatus.type" />

      <div class="stop-card__condition">
        <span class="emoji">😊</span>
        <StatusTag :text="conditionStatus.text" :type="conditionStatus.type" />
      </div>
    </div>

    <button class="stop-card__gps-btn">
      <span class="icon">📍</span>
      Ubicacion GPS
    </button>
  </div>
</template>

<script setup>
import StatusTag from './StatusTag.vue';

defineProps({
  title: String,
  description: String,
  waitStatus: Object,
  conditionStatus: Object
});

defineEmits(['click']);
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.stop-card {
  background: $white;
  border-radius: $radius-lg;
  padding: 16px;
  box-shadow: $shadow-md;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  &__title {
    font-size: 16px;
    font-weight: 700;
    color: $black;
    margin: 0 0 4px;
  }

  &__description {
    font-size: 12px;
    color: #666;
    margin: 0 0 12px;
  }

  &__tags {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
  }

  &__condition {
    display: flex;
    align-items: center;
    gap: 8px;

    .emoji {
      font-size: 18px;
    }
  }

  &__gps-btn {
    width: 100%;
    background: $black;
    color: $white;
    border: none;
    border-radius: 8px;
    padding: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;

    .icon {
      font-size: 16px;
    }

    &:hover {
      background: lighten($black, 10%);
    }
  }
}
</style>
