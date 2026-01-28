<template>
  <div :class="['timeline-node', { 'timeline-node--left': isLeft }]">
    <div class="timeline-node__card">
      <h3 class="timeline-node__title">{{ title }}</h3>
      <p class="timeline-node__description">{{ description }}</p>

      <div class="timeline-node__tags">
        <StatusTag :text="waitStatus.text" :type="waitStatus.type" />

        <div class="timeline-node__condition">
          <span class="emoji">😊</span>
          <StatusTag :text="conditionStatus.text" :type="conditionStatus.type" />
        </div>
      </div>

      <button class="timeline-node__gps-btn">
        <span class="icon">📍</span>
        Ubicacion GPS
      </button>
    </div>
  </div>
</template>

<script setup>
import StatusTag from './StatusTag.vue';

defineProps({
  title: String,
  description: String,
  waitStatus: Object,
  conditionStatus: Object,
  isLeft: Boolean
});
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.timeline-node {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
  position: relative;

  &--left {
    justify-content: flex-start;
  }

  &__card {
    background: $white;
    border-radius: $radius-lg;
    padding: 16px;
    box-shadow: $shadow-md;
    width: 160px;
  }

  &__title {
    font-size: 14px;
    font-weight: 700;
    color: $black;
    margin: 0 0 4px;
  }

  &__description {
    font-size: 12px;
    color: #666;
    margin: 0 0 8px;
  }

  &__tags {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 8px;
  }

  &__condition {
    display: flex;
    align-items: center;
    gap: 4px;

    .emoji {
      font-size: 16px;
    }
  }

  &__gps-btn {
    width: 100%;
    background: $black;
    color: $white;
    border: none;
    border-radius: 8px;
    padding: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;

    .icon {
      font-size: 12px;
    }
  }
}
</style>
