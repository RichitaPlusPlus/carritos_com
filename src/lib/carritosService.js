import { supabase } from './supabaseClient'

export const carritosService = {
  /**
   * Fetch all cars with their logos
   */
  async getAllCars() {
    const { data: cars, error } = await supabase
      .from('cars')
      .select(`
        *,
        logos:logo_type (
          type,
          url
        )
      `)
      .order('name')

    if (error) {
      console.error('Error fetching cars:', error)
      throw error
    }

    return cars
  },

  /**
   * Fetch a single car with its ordered routes and attributes
   * @param {string} carId - UUID of the car
   */
  async getCarWithOrderedRoutes(carId) {
    // 1. Fetch the car
    const { data: car, error: carError } = await supabase
      .from('cars')
      .select(`
        *,
        logos:logo_type (
          type,
          url
        )
      `)
      .eq('id', carId)
      .single()

    if (carError) {
      console.error('Error fetching car:', carError)
      throw carError
    }

    // If no route_ids, return car with empty routes
    if (!car.route_ids || car.route_ids.length === 0) {
      return { car, routes: [] }
    }

    // 2. Fetch all routes for this car (unordered)
    const { data: routes, error: routesError } = await supabase
      .from('routes')
      .select(`
        *,
        route_attributes (
          attribute:attributes (
            type,
            label
          )
        )
      `)
      .in('id', car.route_ids)

    if (routesError) {
      console.error('Error fetching routes:', routesError)
      throw routesError
    }

    // 3. Create a map for quick lookup
    const routeMap = new Map()
    routes.forEach(route => {
      routeMap.set(route.id, route)
    })

    // 4. Sort routes according to route_ids array
    const orderedRoutes = []
    for (const routeId of car.route_ids) {
      const route = routeMap.get(routeId)
      if (route) {
        // Flatten attributes
        route.attributes = route.route_attributes?.map(ra => ra.attribute) || []
        delete route.route_attributes // Clean up
        orderedRoutes.push(route)
      }
    }

    return { car, routes: orderedRoutes }
  },

  /**
   * Fetch app settings (dollar rate)
   */
  async getSettings() {
    const { data, error } = await supabase
      .from('settings')
      .select('dollar_rate')
      .single()

    if (error) {
      console.error('Error fetching settings:', error)
      throw error
    }

    return data
  },

  /**
   * Convert Bs to USD using current rate
   */
  async convertBsToUsd(bsAmount) {
    try {
      const settings = await this.getSettings()
      return (bsAmount / settings.dollar_rate).toFixed(2)
    } catch (error) {
      console.error('Error converting currency:', error)
      return null
    }
  }
}
