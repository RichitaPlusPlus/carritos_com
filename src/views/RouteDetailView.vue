<template>
  <div class="route-detail-view">
    <div class="route-info-card">
      <div class="route-info-card__header">
        <div class="route-info-card__main">
          <span class="icon">🚗</span>
          <div>
            <h2 class="title">C3 - Galerias</h2>
            <p class="schedule">6:30 am - 7:00 pm</p>
          </div>
        </div>

        <div class="route-info-card__prices">
          <p class="price-primary">150bs</p>
          <p class="price-secondary">170bs</p>
        </div>
      </div>

      <div class="route-info-card__status">
        <StatusTag text="Concurrido" type="danger" />
        <span class="mood">☹️</span>
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
import StatusTag from '@/components/StatusTag.vue';
import TimelineNode from '@/components/TimelineNode.vue';

const timelineStops = [
  {
    title: 'C3',
    description: 'Circunvalacion 3 - Parada cuatricentenario',
    waitStatus: { text: 'Larga espera', type: 'danger' },
    conditionStatus: { text: 'Horrible', type: 'danger' },
    isLeft: true
  },
  {
    title: 'Calle 94',
    description: 'Gustavo Alvernaz',
    waitStatus: { text: 'Corta espera', type: 'success' },
    conditionStatus: { text: 'Regular', type: 'warning' },
    isLeft: false
  },
  {
    title: 'Calle 92',
    description: 'calle cercanas a calt 94',
    waitStatus: { text: 'Mediana espera', type: 'warning' },
    conditionStatus: { text: 'Bien', type: 'success' },
    isLeft: true
  },
  {
    title: 'Av 67 - c87',
    description: 'Calles cercanas a galerias',
    waitStatus: { text: 'Larga espera', type: 'danger' },
    conditionStatus: { text: 'Horrible', type: 'danger' },
    isLeft: false
  }
];
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
