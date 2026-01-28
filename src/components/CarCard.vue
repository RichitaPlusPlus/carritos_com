<template>
  <div class="car-card" :class="{ 'busy': car.crowd_status === 'busy' }">
    <div class="car-card__header">
      <img :src="car.logos?.url" :alt="car.logos?.type" class="car-card__logo" />
      <h3 class="car-card__name">{{ car.name }}</h3>
      <span class="car-card__category">{{ formatCategory(car.category) }}</span>
    </div>

    <div class="car-card__content">
      <p class="car-card__cost">{{ formatCost(car.cost_min, car.cost_max) }}</p>
      <p class="car-card__schedule">
        <IconClock /> {{ car.schedule_start }} - {{ car.schedule_end }}
      </p>
      <div class="car-card__meta">
        <span class="status-badge" :class="car.crowd_status">
          {{ formatCrowd(car.crowd_status) }}
        </span>
        <span class="status-badge" :class="car.rating">
          {{ formatRating(car.rating) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import IconClock from '@/components/icons/IconClock.vue'

defineProps({
  car: {
    type: Object,
    required: true
  }
})

const formatCategory = (category) => {
  const map = {
    'public_car': 'Carrito Público',
    'public_bus': 'Bus Público',
    'private_car': 'Carrito Privado'
  }
  return map[category] || category
}

const formatCost = (min, max) => {
  if (min === max) return `${min} Bs`
  return `${min} - ${max} Bs`
}

const formatCrowd = (status) => {
  const map = {
    'busy': 'Lleno',
    'mid_busy': 'Moderado',
    'fast': 'Rápido'
  }
  return map[status] || status
}

const formatRating = (rating) => {
  const map = {
    'angry': 'Malo',
    'sad': 'Regular',
    'mid': 'Normal',
    'happy': 'Bueno'
  }
  return map[rating] || rating
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.car-card {
  background: $card-background;
  border: 2px solid $border-color;
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  cursor: pointer;
  transition: all $transition-normal;
  box-shadow: 0 2px 8px $shadow-color;

  &:hover {
    transform: translateY(-4px);
    border-color: $primary-color;
    box-shadow: 0 8px 24px rgba($primary-color, 0.1);
  }

  &.busy {
    border-left: 4px solid $crowd-busy;
  }
}

.car-card__header {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
}

.car-card__logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.car-card__name {
  flex: 1;
  margin: 0;
  font-size: 1.25rem;
  color: $text-primary;
}

.car-card__category {
  background: rgba($primary-color, 0.1);
  color: $primary-color;
  padding: 4px 10px;
  border-radius: $border-radius-sm;
  font-size: 12px;
  font-weight: 600;
}

.car-card__content {
  p {
    margin: $spacing-xs 0;
    color: $text-secondary;
  }
}

.car-card__meta {
  display: flex;
  gap: $spacing-sm;
  margin-top: $spacing-md;
}
</style>
