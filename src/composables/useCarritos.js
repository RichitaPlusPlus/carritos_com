import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
export function useCarritos() {
  const loading = ref(false)
  const error = ref(null)

  // 1. Función para traer TODOS los carritos
  const fetchAllCars = async () => {
    loading.value = true
    try {
      const { data, error: supabaseError } = await supabase
        .from('cars') // ← Nombre de tu tabla
        .select(`
          *,
          logo_type (*) // ← Esto trae los datos del logo relacionado
        `)
        .order('name')

      if (supabaseError) throw supabaseError
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching cars:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  // 2. Función para traer las RUTAS de un carrito específico
  const fetchRoutesByCarId = async (carId) => {
    loading.value = true
    try {
      const { data, error: supabaseError } = await supabase
        .from('routes')
        .select(`
          *,
          route_attributes (
            attributes (*)
          )
        `)
        .eq('car_id', carId) // ← Filtra por ID del carrito
        .order('orden') // ← Ordena por el campo "orden"

      if (supabaseError) throw supabaseError
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching routes:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  // 3. Función para traer los DETALLES de UNA parada específica
  const fetchStopDetails = async (routeId) => {
    loading.value = true
    try {
      const { data, error: supabaseError } = await supabase
        .from('routes')
        .select(`
          *,
          cars (*, logos (*)),
          route_attributes (
            attributes (*)
          )
        `)
        .eq('id', routeId)
        .single() // ← Asegura que solo trae un registro

      if (supabaseError) throw supabaseError
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching stop details:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    fetchAllCars,
    fetchRoutesByCarId,
    fetchStopDetails
  }
}
