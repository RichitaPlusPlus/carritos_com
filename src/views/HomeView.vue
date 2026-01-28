<template>
  <div class="home-view">
    <header class="home-header">
      <h2 class="home-header__title">Bienvenido Usuario</h2>
      <p class="home-header__subtitle">¿a donde vamos?</p>
      <p class="home-header__fluctuation">
        Fluctuación del día <strong>$ 344.97 bs.</strong>
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
      <TransportCard
        v-for="(transport, index) in transports"
        :key="index"
        v-bind="transport"
        @click="goToDetail(transport)"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import TransportCard from '@/components/TransportCard.vue';

const router = useRouter();

const transports = [
  {
    icon: '🚗',
    title: 'C3-Galerias',
    schedule: '6:30 am - 7:00 pm',
    status: { text: 'Concurrido', type: 'danger' },
    mood: '☹️',
    prices: ['150bs', '170bs']
  },
  {
    icon: '🚌',
    title: 'Galerias - Urbe - Lago Mall',
    schedule: '8:00 am - 7:00 pm',
    status: { text: 'Algo Concurrido', type: 'warning' },
    mood: '😐',
    prices: ['100bs', '130bs']
  },
  {
    icon: '🚌',
    title: 'K4',
    schedule: '7:30 - 6:00 pm',
    status: { text: 'Rápido', type: 'success' },
    mood: '😊',
    prices: ['150bs', '180bs']
  },
  {
    icon: '🚗',
    title: 'San Jacinto',
    schedule: '6:30 am - 7:00 pm',
    status: { text: 'Rápido', type: 'success' },
    mood: '😊',
    prices: ['150bs', '170bs']
  },
  {
    icon: '🚗',
    title: 'Bella Vista',
    schedule: '6:30 am - 7:00 pm',
    status: { text: 'Algo Concurrido', type: 'warning' },
    mood: '😐',
    prices: ['150bs', '170bs']
  }
];

const goToDetail = (transport) => {
  router.push({
    name: 'RouteDetail',
    params: { id: transport.title }
  });
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
