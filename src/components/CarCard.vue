<template>
  <div class="car-card" :class="{ 'busy': car.crowd_status === 'busy' }" @click="$emit('click')">
    <div class="car-card__header">
      <div class="car-card__logo-container">
        <img
          v-if="icon && !imageError"
          :src="icon"
          @error="handleImageError"
          :alt="car.name"
          class="car-card__logo"
        />
        <div v-else class="car-card__fallback">
          {{ getFallbackEmoji(car.category) }}
        </div>
      </div>
      <h3 class="car-card__name">{{ car.name }}</h3>
      <span class="car-card__category">{{ formatCategory(car.category) }}</span>
    </div>

    <div class="car-card__content">
      <p class="car-card__cost">{{ formatCost(car.cost_min, car.cost_max) }}</p>
      <p class="car-card__schedule">
        ⏱️ {{ car.schedule_start }} - {{ car.schedule_end }}
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
import { ref, defineProps, defineEmits } from 'vue'

defineProps({
  car: {
    type: Object,
    required: true
  },
  icon: {
    type: String,
    default: ''
  }
})

defineEmits(['click'])

const imageError = ref(false)

const handleImageError = () => {
  imageError.value = true
}

const getFallbackEmoji = (category) => {
  if (category?.includes('bus')) return '🚌'
  return '🚗'
}

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
@use '@/assets/styles/variables' as *;

.car-card {
  background: $white;
  border: 2px solid $beige-gray;
  border-radius: $radius-lg;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: $shadow-sm;

  &:hover {
    transform: translateY(-4px);
    border-color: $blue-gray;
    box-shadow: $shadow-md;
  }

  &.busy {
    border-left: 4px solid $red;
  }
}

.car-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.car-card__logo-container {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  background: #f0f0f0;
  flex-shrink: 0;
}

.car-card__logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.car-card__fallback {
  font-size: 24px;
}

.car-card__name {
  flex: 1;
  margin: 0;
  font-size: 1.25rem;
  color: $black;
}

.car-card__category {
  background: rgba($blue-gray, 0.1);
  color: $blue-gray;
  padding: 4px 10px;
  border-radius: $radius-sm;
  font-size: 12px;
  font-weight: 600;
}

.car-card__content {
  p {
    margin: 4px 0;
    color: #666;
  }
}

.car-card__meta {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.status-badge {
  padding: 4px 10px;
  border-radius: $radius-sm;
  font-size: 12px;
  font-weight: 600;
  background: rgba($blue-gray, 0.1);
  color: $blue-gray;

  &.busy { background: rgba($red, 0.1); color: $red; }
}
</style>
