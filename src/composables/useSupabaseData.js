import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'

export function useSupabaseData() {
  const loading = ref(false)
  const error = ref(null)

  // Fetch all cars with their logo
  const fetchCars = async () => {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('cars')
        .select(`
          *,
          logos (
            url,
            type
          )
        `)

      if (err) throw err
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching cars:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  // Fetch routes for a specific car
  // Since the relationship is stored in cars.route_ids (array),
  // we first fetch the car to get the IDs, then fetch the routes.
  const fetchCarRoutes = async (carId) => {
    loading.value = true
    error.value = null
    try {
      // 1. Get the route_ids from the car
      const { data: carData, error: carError } = await supabase
        .from('cars')
        .select(`
          *,
          logos (
            url,
            type
          )
        `)
        .eq('id', carId)
        .single()

      if (carError) throw carError
      if (!carData || !carData.route_ids || carData.route_ids.length === 0) {
        return { car: carData, routes: [] }
      }

      // 2. Fetch the routes based on the IDs
      // We also fetch connected attributes via route_attributes
      const { data: routesData, error: routesError } = await supabase
        .from('routes')
        .select(`
          *,
          route_attributes (
            attributes (
              *
            )
          )
        `)
        .in('id', carData.route_ids)
        .order('order_index', { ascending: true })

      if (routesError) throw routesError

      return { car: carData, routes: routesData }
    } catch (err) {
      error.value = err.message
      console.error('Error fetching car routes:', err)
      return { car: null, routes: [] }
    } finally {
      loading.value = false
    }
  }

  // Fetch a single stop (route) detail
  const fetchStopDetails = async (routeId) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('routes')
        .select(`
          *,
          route_attributes (
            attributes (
              *
            )
          )
        `)
        .eq('id', routeId)
        .single()

      if (err) throw err
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching stop details:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Fetch the dollar rate
  const fetchDollarRate = async () => {
    // Usually no loading state needed for this small fetch if handled silently,
    // but we'll respect the pattern.
    try {
      const { data, error: err } = await supabase
        .from('settings')
        .select('dollar_rate')
        .single()

      if (err) throw err
      return data?.dollar_rate || 0
    } catch (err) {
      console.error('Error fetching dollar rate:', err)
      return 0
    }
  }

  return {
    loading,
    error,
    fetchCars,
    fetchCarRoutes,
    fetchStopDetails,
    fetchDollarRate
  }
}
