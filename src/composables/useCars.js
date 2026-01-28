import { ref } from 'vue'
import { carritosService } from '@/lib/carritosService'

export function useCars() {
  const cars = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchCars = async () => {
    loading.value = true
    error.value = null
    try {
      cars.value = await carritosService.getAllCars()
    } catch (err) {
      console.error(err)
      error.value = 'Failed to load cars'
    } finally {
      loading.value = false
    }
  }

  return {
    cars,
    loading,
    error,
    fetchCars
  }
}
