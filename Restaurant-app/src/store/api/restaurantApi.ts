import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Restaurant {
  _id?: string // MongoDB _id
  id?: string // For compatibility
  name: string
  image: string
  rating: number
  cuisineType: string
  priceRange: string
  location: string
  description: string
  menu: MenuItem[]
}

export interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image?: string
  category: string
}

export interface Cuisine {
  id: number
  name: string
  image: string
}

// Backend API configuration
// Use environment variable or default to MockAPI.io
const baseUrl = import.meta.env.VITE_API_URL || 'https://690dc4e6bd0fefc30a0241c0.mockapi.io/api/v1'

export const restaurantApi = createApi({
  reducerPath: 'restaurantApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    // Add error handling
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['Restaurant', 'Cuisine'],
  endpoints: (builder) => ({
    getRestaurants: builder.query<Restaurant[], void>({
      query: () => '/restaurants',
      transformResponse: (response: any): Restaurant[] => {
        // Handle MockAPI.io response structure
        // If response is an array with a nested restaurants property (legacy support)
        if (Array.isArray(response) && response.length > 0 && response[0]?.restaurants) {
          const restaurants = response[0].restaurants || []
          return restaurants.map((restaurant: any, index: number) => ({
            ...restaurant,
            id: restaurant._id || restaurant.id || String(restaurant.id) || String(index + 1),
          }))
        }
        // If response is a direct array of restaurants (correct structure)
        if (Array.isArray(response)) {
          return response.map((restaurant: any, index: number) => ({
            ...restaurant,
            id: restaurant._id || restaurant.id || String(restaurant.id) || String(index + 1),
          }))
        }
        // Fallback
        return []
      },
      providesTags: ['Restaurant'],
    }),
    getRestaurantById: builder.query<Restaurant, string>({
      query: (id) => `/restaurants/${id}`,
      transformResponse: (restaurant: Restaurant): Restaurant => {
        // Transform MongoDB _id to id for compatibility
        return {
          ...restaurant,
          id: restaurant._id || restaurant.id,
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'Restaurant', id }],
    }),
    getCuisines: builder.query<Cuisine[], void>({
      // Try cuisines endpoint first, but extract from restaurants if it doesn't exist
      queryFn: async (_arg, _api, _extraOptions, baseQuery) => {
        // First try to get cuisines resource
        const cuisinesResult = await baseQuery('/cuisines')
        
        // If cuisines resource exists and returns data (not an error)
        if (!cuisinesResult.error && cuisinesResult.data && Array.isArray(cuisinesResult.data) && cuisinesResult.data.length > 0) {
          return { data: cuisinesResult.data as Cuisine[] }
        }
        
        // If cuisines resource doesn't exist or failed, extract from restaurants
        const restaurantsResult = await baseQuery('/restaurants')
        
        if (!restaurantsResult.error && restaurantsResult.data && Array.isArray(restaurantsResult.data)) {
          // Cuisine image mapping - proper Unsplash URLs for each cuisine type
          const cuisineImages: Record<string, string> = {
            'Italian': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
            'Japanese': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
            'Mexican': 'https://images.unsplash.com/photo-1565299585323-38174c2b3c44?w=400',
            'Chinese': 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400',
            'French': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
            'Indian': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
            'Thai': 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400',
            'Mediterranean': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
            'Korean': 'https://images.unsplash.com/photo-1606787619248-f301830a5a57?w=400',
            'American': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
            'Greek': 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400',
            'Spanish': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
            'Vietnamese': 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400',
          }
          
          // Extract unique cuisines from restaurants
          const cuisineMap = new Map<string, Cuisine>()
          let index = 1
          
          restaurantsResult.data.forEach((restaurant: any) => {
            if (restaurant.cuisineType && !cuisineMap.has(restaurant.cuisineType)) {
              cuisineMap.set(restaurant.cuisineType, {
                id: index++,
                name: restaurant.cuisineType,
                image: cuisineImages[restaurant.cuisineType] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
              })
            }
          })
          
          return { data: Array.from(cuisineMap.values()) }
        }
        
        // Fallback: return empty array
        return { data: [] }
      },
      providesTags: ['Cuisine'],
    }),
    getRestaurantsByCuisine: builder.query<Restaurant[], string>({
      // MockAPI.io uses query parameters for filtering
      query: (cuisineType) => `/restaurants?cuisineType=${encodeURIComponent(cuisineType)}`,
      transformResponse: (response: any, _meta, arg): Restaurant[] => {
        const cuisineType = arg // Get cuisineType from query argument
        // Handle MockAPI.io response structure
        // If response is an array with a nested restaurants property (legacy support)
        if (Array.isArray(response) && response.length > 0 && response[0]?.restaurants) {
          const restaurants = response[0].restaurants || []
          return restaurants
            .filter((r: any) => r.cuisineType === cuisineType)
            .map((restaurant: any, index: number) => ({
              ...restaurant,
              id: restaurant._id || restaurant.id || String(restaurant.id) || String(index + 1),
            }))
        }
        // If response is a direct array of restaurants (correct structure)
        if (Array.isArray(response)) {
          return response.map((restaurant: any, index: number) => ({
            ...restaurant,
            id: restaurant._id || restaurant.id || String(restaurant.id) || String(index + 1),
          }))
        }
        // Fallback
        return []
      },
      providesTags: ['Restaurant'],
    }),
  }),
})

export const {
  useGetRestaurantsQuery,
  useGetRestaurantByIdQuery,
  useGetCuisinesQuery,
  useGetRestaurantsByCuisineQuery,
} = restaurantApi

