<template>
  <div class="stop-detail-view">
    <div v-if="loading" class="text-center py-4">Loading...</div>
    <div v-else-if="error" class="text-center py-4 text-red-500">{{ error }}</div>
    <template v-else>
      <div class="stop-header">
        <div class="stop-header__image">
          <img
            :src="stop.image_url || 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop'"
            alt="Parada"
          />
        </div>
      </div>

      <div class="stop-content">
        <h2 class="stop-content__title">{{ stop.stop_name || 'Parada' }}</h2>
        <p class="stop-content__description">
          {{ stop.title }}
        </p>

        <div class="stop-content__tags">
          <StatusTag
            :text="mapWaitTime(stop.wait_time).text"
            :type="mapWaitTime(stop.wait_time).type"
          />
          <StatusTag
            :text="mapLocationStatus(stop.location_status).text"
            :type="mapLocationStatus(stop.location_status).type"
          />
        </div>

        <div v-if="stop.address_text" class="info-box info-box--warning">
          <p>
            {{ stop.address_text }}
          </p>
        </div>

        <div v-if="stop.description" class="info-box info-box--alert">
          <p>
            {{ stop.description }}
          </p>
        </div>

        <div class="attributes-box" v-if="attributes.length > 0">
          <div
            v-for="(attr, index) in attributes"
            :key="index"
            class="attribute-item"
          >
            <span class="attribute-item__icon">{{ attr.icon }}</span>
            <p class="attribute-item__text">{{ attr.text }}</p>
          </div>
        </div>

        <a
          v-if="stop.gps_url"
          :href="stop.gps_url"
          target="_blank"
          class="gps-button"
          style="text-decoration: none;"
        >
          <span class="icon">📍</span>
          Ubicacion GPS
        </a>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import StatusTag from '@/components/StatusTag.vue';
import { useSupabaseData } from '@/composables/useSupabaseData';

const route = useRoute();
const { fetchStopDetails, loading, error } = useSupabaseData();

const stop = ref({});
const attributes = ref([]);

const loadData = async () => {
  const data = await fetchStopDetails(route.params.id);
  if (data) {
    stop.value = data;
    // Map route_attributes to view model
    if (data.route_attributes) {
      attributes.value = data.route_attributes.map(ra => ({
        text: ra.attributes?.label,
        icon: getAttributeIcon(ra.attributes?.type),
        type: ra.attributes?.type
      })).filter(attr => attr.text);
    }
  }
};

onMounted(() => {
  loadData();
});

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
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.stop-detail-view {
  padding-bottom: 120px;
}

.stop-header {
  background: $blue-gray;
  padding: 24px 24px 16px;
  border-radius: 0 0 40px 40px;

  &__image {
    background: $white;
    border-radius: $radius-lg;
    overflow: hidden;
    box-shadow: $shadow-lg;

    img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      display: block;
    }
  }
}

.stop-content {
  padding: 24px;

  &__title {
    font-size: 32px;
    font-weight: 700;
    margin: 0 0 8px;
  }

  &__description {
    font-size: 14px;
    color: #666;
    margin: 0 0 12px;
  }

  &__tags {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }
}

.info-box {
  border-radius: $radius-sm;
  padding: 16px;
  margin-bottom: 16px;

  p {
    font-size: 12px;
    margin: 0;
    line-height: 1.5;
  }

  &--warning {
    background: $light;
    color: #666;
  }

  &--alert {
    background: $blue-gray;
    color: $white;
  }
}

.attributes-box {
  background: $beige-gray;
  border-radius: $radius-sm;
  padding: 16px;
  margin-bottom: 24px;
}

.attribute-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }

  &__icon {
    font-size: 20px;
  }

  &__text {
    font-size: 14px;
    color: $black;
    margin: 0;
  }
}

.gps-button {
  width: 100%;
  background: $dark-green;
  color: $white;
  border: none;
  border-radius: $radius-lg;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: $shadow-lg;

  .icon {
    font-size: 20px;
  }

  &:hover {
    background: lighten($dark-green, 5%);
  }
}
</style>
