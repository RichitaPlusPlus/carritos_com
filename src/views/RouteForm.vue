<template>
  <div class="route-form-view">
    <!-- Toast notification -->
    <Transition name="toast-fade">
      <div v-if="toast.show" class="toast" :class="toast.type">
        {{ toast.message }}
      </div>
    </Transition>

    <div class="form-header">
      <button class="back-btn" @click="handleCancel">← Volver</button>
      <h1>{{ isEditing ? 'Editar Ruta' : 'Nueva Ruta' }}</h1>
    </div>

    <!-- Loading state while fetching edit data -->
    <div v-if="initialLoading" class="loading">
      <div class="spinner"></div>
      <p>Cargando datos...</p>
    </div>

    <form v-else class="form-card" @submit.prevent="save">
      <!-- Stop Name -->
      <div class="form-group">
        <label for="route-stop-name">Nombre de parada <span class="required">*</span></label>
        <input
          id="route-stop-name"
          v-model="form.stop_name"
          type="text"
          placeholder="Ej: Parada Central"
          :class="{ 'input-error': errors.stop_name }"
        />
        <span v-if="errors.stop_name" class="error-msg">{{ errors.stop_name }}</span>
      </div>

      <!-- Title -->
      <div class="form-group">
        <label for="route-title">Título <span class="required">*</span></label>
        <input
          id="route-title"
          v-model="form.title"
          type="text"
          placeholder="Ej: Terminal de pasajeros"
          :class="{ 'input-error': errors.title }"
        />
        <span v-if="errors.title" class="error-msg">{{ errors.title }}</span>
      </div>

      <!-- Description -->
      <div class="form-group">
        <label for="route-description">Descripción (opcional)</label>
        <textarea
          id="route-description"
          v-model="form.description"
          rows="3"
          placeholder="Descripción de la ruta o parada..."
        ></textarea>
      </div>

      <!-- Wait Time -->
      <div class="form-group">
        <label for="route-wait-time">Tiempo de espera <span class="required">*</span></label>
        <select
          id="route-wait-time"
          v-model="form.wait_time"
          :class="{ 'input-error': errors.wait_time }"
        >
          <option value="" disabled>Seleccionar tiempo</option>
          <option value="long_wait">⏳ Larga espera</option>
          <option value="mid_wait">⏱️ Mediana espera</option>
          <option value="short_wait">⚡ Corta espera</option>
        </select>
        <span v-if="errors.wait_time" class="error-msg">{{ errors.wait_time }}</span>
      </div>

      <!-- Location Status -->
      <div class="form-group">
        <label for="route-location">Estado de la zona <span class="required">*</span></label>
        <select
          id="route-location"
          v-model="form.location_status"
          :class="{ 'input-error': errors.location_status }"
        >
          <option value="" disabled>Seleccionar estado</option>
          <option value="horrible">🚫 Horrible</option>
          <option value="regular">😐 Regular</option>
          <option value="good">✅ Buena</option>
        </select>
        <span v-if="errors.location_status" class="error-msg">{{ errors.location_status }}</span>
      </div>

      <!-- GPS URL -->
      <div class="form-group">
        <label for="route-gps">URL GPS (opcional)</label>
        <input
          id="route-gps"
          v-model="form.gps_url"
          type="text"
          placeholder="https://maps.google.com/..."
          :class="{ 'input-error': errors.gps_url }"
        />
        <span v-if="errors.gps_url" class="error-msg">{{ errors.gps_url }}</span>
      </div>

      <!-- Image URL -->
      <div class="form-group">
        <label for="route-image">URL de imagen (opcional)</label>
        <input
          id="route-image"
          v-model="form.image_url"
          type="text"
          placeholder="https://ejemplo.com/imagen.jpg"
          :class="{ 'input-error': errors.image_url }"
        />
        <span v-if="errors.image_url" class="error-msg">{{ errors.image_url }}</span>
      </div>

      <!-- Address Text -->
      <div class="form-group">
        <label for="route-address">Dirección (opcional)</label>
        <input
          id="route-address"
          v-model="form.address_text"
          type="text"
          placeholder="Ej: Av. Principal, frente al mercado"
        />
      </div>

      <!-- Order Index -->
      <div class="form-group">
        <label for="route-order">Orden (opcional)</label>
        <input
          id="route-order"
          v-model.number="form.order_index"
          type="number"
          min="0"
          placeholder="0"
        />
      </div>

      <!-- Attributes (checkbox group) -->
      <div class="form-group">
        <label>Atributos</label>
        <div class="attributes-grid" v-if="allAttributes.length > 0">
          <label
            v-for="attr in allAttributes"
            :key="attr.id"
            class="attribute-checkbox"
            :class="{ 'checked': selectedAttributeIds.has(attr.id) }"
          >
            <input
              type="checkbox"
              :value="attr.id"
              :checked="selectedAttributeIds.has(attr.id)"
              @change="toggleAttribute(attr.id)"
            />
            <span class="checkbox-icon">{{ getAttributeIcon(attr.label) }}</span>
            <span class="checkbox-label">{{ attr.label }}</span>
          </label>
        </div>
        <p v-else class="empty-msg">No hay atributos disponibles.</p>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'

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
  stop_name: '',
  title: '',
  description: '',
  wait_time: '',
  location_status: '',
  gps_url: '',
  image_url: '',
  address_text: '',
  order_index: null
})

// Validation errors
const errors = ref({})

// Attributes
const allAttributes = ref([])
const selectedAttributeIds = reactive(new Set())

// ─── Data Fetching ───────────────────────────────────────────
onMounted(async () => {
  initialLoading.value = true
  try {
    // Fetch available attributes
    const { data: attrs, error: attrsErr } = await supabase
      .from('attributes')
      .select('id, label')
      .order('label')

    if (attrsErr) throw attrsErr
    allAttributes.value = attrs || []

    // If editing, fetch route data + its linked attributes
    if (props.id) {
      const [routeRes, raRes] = await Promise.all([
        supabase.from('routes').select('*').eq('id', props.id).single(),
        supabase.from('route_attributes').select('attribute_id').eq('route_id', props.id)
      ])

      if (routeRes.error) throw routeRes.error
      if (raRes.error) throw raRes.error

      const routeData = routeRes.data

      // Prefill form
      form.value = {
        stop_name: routeData.stop_name || '',
        title: routeData.title || '',
        description: routeData.description || '',
        wait_time: routeData.wait_time || '',
        location_status: routeData.location_status || '',
        gps_url: routeData.gps_url || '',
        image_url: routeData.image_url || '',
        address_text: routeData.address_text || '',
        order_index: routeData.order_index
      }

      // Prefill selected attributes
      if (raRes.data) {
        raRes.data.forEach(ra => selectedAttributeIds.add(ra.attribute_id))
      }
    }
  } catch (err) {
    console.error('Error loading route form data:', err)
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

// ─── Attribute Helpers ───────────────────────────────────────
const toggleAttribute = (attrId) => {
  if (selectedAttributeIds.has(attrId)) {
    selectedAttributeIds.delete(attrId)
  } else {
    selectedAttributeIds.add(attrId)
  }
}

/** Map attribute labels to emoji icons */
const getAttributeIcon = (label) => {
  const lower = (label || '').toLowerCase()
  if (lower.includes('silla') || lower.includes('chair')) return '🪑'
  if (lower.includes('techo') || lower.includes('roof')) return '🏠'
  if (lower.includes('luz') || lower.includes('light')) return '💡'
  if (lower.includes('tienda') || lower.includes('store')) return '🏪'
  if (lower.includes('calor') || lower.includes('hot')) return '☀️'
  if (lower.includes('tarifa') || lower.includes('fare')) return '💸'
  if (lower.includes('vigilancia') || lower.includes('vigilan')) return '🦺'
  if (lower.includes('ruta') || lower.includes('route')) return '🛣️'
  if (lower.includes('personal') || lower.includes('accesib')) return '♿'
  return '✨'
}

// ─── Validation ──────────────────────────────────────────────
const isValidUrl = (str) => {
  if (!str) return true
  try { new URL(str); return true } catch { return false }
}

const validate = () => {
  const e = {}

  if (!form.value.stop_name?.trim()) e.stop_name = 'El nombre de parada es requerido'
  if (!form.value.title?.trim()) e.title = 'El título es requerido'
  if (!form.value.wait_time) e.wait_time = 'El tiempo de espera es requerido'
  if (!form.value.location_status) e.location_status = 'El estado de la zona es requerido'

  if (form.value.gps_url && !isValidUrl(form.value.gps_url)) {
    e.gps_url = 'URL inválida'
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
      stop_name: form.value.stop_name.trim(),
      title: form.value.title.trim(),
      description: form.value.description?.trim() || null,
      wait_time: form.value.wait_time,
      location_status: form.value.location_status,
      gps_url: form.value.gps_url?.trim() || null,
      image_url: form.value.image_url?.trim() || null,
      address_text: form.value.address_text?.trim() || null,
      order_index: form.value.order_index ?? null
    }

    let routeId

    // 1. Insert or update the route
    if (isEditing.value) {
      const { error: upErr } = await supabase
        .from('routes')
        .update(payload)
        .eq('id', props.id)
        .select()

      if (upErr) throw upErr
      routeId = props.id
    } else {
      const { data: insertedData, error: insErr } = await supabase
        .from('routes')
        .insert(payload)
        .select()

      if (insErr) throw insErr
      routeId = insertedData[0].id
    }

    // 2. Sync attributes: delete existing, then insert selected
    const { error: delErr } = await supabase
      .from('route_attributes')
      .delete()
      .eq('route_id', routeId)

    if (delErr) throw delErr

    if (selectedAttributeIds.size > 0) {
      const insertRows = [...selectedAttributeIds].map(attrId => ({
        route_id: routeId,
        attribute_id: attrId
      }))

      const { error: insAttrErr } = await supabase
        .from('route_attributes')
        .insert(insertRows)

      if (insAttrErr) throw insAttrErr
    }

    showToast(
      isEditing.value ? 'Ruta actualizada exitosamente ✓' : 'Ruta creada exitosamente ✓',
      'success'
    )
    emit('saved', { id: routeId })

    // Navigate back after a short delay
    setTimeout(() => {
      router.push('/routes')
    }, 1500)
  } catch (err) {
    console.error('Error saving route:', err)
    
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
.route-form-view {
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
  resize: vertical;

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

/* ── Attributes Grid ───────────────────────────────────────── */
.attributes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
}

.attribute-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1.5px solid #e8e8e8;
  border-radius: $radius-sm;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.15s, border-color 0.15s;
  user-select: none;
  background: #fafafa;

  &:hover {
    background: #f0f0f0;
  }

  &.checked {
    background: #e8f5e9;
    border-color: $green;
  }

  input[type="checkbox"] {
    width: auto;
    margin: 0;
    accent-color: $green;
  }
}

.checkbox-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.checkbox-label {
  font-weight: 500;
  color: #444;
}

.empty-msg {
  font-size: 12px;
  color: #bbb;
  text-align: center;
  padding: 12px 0;
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
  .attributes-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;

    .btn { width: 100%; justify-content: center; }
  }
}
</style>
