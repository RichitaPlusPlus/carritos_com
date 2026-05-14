<template>
  <div class="car-details" v-if="!loading">
    <div class="header">
      <button class="back-btn" @click="$router.back()">
        ← Volver a la lista
      </button>
      <h1>{{ car.name }}</h1>
      <div class="car-meta">
        <div class="logo-container">
          <img
            v-if="car.logos?.url && !imageError"
            :src="car.logos.url"
            @error="handleImageError"
            :alt="car.name"
            class="logo"
          />
          <div v-else class="logo-fallback">
            {{ getFallbackEmoji(car.category) }}
          </div>
        </div>
        <span class="category">{{ formatCategory(car.category) }}</span>
        <span class="cost">{{ formatCost(car.cost_min, car.cost_max) }}</span>
      </div>
    </div>

    <div class="car-info-grid">
      <div class="info-card">
        <h3>Horario</h3>
        <p>{{ formatSchedule(car.schedule_start, car.schedule_end) }}</p>
      </div>

      <div class="info-card">
        <h3>Concurrencia</h3>
        <p>{{ formatCrowd(car.crowd_status) }}</p>
      </div>

      <div class="info-card">
        <h3>Valoración</h3>
        <div class="rating-display">
          <img v-if="car.rating" :src="getRatingIcon(car.rating)" class="rating-icon" />
          <p>{{ formatRating(car.rating) }}</p>
        </div>
      </div>
    </div>

    <!-- Route Visualization -->
    <div class="route-visualization">
      <h2>Paradas</h2>
      <div class="timeline">
        <div
          v-for="(route, index) in routes"
          :key="route.id"
          class="stop-item"
          :class="{ 'current': index === 0, 'last': index === routes.length - 1 }"
          @click="goToRouteDetail(route.id)"
          style="cursor: pointer;"
        >
          <div class="stop-marker">
            <div class="marker-circle"></div>
            <div class="marker-line" v-if="index !== routes.length - 1"></div>
          </div>
          <div class="stop-content">
            <div class="stop-header">
              <h3 class="stop-name">{{ route.stop_name }}</h3>
              <span class="stop-order">{{ index + 1 }}</span>
            </div>
            <p class="stop-title">{{ route.title }}</p>

            <div class="stop-meta">
              <span class="wait-time" :class="route.wait_time">
                ⏱️ {{ formatWaitTime(route.wait_time) }}
              </span>
              <span class="location-status" :class="route.location_status">
                <img :src="getLocationStatusIcon(route.location_status)" class="status-icon" />
                {{ formatLocationStatus(route.location_status) }}
              </span>
            </div>

            <!-- Attributes -->
            <div class="attributes" v-if="route.attributes && route.attributes.length > 0">
              <span
                v-for="(attr, index) in route.attributes"
                :key="index"
                class="attribute-tag"
              >
                {{ attr.label }}
              </span>
            </div>

            <div class="stop-actions" v-if="route.gps_url || route.image_url">
              <button
                v-if="route.gps_url"
                @click.stop="openLink(route.gps_url)"
                class="action-btn gps"
              >
                🗺️ Ubicación GPS
              </button>
              <button
                v-if="route.image_url"
                @click.stop="openLink(route.image_url)"
                class="action-btn image"
              >
                📸 Ver Imagen
              </button>
            </div>

            <p class="address" v-if="route.address_text">
              <small>📍 {{ route.address_text }}</small>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="loading">
    <div class="spinner"></div>
    <p>Cargando detalles del carrito...</p>
  </div>

  <!-- Error State -->
  <div v-if="error" class="error">
    <h3>Error al cargar los detalles del carrito</h3>
    <p>{{ error }}</p>
    <button @click="fetchCarDetails">Try Again</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { carritosService } from '@/lib/carritosService'
import { getIconUrl } from '../composables/useSupabaseStorage';

const route = useRoute()
const router = useRouter()
const car = ref({})
const routes = ref([])
const loading = ref(true)
const error = ref(null)
const imageError = ref(false)

const handleImageError = () => {
  imageError.value = true
}

const getFallbackEmoji = (category) => {
  if (category?.includes('bus')) return '🚌'
  return '🚗'
}

const fetchCarDetails = async () => {
  try {
    loading.value = true
    error.value = null
    const data = await carritosService.getCarWithOrderedRoutes(route.params.id)
    car.value = data.car
    routes.value = data.routes
  } catch (err) {
    error.value = err.message || 'Failed to load car details'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCarDetails()
})

// Helper Functions
const goToRouteDetail = (routeId) => {
  router.push({ name: 'RouteDetail', params: { id: routeId } })
}

const openLink = (url) => {
  if (url) window.open(url, '_blank')
}

const formatCategory = (category) => {
  const map = {
    'public_car': 'Carrito Publico',
    'public_bus': 'Bus Publico',
    'private_car': 'Carro Privado'
  }
  return map[category] || category
}

const formatCost = (min, max) => {
  if (min === max) return `${min} Bs`
  return `${min} - ${max} Bs`
}

const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
};

const formatSchedule = (start, end) => {
  if (!start || !end) return 'No disponible';
  return `${formatTime(start)} - ${formatTime(end)}`;
}

const formatCrowd = (status) => {
  const map = {
    'busy': 'Lleno',
    'mid_busy': 'Moderado',
    'fast': 'Rapido'
  }
  return map[status] || status
}

const formatRating = (rating) => {
  const map = {
    'bad': 'Mala',
    'sad': 'Regular',
    'mid': 'Normal',
    'happy': 'Buenisimo'
  }
  return map[rating] || rating
}

const getRatingIcon = (rating) => {
  const map = {
    'bad': 'bad.ico',
    'sad': 'sad.ico',
    'mid': 'medium.ico',
    'happy': 'happy.ico'
  }
  const iconName = map[rating] || 'medium.ico'
  return getIconUrl(iconName)
}

const getLocationStatusIcon = (status) => {
  const map = {
    'horrible': 'bad.ico',
    'regular': 'medium.ico',
    'good': 'happy.ico'
  }
  const iconName = map[status] || 'medium.ico'
  return getIconUrl(iconName)
}

const formatWaitTime = (waitTime) => {
  const map = {
    'long_wait': 'larga espera (15+ min)',
    'mid_wait': 'espera moderada (5-15 min)',
    'short_wait': 'espera corta (<5 min)'
  }
  return map[waitTime] || waitTime
}

const formatLocationStatus = (status) => {
  const map = {
    'horrible': 'Mala zona',
    'regular': 'Zona normal',
    'good': 'Buena zona'
  }
  return map[status] || status
}
</script>

<style scoped>

.car-details {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.back-btn {
  background: #596E79;
  border: 3px solid #ddd;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 14px;
}

.back-btn:hover {
  background-color: #f5f5f5;
}

.header h1 {
  margin: 0 0 10px 0;
  color: #333;
}

.car-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.logo-container {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo-fallback {
  font-size: 28px;
}

.category, .cost {
  background:#2DC75C ;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 20px;
  font-weight: 600;
}

.cost {
  background: #C7B198;
}

.car-info-grid {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 30px;
}

.info-card {
  flex: 1;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 12px 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.info-card h3 {
  margin: 0 0 6px 0;
  font-size: 13px;
  color: #666;
  white-space: nowrap;
}

.info-card p {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.rating-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.rating-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

/* Route Visualization */
.route-visualization {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  margin-bottom: 100px;
}

.route-visualization h2 {
  margin: 0 0 25px 0;
  color: #2c3e50;
  border-bottom: 2px solid #28423F;
  padding-bottom: 10px;
}

.timeline {
  position: relative;
}

.stop-item {
  display: flex;
  margin-bottom: 30px;
  position: relative;
}

.stop-item:last-child {
  margin-bottom: 0;
}

.stop-item.current .marker-circle {
  background: #27ae60;
  border-color: #27ae60;
}

.stop-item.last .marker-circle {
  background: #e74c3c;
  border-color: #e74c3c;
}

.stop-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
  position: relative;
}

.marker-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #28423F;
  border: 3px solid white;
  box-shadow: 0 0 0 3px #213331;
  z-index: 2;
}

.marker-line {
  flex: 1;
  width: 2px;
  background: none;
  border-left: 10px dashed #333;
  margin-top: 10px;
}

.stop-content {
  flex: 1;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  border-left: 4px solid #213331;
}

.stop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.stop-name {
  margin: 0;
  font-size: 18px;
  color: #2c3e50;
}

.stop-order {
  background: #DFD3C3;
  color: rgb(0, 0, 0);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.stop-title {
  margin: 0 0 10px 0;
  font-weight: 500;
  color: #555;
}

.stop-description {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.stop-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 12px;
}

.wait-time, .location-status {
  font-size: 13px;
  padding: 3px 8px;
  border-radius: 4px;
}

.wait-time.short_wait {
  background: #d4edda;
  color: #155724;
}

.wait-time.mid_wait {
  background: #fff3cd;
  color: #856404;
}

.wait-time.long_wait {
  background: #f8d7da;
  color: #721c24;
}

.location-status.good {
  background: #d4edda;
  color: #155724;
}

.location-status.regular {
  background: #fff3cd;
  color: #856404;
}

.location-status.horrible {
  background: #f8d7da;
  color: #721c24;
}

.attributes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.attribute-tag {
  background: #e3f2fd;
  color: #1565c0;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.stop-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.action-btn {
  padding: 6px 12px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  display: inline-block;
}

.action-btn.gps {
  background: #28423f;
  color: white;
}

.action-btn.image {
  background: #9b59b6;
  color: white;
}

.action-btn:hover {
  opacity: 0.9;
}

.address {
  margin: 8px 0 0 0;
  color: #7f8c8d;
  font-size: 13px;
}

/* Loading State */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #28423F;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
.error {
  text-align: center;
  padding: 40px;
  color: #e74c3c;
}

.error button {
  background: #28423F;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .car-details {
    padding: 15px;
  }

  .car-info-grid {
    gap: 8px;
  }

  .info-card {
    padding: 10px 5px;
  }

  .info-card h3 {
    font-size: 11px;
    margin-bottom: 4px;
    white-space: normal;
  }

  .info-card p {
    font-size: 12px;
  }

  .stop-meta {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
