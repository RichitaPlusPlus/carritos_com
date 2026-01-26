<template>
  <div class="not-found">
    <h1>404 - Página no encontrada</h1>
    <p>La ruta que buscas no existe.</p>
    <router-link to="/" class="back-link">
      ← Volver al inicio
    </router-link>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 100px 20px;
}

.back-link {
  display: inline-block;
  margin-top: 20px;
  color: #3498db;
  text-decoration: none;
  font-weight: bold;
}
</style>
