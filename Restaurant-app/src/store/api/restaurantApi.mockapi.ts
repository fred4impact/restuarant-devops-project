// MockAPI.io version of restaurantApi.ts
// Copy this to restaurantApi.ts if using MockAPI.io

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Restaurant {
  id?: string // MockAPI.io uses string IDs
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

// MockAPI.io configuration
// Replace [your-project-id] with your actual MockAPI.io project ID
const baseUrl = import.meta.env.VITE_API_URL || 'https://[your-project-id].mockapi.io/api/v1'

export const restaurantApi = createApi({
  reducerPath: 'restaurantApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  tagTypes: ['Restaurant', 'Cuisine'],
  endpoints: (builder) => ({
    getRestaurants: builder.query<Restaurant[], void>({
      query: () => '/restaurants',
      providesTags: ['Restaurant'],
    }),
    getRestaurantById: builder.query<Restaurant, string>({
      query: (id) => `/restaurants/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Restaurant', id }],
    }),
    getCuisines: builder.query<Cuisine[], void>({
      // Option 1: If you created a separate cuisines resource in MockAPI.io
      query: () => '/cuisines',
      // Option 2: Extract from restaurants (uncomment if not using cuisines resource)
      // query: () => '/restaurants',
      // transformResponse: (response: Restaurant[]): Cuisine[] => {
      //   const cuisineMap = new Map<string, Cuisine>()
      //   response.forEach((restaurant, index) => {
      //     if (!cuisineMap.has(restaurant.cuisineType)) {
      //       cuisineMap.set(restaurant.cuisineType, {
      //         id: cuisineMap.size + 1,
      //         name: restaurant.cuisineType,
      //         image: `https://images.unsplash.com/photo-${1500000000000 + index}?w=400`,
      //       })
      //     }
      //   })
      //   return Array.from(cuisineMap.values())
      // },
      providesTags: ['Cuisine'],
    }),
    getRestaurantsByCuisine: builder.query<Restaurant[], string>({
      // MockAPI.io uses query parameters for filtering
      query: (cuisineType) => `/restaurants?cuisineType=${encodeURIComponent(cuisineType)}`,
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

