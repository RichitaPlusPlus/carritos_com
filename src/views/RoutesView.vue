<template>
  <div class="routes-view">
    <div class="header">
      <h1>Rutas</h1>
      <p>¿Dónde te encuentras?</p>

      <div class="search-bar">
        <input type="text" placeholder="Busca una ruta" v-model="searchQuery" />
        <span class="icon">🔍</span>
      </div>
    </div>

    <div v-if="loading" class="text-center py-4">Loading...</div>
    <div v-else-if="error" class="text-center py-4 text-red-500">{{ error }}</div>

    <div v-else class="routes-grid">
      <div
        v-for="route in filteredRoutes"
        :key="route.id"
        class="route-card"
        @click="goToRoute(route.id)"
      >
        <div class="route-header">
          <h3>{{ route.stop_name }}</h3>
          <span class="heart-icon" v-if="false">❤️</span>
        </div>

        <p class="route-subtitle">{{ route.title }}</p>

        <StatusTag
          :text="mapWaitTime(route.wait_time).text"
          :type="mapWaitTime(route.wait_time).type"
          class="mb-2"
        />

        <div class="status-row">
          <span class="mood-icon">😐</span>
          <StatusTag
            :text="mapLocationStatus(route.location_status).text"
            :type="mapLocationStatus(route.location_status).type"
          />
        </div>

        <button class="gps-btn-small" @click.stop="openLink(route.gps_url)">
          <span class="icon">!</span> Ubicacion GPS
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { carritosService } from '@/lib/carritosService';
import StatusTag from '@/components/StatusTag.vue';

const router = useRouter();
const routes = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref('');

const fetchRoutes = async () => {
  try {
    loading.value = true;
    routes.value = await carritosService.getAllRoutes();
  } catch (err) {
    error.value = 'Error cargando rutas';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const filteredRoutes = computed(() => {
  if (!searchQuery.value) return routes.value;
  const q = searchQuery.value.toLowerCase();
  return routes.value.filter(r =>
    r.stop_name.toLowerCase().includes(q) ||
    r.title.toLowerCase().includes(q)
  );
});

const goToRoute = (id) => {
  router.push({ name: 'route-details', params: { id } });
};

const openLink = (url) => {
  if (url) window.open(url, '_blank');
};

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

onMounted(() => {
  fetchRoutes();
});
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables';

.routes-view {
  padding: 20px;
  padding-bottom: 100px;
}

.header {
  background-color: #546e7a;
  color: white;
  padding: 20px;
  border-radius: 0 0 30px 30px;
  margin: -20px -20px 20px -20px;

  h1 {
    margin: 0;
    font-size: 32px;
  }

  p {
    margin: 5px 0 20px 0;
    opacity: 0.9;
  }
}

.search-bar {
  position: relative;

  input {
    width: 100%;
    padding: 12px 40px 12px 20px;
    border-radius: 20px;
    border: none;
    font-size: 14px;
  }

  .icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }
}

.routes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 15px;
}

.route-card {
  background: white;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
}

.route-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 5px;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
  }
}

.route-subtitle {
  font-size: 12px;
  color: #666;
  margin: 0 0 10px 0;
  line-height: 1.3;
}

.mb-2 {
  margin-bottom: 8px;
  display: block;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 15px;

  .mood-icon {
    font-size: 18px;
  }
}

.gps-btn-small {
  width: 100%;
  background-color: #546e7a;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 6px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;

  .icon {
    background: black;
    color: white;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: bold;
  }
}
</style>
