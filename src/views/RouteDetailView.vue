<template>
  <div class="route-detail-view">
    <div v-if="loading" class="text-center py-4">Loading...</div>
    <div v-else-if="error" class="text-center py-4 text-red-500">{{ error }}</div>
    <div v-else class="route-info-card">
      <div class="route-info-card__header">
        <div class="route-info-card__main">
          <span class="icon" v-if="!car.logos?.url">
            {{ car.category?.includes('bus') ? '🚌' : '🚗' }}
          </span>
          <img v-else :src="car.logos.url" class="h-8 w-8 object-contain" alt="logo" />
          <div>
            <h2 class="title">{{ car.name }}</h2>
            <p class="schedule">{{ formatTime(car.schedule_start) }} - {{ formatTime(car.schedule_end) }}</p>
          </div>
        </div>

        <div class="route-info-card__prices">
          <p class="price-primary">{{ car.cost_min }}bs</p>
          <p class="price-secondary">{{ car.cost_max }}bs</p>
        </div>
      </div>

      <div class="route-info-card__status">
        <StatusTag
          :text="mapCrowdStatus(car.crowd_status).text"
          :type="mapCrowdStatus(car.crowd_status).type"
        />
        <span class="mood">{{ mapRating(car.rating) }}</span>
      </div>
    </div>

    <h3 class="timeline-title">Paradas</h3>
    <div class="timeline-icons">
      <span>❤️</span>
      <span>☹️</span>
    </div>

    <div class="timeline">
      <div class="timeline__line"></div>

      <TimelineNode
        v-for="(stop, index) in timelineStops"
        :key="index"
        v-bind="stop"
      />
    </div>

    <button class="destination-btn">Destino</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import StatusTag from '@/components/StatusTag.vue';
import TimelineNode from '@/components/TimelineNode.vue';
import { useSupabaseData } from '@/composables/useSupabaseData';

const route = useRoute();
const { fetchCarRoutes, loading, error } = useSupabaseData();

const car = ref({});
const timelineStops = ref([]);

const loadData = async () => {
  const result = await fetchCarRoutes(route.params.id);

  if (result.car) {
    car.value = result.car;
    // Map routes to timeline nodes
    timelineStops.value = result.routes.map((stop, index) => ({
      id: stop.id,
      title: stop.stop_name, // e.g. "C3"
      description: stop.title, // e.g. "Circunvalacion 3..."
      // Pass raw values to TimelineNode, assuming we update it.
      // Or map here if we don't want to change TimelineNode too much.
      // User request "Step 5" implies we SHOULD update the card to handle logic.
      // So I will pass raw props and let child handle it, OR pass mapped props.
      // To keep this clean, I'll pass mapped props as the current component expects objects.
      // actually, let's map it here to be safe and compatible with current TimelineNode
      waitStatus: mapWaitTime(stop.wait_time),
      conditionStatus: mapLocationStatus(stop.location_status),
      isLeft: index % 2 === 0,
      // Pass other data if needed
      originalData: stop
    }));
  }
};

onMounted(() => {
  loadData();
});

// --- Mappers ---
const formatTime = (timeStr) => {
  if (!timeStr) return '';
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

// --- Car Helpers (since we didn't fetch full car details in fetchCarRoutes, only name/id from separate query if simplest,
// OR we might want to fetch full car details.
// My useSupabaseData.fetchCarRoutes only selected 'route_ids, name'.
// I should probably enhance fetchCarRoutes to return more car info if needed for the header.
// The header shows: name, schedule, prices, rating/mood.
// My fetchCarRoutes currently fetches: .select('route_ids, name')
// I need to update useSupabaseData.js to fetch more fields for the car!
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.route-detail-view {
  padding: 24px 16px 120px;
}

.route-info-card {
  background: $white;
  border-radius: $radius-lg;
  padding: 16px;
  box-shadow: $shadow-lg;
  margin-bottom: 24px;

  &__header {
    display:flex;
justify-content: space-between;
align-items: flex-start;
margin-bottom: 12px;
}
&__main {
display: flex;
gap: 12px;
align-items: center;
.icon {
  font-size: 28px;
}

.title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 4px;
}

.schedule {
  font-size: 12px;
  color: #666;
  margin: 0;
}
}
&__prices {
background: $beige;
border-radius: $radius-sm;
padding: 8px;
text-align: center;
min-width: 60px;
.price-primary {
  font-size: 12px;
  font-weight: 700;
  margin: 0 0 2px;
}

.price-secondary {
  font-size: 12px;
  color: #666;
  margin: 0;
}
}
&__status {
display: flex;
align-items: center;
gap: 8px;
.mood {
  font-size: 20px;
}
}
}
.timeline-title {
text-align: center;
font-size: 18px;
font-weight: 700;
margin: 0 0 8px;
}
.timeline-icons {
display: flex;
justify-content: center;
gap: 8px;
font-size: 20px;
margin-bottom: 24px;
}
.timeline {
position: relative;
&__line {
position: absolute;
left: 50%;
top: 0;
bottom: 0;
width: 2px;
border-left: 2px dashed $black;
transform: translateX(-50%);
}
}
.destination-btn {
position: fixed;
bottom: 120px;
left: 24px;
background: $black;
color: $white;
border: none;
border-radius: $radius-lg;
padding: 12px 24px;
font-size: 16px;
font-weight: 600;
cursor: pointer;
box-shadow: $shadow-lg;
z-index: 50;
}
</style>
