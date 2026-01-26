<template>
  <div class="home-view">
    <AppHeader />
    <div class="container">
      <h1>Carritos de Maracaibo</h1>

      <!-- Loading state -->
      <div v-if="loading" class="loading">
        <LoadingSpinner />
      </div>

      <!-- Error state -->
      <div v-if="error" class="error-state">
        <ErrorMessage :message="error" />
      </div>

      <!-- Main content -->
      <div v-else class="cars-grid">
        <CarCard
          v-for="car in cars"
          :key="car.id"
          :car="car"
          @click="goToCarDetails(car.id)"
        />
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
// View imports
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Component imports
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import CarCard from '@/components/cars/CarCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

// Composable imports
import { useCars } from '@/composables/useCars'

// Router
const router = useRouter()

// Data
const { cars, loading, error, fetchCars } = useCars()

// Lifecycle
onMounted(async () => {
  await fetchCars()
})

// Methods
const goToCarDetails = (carId) => {
  router.push(`/car/${carId}`)
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.home-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  flex: 1;
  padding: $spacing-xl 0;
}

.cars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-lg;
  margin-top: $spacing-xl;
}

.loading, .error-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

@media (max-width: $breakpoint-mobile) {
  .cars-grid {
    grid-template-columns: 1fr;
    gap: $spacing-md;
  }
}
</style>
