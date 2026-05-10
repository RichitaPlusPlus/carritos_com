<template>
  <div class="car-form-view">
    <!-- Toast notification -->
    <Transition name="toast-fade">
      <div v-if="toast.show" class="toast" :class="toast.type">
        {{ toast.message }}
      </div>
    </Transition>

    <div class="form-header">
      <button class="back-btn" @click="handleCancel">← Volver</button>
      <h1>{{ isEditing ? 'Editar Carrito' : 'Nuevo Carrito' }}</h1>
    </div>

    <!-- Loading state while fetching edit data -->
    <div v-if="initialLoading" class="loading">
      <div class="spinner"></div>
      <p>Cargando datos...</p>
    </div>

    <form v-else class="form-card" @submit.prevent="save">
      <!-- Name -->
      <div class="form-group">
        <label for="car-name">Nombre <span class="required">*</span></label>
        <input
          id="car-name"
          v-model="form.name"
          type="text"
          placeholder="Nombre del carrito"
          :class="{ 'input-error': errors.name }"
        />
        <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
      </div>

      <!-- Category -->
      <div class="form-group">
        <label for="car-category">Categoría <span class="required">*</span></label>
        <select
          id="car-category"
          v-model="form.category"
          :class="{ 'input-error': errors.category }"
        >
          <option value="" disabled>Seleccionar categoría</option>
          <option value="public_car">Public Car</option>
          <option value="public_bus">Public Bus</option>
          <option value="private_car">Private Car</option>
        </select>
        <span v-if="errors.category" class="error-msg">{{ errors.category }}</span>
      </div>

      <!-- Logo Type -->
      <div class="form-group">
        <label for="car-logo">Logo <span class="required">*</span></label>
        <select
          id="car-logo"
          v-model="form.logo_type"
          :class="{ 'input-error': errors.logo_type }"
        >
          <option value="" disabled>Seleccionar logo</option>
          <option v-for="logo in logos" :key="logo.type" :value="logo.type">
            {{ logo.type }}
          </option>
        </select>
        <!-- Preview the selected logo -->
        <div v-if="selectedLogoUrl" class="logo-preview">
          <img :src="selectedLogoUrl" alt="Logo preview" />
        </div>
        <span v-if="errors.logo_type" class="error-msg">{{ errors.logo_type }}</span>
      </div>

      <!-- Schedule -->
      <div class="form-row">
        <div class="form-group half">
          <label for="car-schedule-start">Horario inicio <span class="required">*</span></label>
          <input
            id="car-schedule-start"
            v-model="form.schedule_start"
            type="time"
            :class="{ 'input-error': errors.schedule_start }"
          />
          <span v-if="errors.schedule_start" class="error-msg">{{ errors.schedule_start }}</span>
        </div>
        <div class="form-group half">
          <label for="car-schedule-end">Horario fin <span class="required">*</span></label>
          <input
            id="car-schedule-end"
            v-model="form.schedule_end"
            type="time"
            :class="{ 'input-error': errors.schedule_end }"
          />
          <span v-if="errors.schedule_end" class="error-msg">{{ errors.schedule_end }}</span>
        </div>
      </div>

      <!-- Crowd Status -->
      <div class="form-group">
        <label for="car-crowd">Estado de ocupación <span class="required">*</span></label>
        <select
          id="car-crowd"
          v-model="form.crowd_status"
          :class="{ 'input-error': errors.crowd_status }"
        >
          <option value="" disabled>Seleccionar estado</option>
          <option value="busy">Concurrido</option>
          <option value="mid_busy">Algo concurrido</option>
          <option value="fast">Rápido</option>
        </select>
        <span v-if="errors.crowd_status" class="error-msg">{{ errors.crowd_status }}</span>
      </div>

      <!-- Rating -->
      <div class="form-group">
        <label for="car-rating">Valoración <span class="required">*</span></label>
        <select
          id="car-rating"
          v-model="form.rating"
          :class="{ 'input-error': errors.rating }"
        >
          <option value="" disabled>Seleccionar valoración</option>
          <option value="angry">😠 Angry</option>
          <option value="sad">😕 Sad</option>
          <option value="mid">😐 Mid</option>
          <option value="happy">😊 Happy</option>
        </select>
        <span v-if="errors.rating" class="error-msg">{{ errors.rating }}</span>
      </div>

      <!-- Cost -->
      <div class="form-row">
        <div class="form-group half">
          <label for="car-cost-min">Costo mínimo (Bs) <span class="required">*</span></label>
          <input
            id="car-cost-min"
            v-model.number="form.cost_min"
            type="number"
            min="1"
            step="0.01"
            placeholder="1"
            :class="{ 'input-error': errors.cost_min }"
          />
          <span v-if="errors.cost_min" class="error-msg">{{ errors.cost_min }}</span>
        </div>
        <div class="form-group half">
          <label for="car-cost-max">Costo máximo (Bs) <span class="required">*</span></label>
          <input
            id="car-cost-max"
            v-model.number="form.cost_max"
            type="number"
            min="1"
            step="0.01"
            placeholder="1"
            :class="{ 'input-error': errors.cost_max }"
          />
          <span v-if="errors.cost_max" class="error-msg">{{ errors.cost_max }}</span>
        </div>
      </div>

      <!-- Image URL -->
      <div class="form-group">
        <label for="car-image">URL de imagen (opcional)</label>
        <input
          id="car-image"
          v-model="form.image_url"
          type="text"
          placeholder="https://ejemplo.com/imagen.jpg"
          :class="{ 'input-error': errors.image_url }"
        />
        <span v-if="errors.image_url" class="error-msg">{{ errors.image_url }}</span>
      </div>

      <!-- Route Selection with Drag & Drop -->
      <div class="form-group route-selector">
        <label>Rutas del carrito (arrastra para ordenar)</label>
        <div class="route-panels">
          <!-- Available routes -->
          <div class="route-panel">
            <h4>Disponibles</h4>
            <div class="route-search">
              <input
                v-model="routeSearch"
                type="text"
                placeholder="Buscar ruta..."
              />
            </div>
            <draggable
              v-model="availableRoutes"
              :group="{ name: 'routes', pull: 'clone', put: false }"
              item-key="id"
              class="route-list available-list"
              :clone="cloneRoute"
              :sort="false"
            >
              <template #item="{ element }">
                <div class="route-item available" @click="addRoute(element)">
                  <span class="route-name">{{ element.stop_name }}</span>
                  <span class="route-title-sub">{{ element.title }}</span>
                  <span class="add-icon">+</span>
                </div>
              </template>
            </draggable>
          </div>

          <!-- Selected routes (orderable) -->
          <div class="route-panel">
            <h4>Seleccionadas ({{ selectedRoutes.length }})</h4>
            <draggable
              v-model="selectedRoutes"
              group="routes-selected"
              item-key="id"
              class="route-list selected-list"
              handle=".drag-handle"
              animation="200"
            >
              <template #item="{ element, index }">
                <div class="route-item selected">
                  <span class="drag-handle">☰</span>
                  <span class="route-order">{{ index + 1 }}</span>
                  <span class="route-name">{{ element.stop_name }}</span>
                  <button type="button" class="remove-btn" @click="removeRoute(index)">✕</button>
                </div>
              </template>
            </draggable>
            <p v-if="selectedRoutes.length === 0" class="empty-msg">
              Haz clic en una ruta disponible o arrástrala aquí
            </p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="form-actions">
        <button type="button" class="btn btn-cancel" @click="handleCancel" :disabled="saving">
          Cancelar
        </button>
        <button type="submit" class="btn btn-save" :disabled="saving">
          <span v-if="saving" class="btn-spinner"></span>
          {{ saving ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
import draggable from 'vuedraggable'

// ─── Props & Emits ───────────────────────────────────────────
const props = defineProps({
  id: { type: String, default: null }
})
const emit = defineEmits(['saved', 'cancel'])
const router = useRouter()

// ─── State ───────────────────────────────────────────────────
const isEditing = computed(() => !!props.id)
const initialLoading = ref(false)
const saving = ref(false)

// Toast notification
const toast = ref({ show: false, message: '', type: 'success' })
let toastTimer = null

const showToast = (message, type = 'success') => {
  clearTimeout(toastTimer)
  toast.value = { show: true, message, type }
  toastTimer = setTimeout(() => { toast.value.show = false }, 3500)
}

// Form data
const form = ref({
  name: '',
  category: '',
  logo_type: '',
  schedule_start: '',
  schedule_end: '',
  crowd_status: '',
  rating: '',
  cost_min: null,
  cost_max: null,
  image_url: ''
})

// Validation errors
const errors = ref({})

// Lookup data
const logos = ref([])
const allRoutes = ref([])        // All routes from DB
const selectedRoutes = ref([])   // Routes chosen by the user (ordered)
const routeSearch = ref('')

// Available routes = all routes minus already-selected ones, filtered by search
const availableRoutes = computed({
  get() {
    const selectedIds = new Set(selectedRoutes.value.map(r => r.id))
    let filtered = allRoutes.value.filter(r => !selectedIds.has(r.id))
    if (routeSearch.value.trim()) {
      const q = routeSearch.value.toLowerCase()
      filtered = filtered.filter(r =>
        r.stop_name.toLowerCase().includes(q) || r.title?.toLowerCase().includes(q)
      )
    }
    return filtered
  },
  set() { /* draggable requires a setter but we don't mutate available list */ }
})

// Computed: preview URL for the currently selected logo
const selectedLogoUrl = computed(() => {
  if (!form.value.logo_type) return null
  const match = logos.value.find(l => l.type === form.value.logo_type)
  return match?.url || null
})

// ─── Data Fetching ───────────────────────────────────────────
onMounted(async () => {
  initialLoading.value = true
  try {
    // Fetch logos and routes in parallel
    const [logosRes, routesRes] = await Promise.all([
      supabase.from('logos').select('type, url'),
      supabase.from('routes').select('id, stop_name, title').order('stop_name')
    ])

    if (logosRes.error) throw logosRes.error
    if (routesRes.error) throw routesRes.error

    logos.value = logosRes.data || []
    allRoutes.value = routesRes.data || []

    // If editing, fetch the car and prefill
    if (props.id) {
      const { data: car, error: carErr } = await supabase
        .from('cars')
        .select('*')
        .eq('id', props.id)
        .single()

      if (carErr) throw carErr

      // Prefill the form
      form.value = {
        name: car.name || '',
        category: car.category || '',
        logo_type: car.logo_type || '',
        schedule_start: car.schedule_start || '',
        schedule_end: car.schedule_end || '',
        crowd_status: car.crowd_status || '',
        rating: car.rating || '',
        cost_min: car.cost_min,
        cost_max: car.cost_max,
        image_url: car.image_url || ''
      }

      // Prefill selected routes in saved order
      if (car.route_ids && car.route_ids.length > 0) {
        const routeMap = new Map(allRoutes.value.map(r => [r.id, r]))
        selectedRoutes.value = car.route_ids
          .map(rid => routeMap.get(rid))
          .filter(Boolean) // skip any route_ids that no longer exist
      }
    }
  } catch (err) {
    console.error('Error loading form data:', err)
    if (err.status === 403 || err.code === '42501') {
      await authStore.fetchUserRole()
      showToast('Error de permisos al cargar datos.', 'error')
    } else {
      showToast('Error al cargar datos: ' + (err.message || err), 'error')
    }
  } finally {
    initialLoading.value = false
  }
})

// ─── Route Helpers ───────────────────────────────────────────
const cloneRoute = (original) => ({ ...original })

const addRoute = (route) => {
  // Prevent duplicates
  if (!selectedRoutes.value.find(r => r.id === route.id)) {
    selectedRoutes.value.push({ ...route })
  }
}

const removeRoute = (index) => {
  selectedRoutes.value.splice(index, 1)
}

// ─── Validation ──────────────────────────────────────────────
const isValidUrl = (str) => {
  if (!str) return true // optional field passes
  try { new URL(str); return true } catch { return false }
}

const validate = () => {
  const e = {}

  if (!form.value.name?.trim()) e.name = 'El nombre es requerido'
  if (!form.value.category) e.category = 'La categoría es requerida'
  if (!form.value.logo_type) e.logo_type = 'El logo es requerido'
  if (!form.value.schedule_start) e.schedule_start = 'Horario inicio es requerido'
  if (!form.value.schedule_end) e.schedule_end = 'Horario fin es requerido'

  // schedule_end must be after schedule_start
  if (form.value.schedule_start && form.value.schedule_end) {
    if (form.value.schedule_end <= form.value.schedule_start) {
      e.schedule_end = 'Debe ser mayor que el horario de inicio'
    }
  }

  if (!form.value.crowd_status) e.crowd_status = 'El estado es requerido'
  if (!form.value.rating) e.rating = 'La valoración es requerida'

  if (form.value.cost_min == null || form.value.cost_min < 1) {
    e.cost_min = 'Mínimo debe ser al menos 1'
  }
  if (form.value.cost_max == null || form.value.cost_max < 1) {
    e.cost_max = 'Máximo debe ser al menos 1'
  }
  if (
    form.value.cost_min != null &&
    form.value.cost_max != null &&
    form.value.cost_max < form.value.cost_min
  ) {
    e.cost_max = 'Debe ser mayor o igual al costo mínimo'
  }

  if (form.value.image_url && !isValidUrl(form.value.image_url)) {
    e.image_url = 'URL inválida'
  }

  errors.value = e
  return Object.keys(e).length === 0
}

// ─── Save ────────────────────────────────────────────────────
const save = async () => {
  if (!validate()) {
    showToast('Por favor corrige los errores del formulario', 'error')
    return
  }

  saving.value = true
  try {
    const payload = {
      name: form.value.name.trim(),
      category: form.value.category,
      logo_type: form.value.logo_type,
      schedule_start: form.value.schedule_start,
      schedule_end: form.value.schedule_end,
      crowd_status: form.value.crowd_status,
      rating: form.value.rating,
      cost_min: form.value.cost_min,
      cost_max: form.value.cost_max,
      image_url: form.value.image_url?.trim() || null,
      route_ids: selectedRoutes.value.map(r => r.id)
    }

    let result
    if (isEditing.value) {
      result = await supabase
        .from('cars')
        .update(payload)
        .eq('id', props.id)
        .select()
    } else {
      result = await supabase
        .from('cars')
        .insert(payload)
        .select()
    }

    if (result.error) throw result.error

    showToast(
      isEditing.value ? 'Carrito actualizado exitosamente ✓' : 'Carrito creado exitosamente ✓',
      'success'
    )
    emit('saved', result.data?.[0])

    // After a short delay, navigate back
    setTimeout(() => {
      router.push('/home')
    }, 1500)
  } catch (err) {
    console.error('Error saving car:', err)
    
    // If we get a 403, it might be that our role in the store is stale
    if (err.status === 403 || err.code === '42501') {
      await authStore.fetchUserRole()
      showToast('Error de permisos. Se ha actualizado tu perfil.', 'error')
    } else {
      showToast('Error al guardar: ' + (err.message || err), 'error')
    }
  } finally {
    saving.value = false
  }
}

// ─── Cancel ──────────────────────────────────────────────────
const handleCancel = () => {
  emit('cancel')
  router.back()
}
</script>

<style scoped lang="scss">
@use 'sass:color';
@use '@/assets/styles/variables' as *;

/* ── Toast ─────────────────────────────────────────────────── */
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 28px;
  border-radius: $radius-sm;
  font-size: 14px;
  font-weight: 600;
  z-index: 9999;
  box-shadow: $shadow-lg;
  color: $white;

  &.success { background: $green; }
  &.error   { background: $red; }
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-12px);
}

/* ── Page Layout ───────────────────────────────────────────── */
.car-form-view {
  max-width: 680px;
  margin: 0 auto;
  padding: 20px 16px 100px;
}

.form-header {
  margin-bottom: 24px;

  h1 {
    margin: 12px 0 0;
    font-size: 24px;
    font-weight: 800;
    color: $black;
  }
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

/* ── Form Card ─────────────────────────────────────────────── */
.form-card {
  background: $white;
  border-radius: $radius-md;
  padding: 24px;
  box-shadow: $shadow-md;
}

/* ── Form Group ────────────────────────────────────────────── */
.form-group {
  margin-bottom: 20px;

  label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #555;
    margin-bottom: 6px;
  }
}

.required { color: $red; }

input[type="text"],
input[type="number"],
input[type="time"],
select,
textarea {
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  border: 1.5px solid #ddd;
  border-radius: $radius-sm;
  background: #fafafa;
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: $font-sans;

  &:focus {
    outline: none;
    border-color: $blue-gray;
    box-shadow: 0 0 0 3px rgba(89, 110, 121, 0.15);
  }

  &.input-error {
    border-color: $red;
    box-shadow: 0 0 0 3px rgba(255, 129, 129, 0.2);
  }
}

.error-msg {
  display: block;
  font-size: 12px;
  color: $red;
  margin-top: 4px;
}

/* ── Form Row (side-by-side) ───────────────────────────────── */
.form-row {
  display: flex;
  gap: 16px;
}

.half {
  flex: 1;
}

/* ── Logo Preview ──────────────────────────────────────────── */
.logo-preview {
  margin-top: 8px;

  img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #eee;
  }
}

/* ── Route Selector ────────────────────────────────────────── */
.route-selector {
  label {
    margin-bottom: 12px;
  }
}

.route-panels {
  display: flex;
  gap: 16px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
}

.route-panel {
  flex: 1;
  border: 1.5px solid #e8e8e8;
  border-radius: $radius-sm;
  padding: 12px;
  background: #fafafa;
  min-height: 200px;

  h4 {
    margin: 0 0 10px;
    font-size: 13px;
    font-weight: 700;
    color: $blue-gray;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.route-search input {
  width: 100%;
  padding: 6px 10px;
  margin-bottom: 8px;
  font-size: 13px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.route-list {
  max-height: 300px;
  overflow-y: auto;
}

.route-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  margin-bottom: 4px;
  border-radius: 8px;
  font-size: 13px;
  transition: background 0.15s;

  &.available {
    background: $white;
    border: 1px solid #eee;
    cursor: pointer;

    &:hover {
      background: #e3f2fd;
      border-color: #90caf9;
    }
  }

  &.selected {
    background: $white;
    border: 1px solid #c8e6c9;
  }
}

.route-name {
  font-weight: 600;
  flex-shrink: 0;
}

.route-title-sub {
  color: #999;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.add-icon {
  margin-left: auto;
  font-size: 18px;
  font-weight: 700;
  color: $green;
  flex-shrink: 0;
}

.drag-handle {
  cursor: grab;
  color: #bbb;
  font-size: 16px;
  flex-shrink: 0;

  &:active { cursor: grabbing; }
}

.route-order {
  background: $blue-gray;
  color: $white;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}

.remove-btn {
  margin-left: auto;
  background: none;
  border: none;
  color: $red;
  font-size: 16px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  flex-shrink: 0;

  &:hover { background: rgba(255, 129, 129, 0.15); }
}

.empty-msg {
  font-size: 12px;
  color: #bbb;
  text-align: center;
  padding: 20px 0;
}

/* ── Actions ───────────────────────────────────────────────── */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.btn {
  padding: 10px 28px;
  border: none;
  border-radius: $radius-sm;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s, opacity 0.2s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.btn-cancel {
  background: #eee;
  color: #555;

  &:hover:not(:disabled) { background: #ddd; }
}

.btn-save {
  background: $blue-gray;
  color: $white;

  &:hover:not(:disabled) { background: color.adjust($blue-gray, $lightness: -8%); }
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: $white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

/* ── Loading ───────────────────────────────────────────────── */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid $blue-gray;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ── Responsive ────────────────────────────────────────────── */
@media (max-width: 480px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .form-actions {
    flex-direction: column;

    .btn { width: 100%; justify-content: center; }
  }
}
</style>
