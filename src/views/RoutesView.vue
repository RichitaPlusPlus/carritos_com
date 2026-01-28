<template>
  <div class="routes-view">
    <header class="routes-header">
      <div class="routes-header__text">
        <h2 class="routes-header__title">Rutas</h2>
        <p class="routes-header__subtitle">¿Donde te encuentras?</p>
      </div>

      <div class="routes-header__icons">
        <span class="icon">❤️</span>
        <span class="icon">☹️</span>
      </div>
    </header>

    <div class="routes-search">
      <div class="search-box">
        <input
          type="text"
          class="search-box__input"
          placeholder="Busca una ruta"
        />
        <p class="search-box__hint">Que Ruta te queda mas cerca?</p>
        <div class="search-box__gps">
          <p>Copia y pega aqui tu direccion GPS</p>
          <span class="icon">📋</span>
        </div>
      </div>
    </div>

    <div class="routes-grid">
      <StopCard
        v-for="(stop, index) in stops"
        :key="index"
        v-bind="stop"
        @click="goToStopDetail(stop)"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import StopCard from '@/components/StopCard.vue';

const router = useRouter();

const stops = [
  {
    title: 'Calle 94',
    description: 'Gustavo Alvernaz - De cuatricentenario',
    waitStatus: { text: 'Corta espera', type: 'success' },
    conditionStatus: { text: 'Regular', type: 'warning' }
  },
  {
    title: 'C3',
    description: 'Circunvalacion 3 - Parada cuatricentenario',
    waitStatus: { text: 'Larga espera', type: 'danger' },
    conditionStatus: { text: 'Horrible', type: 'danger' }
  },
  {
    title: 'Calle 92',
    description: 'calle cercanas a calt 94',
    waitStatus: { text: 'Mediana espera', type: 'warning' },
    conditionStatus: { text: 'Bien', type: 'success' }
  },
  {
    title: 'Av 67 - c87',
    description: 'Calles cercanas a galerias y calle Libar Paredes',
    waitStatus: { text: 'Larga espera', type: 'danger' },
    conditionStatus: { text: 'Horrible', type: 'danger' }
  }
];

const goToStopDetail = (stop) => {
  router.push({
    name: 'StopDetail',
    params: { id: stop.title }
  });
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.routes-view {
  padding-bottom: 100px;
}

.routes-header {
  background: $blue-gray;
  border-radius: 0 0 40px 40px;
  padding: 24px;
  color: $white;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  &__title {
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 4px;
  }

  &__subtitle {
    font-size: 14px;
    margin: 0;
  }

  &__icons {
    display: flex;
    gap: 8px;

    .icon {
      font-size: 24px;
    }
  }
}

.routes-search {
  padding: 0 16px;
  margin-bottom: 24px;
}

.search-box {
  background: $white;
  border-radius: $radius-lg;
  padding: 16px;
  box-shadow: $shadow-md;

  &__input {
    width: 100%;
    border: none;
    font-size: 14px;
    margin-bottom: 8px;

    &::placeholder {
      color: #999;
    }

    &:focus {
      outline: none;
    }
  }

  &__hint {
    font-size: 12px;
    color: #999;
    margin: 0 0 4px;
  }

  &__gps {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #999;

    p {
      margin: 0;
    }

    .icon {
      font-size: 18px;
      color: $black;
    }
  }
}

.routes-grid {
  padding: 0 16px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
</style>
