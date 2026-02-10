<template>
  <div class="home-view">
    <header class="home-header">
      <h2 class="home-header__title">Bienvenido Usuario</h2>
      <p class="home-header__subtitle">¿a donde vamos?</p>
      <p class="home-header__fluctuation">
        Fluctuación del día <strong>$ {{ dollarRate }} bs.</strong>
      </p>
    </header>

    <div class="home-search">
      <input
        type="text"
        class="home-search__input"
        placeholder="Busca un carrito"
      />
    </div>

    <div class="home-transports">
      <div v-if="loading" class="text-center py-4">
        Cargando carritos...
      </div>
      <div v-else-if="error" class="text-center py-4 text-red-500">
        {{ error }}
      </div>
      <TransportCard
        v-else
        v-for="(transport, index) in transports"
        :key="transport.id || index"
        v-bind="transport"
        @click="goToDetail(transport)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TransportCard from '@/components/TransportCard.vue';
import { useSupabaseData } from '@/composables/useSupabaseData';

const router = useRouter();
const { fetchCars, fetchDollarRate, loading, error } = useSupabaseData();

const transports = ref([]);
const dollarRate = ref(0);

const loadData = async () => {
  const [carsData, rateData] = await Promise.all([
    fetchCars(),
    fetchDollarRate()
  ]);

  dollarRate.value = rateData;

  // Transform Supabase data to TransportCard format
  transports.value = carsData.map(car => ({
    id: car.id,
    // Use the logo url from the joined table, or a fallback
    icon: car.logos?.url || (car.category?.includes('bus') ? '🚌' : '🚗'),
    title: car.name,
    schedule: `${formatTime(car.schedule_start)} - ${formatTime(car.schedule_end)}`,
    status: mapCrowdStatus(car.crowd_status),
    mood: mapRating(car.rating),
    prices: [`${car.cost_min}bs`, `${car.cost_max}bs`],
    // Store original object data if needed for detail view navigation
    originalData: car
  }));
};

onMounted(() => {
  loadData();
});

const goToDetail = (transport) => {
  router.push({
    name: 'RouteDetail', // Maps to what was 'CarView' or 'RouteDetailView'
    params: { id: transport.id } // Pass ID instead of title
  });
};

// --- Helper Mappers ---

const formatTime = (timeStr) => {
  if (!timeStr) return '';
  // Simple check for HH:MM:SS
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
};

const mapCrowdStatus = (status) => {
  switch (status) {
    case 'busy': return { text: 'Concurrido', type: 'danger' };
    case 'mid_busy': return { text: 'Algo Concurrido', type: 'warning' };
    case 'fast': return { text: 'Rápido', type: 'success' };
    default: return { text: 'Normal', type: 'primary' };
  }
};

const mapRating = (rating) => {
  switch (rating) {
    case 'angry': return '😠';
    case 'sad': return '☹️';
    case 'mid': return '😐';
    case 'happy': return '😊';
    default: return '😐';
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.home-view {
  padding-bottom: 100px;
}

.home-header {
  background: $blue-gray;
  border-radius: 0 0 40px 40px;
  padding: 24px;
  color: $white;
  margin-bottom: 24px;

  &__title {
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 4px;
  }

  &__subtitle {
    font-size: 14px;
    margin: 0 0 12px;
  }

  &__fluctuation {
    font-size: 12px;
    margin: 0;

    strong {
      font-weight: 700;
    }
  }
}

.home-search {
  padding: 0 16px;
  margin-bottom: 24px;

  &__input {
    width: 100%;
    background: $white;
    border: none;
    border-radius: $radius-pill;
    padding: 12px 24px;
    box-shadow: $shadow-md;
    font-size: 14px;

    &::placeholder {
      color: #999;
    }

    &:focus {
      outline: none;
      box-shadow: $shadow-lg;
    }
  }
}

.home-transports {
  padding: 0 16px;
}
</style>
