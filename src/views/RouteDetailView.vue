<template>
  <div class="route-detail-view" v-if="!loading">
    <div class="header" v-if="routeData">
      <button class="back-btn" @click="$router.back()">
        ← Volver
      </button>

      <div v-if="routeData.image_url" class="route-image">
        <img :src="routeData.image_url" :alt="routeData.stop_name" />
      </div>

      <h1 class="route-name">{{ routeData.stop_name }}</h1>
      <p class="route-title">{{ routeData.title }}</p>

      <div class="status-tags">
        <StatusTag
          :text="mapWaitTime(routeData.wait_time).text"
          :type="mapWaitTime(routeData.wait_time).type"
        />
        <StatusTag
          :text="mapLocationStatus(routeData.location_status).text"
          :type="mapLocationStatus(routeData.location_status).type"
        />
      </div>

      <div class="info-box address" v-if="routeData.address_text">
        <p>{{ routeData.address_text }}</p>
      </div>

      <div class="info-box description" v-if="routeData.description">
        <p>{{ routeData.description }}</p>
      </div>

      <!-- Attributes Grid -->
      <div class="attributes-grid" v-if="routeData.attributes && routeData.attributes.length > 0">
        <div
          v-for="(attr, index) in routeData.attributes"
          :key="attr.id || index"
          class="attribute-row"
        >
          <span class="icon">{{ getAttributeIcon(attr.type) }}</span>
          <span class="label">{{ attr.label }}</span>
        </div>
      </div>

      <button
        v-if="routeData.gps_url"
        class="gps-btn"
        @click="openLink(routeData.gps_url)"
      >
        <span class="icon">📍</span>
        Ubicación GPS
      </button>
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
  <div v-else class="loading">
    Loading...
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { carritosService } from '@/lib/carritosService'
import StatusTag from '@/components/StatusTag.vue'

const route = useRoute()
const routeData = ref(null)
const loading = ref(true)
const error = ref(null)

const fetchRouteData = async () => {
  try {
    loading.value = true
    const data = await carritosService.getRouteById(route.params.id)
    routeData.value = data
  } catch (err) {
    error.value = 'Error al cargar la ruta'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const openLink = (url) => {
  if (url) window.open(url, '_blank')
}

// Mappers
const mapWaitTime = (val) => {
  const map = {
    'long_wait': { text: 'Larga espera', type: 'danger' },
    'mid_wait': { text: 'Mediana espera', type: 'warning' },
    'short_wait': { text: 'Corta espera', type: 'success' }
  };
  return map[val] || { text: 'Desconocido', type: 'default' };
};

const mapLocationStatus = (val) => {
  const map = {
    'horrible': { text: 'Horrible', type: 'danger' },
    'regular': { text: 'Regular', type: 'warning' },
    'good': { text: 'Bien', type: 'success' }
  };
  return map[val] || { text: 'Normal', type: 'primary' };
};

const getAttributeIcon = (type) => {
  const icons = {
    'personal': '♿',
    'stores': '🏪',
    'roof': '🏠',
    'lights': '📍', // or 💡
    'chairs': '🪑',
    'high_fares': '💸',
    'no_vigilancy': '🦺', // or 👮‍♂️
    'hot': '☀️',
    'bad_route': '🏚️'
  };
  return icons[type] || '✨';
};

onMounted(() => {
  fetchRouteData()
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables';

.route-detail-view {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  padding-bottom: 100px;
}

.back-btn {
  background: none;
  border: 1px solid #ddd;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

.route-image {
  width: 100%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.route-name {
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 5px 0;
  color: #333;
}

.route-title {
  font-size: 16px;
  color: #666;
  margin: 0 0 15px 0;
  line-height: 1.4;
}

.status-tags {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.info-box {
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 14px;
  line-height: 1.5;

  &.address {
    background-color: #fff9c4; // Light yellow
    color: #5d4037;
  }

  &.description {
    background-color: #546e7a; // Blue grey
    color: white;
  }

  p {
    margin: 0;
  }
}

.attributes-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 25px 0;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.attribute-row {
  display: flex;
  align-items: center;
  gap: 15px;

  .icon {
    font-size: 20px;
    width: 24px;
    text-align: center;
  }

  .label {
    font-size: 14px;
    color: #555;
  }
}

.gps-btn {
  width: 100%;
  background-color: #546e7a;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  margin-top: 20px;

  .icon {
    font-size: 20px;
  }
}

.loading, .error {
  text-align: center;
  padding: 40px;
}
</style>
