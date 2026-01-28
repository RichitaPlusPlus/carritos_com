<template>
  <span :class="['status-tag', `status-tag--${type}`]">
    {{ text }}
  </span>
</template>

<script setup>
defineProps({
  text: String,
  type: {
    type: String,
    validator: (value) => ['danger', 'warning', 'success'].includes(value)
  }
});
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.status-tag {
  display: inline-block;
  padding: 6px 12px;
  border-radius: $radius-pill;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;

  &--danger {
    background-color: $red;
    color: $white;
  }

  &--warning {
    background-color: $yellow;
    color: $black;
  }

  &--success {
    background-color: $green;
    color: $white;
  }
}
</style>
