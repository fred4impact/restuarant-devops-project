import React, { useMemo } from 'react'
import { Box, Container, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { useGetRestaurantsQuery, useGetCuisinesQuery } from '../../store/api/restaurantApi'
import { RootState } from '../../store/store'
import HeroSection from '../../components/HeroSection/HeroSection'
import RestaurantSlider from '../../components/RestaurantSlider/RestaurantSlider'
import CuisineGrid from '../../components/CuisineGrid/CuisineGrid'

const HomePage: React.FC = () => {
  const { data: restaurants = [], isLoading: restaurantsLoading, error: restaurantsError } =
    useGetRestaurantsQuery()
  const { data: cuisines = [], isLoading: cuisinesLoading, error: cuisinesError } = useGetCuisinesQuery()
  const searchQuery = useSelector((state: RootState) => state.ui.searchQuery)
  const selectedCuisine = useSelector((state: RootState) => state.ui.selectedCuisine)
  const priceFilter = useSelector((state: RootState) => state.ui.priceFilter)
  const ratingFilter = useSelector((state: RootState) => state.ui.ratingFilter)

  const filteredRestaurants = useMemo(() => {
    let filtered = [...restaurants]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.cuisineType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Cuisine filter
    if (selectedCuisine) {
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.cuisineType.toLowerCase() === selectedCuisine.toLowerCase()
      )
    }

    // Price filter
    if (priceFilter) {
      filtered = filtered.filter((restaurant) => restaurant.priceRange === priceFilter)
    }

    // Rating filter
    if (ratingFilter) {
      filtered = filtered.filter((restaurant) => restaurant.rating >= ratingFilter)
    }

    return filtered
  }, [restaurants, searchQuery, selectedCuisine, priceFilter, ratingFilter])

  // Group restaurants by cuisine
  const restaurantsByCuisine = useMemo(() => {
    const grouped: Record<string, typeof restaurants> = {}
    filteredRestaurants.forEach((restaurant) => {
      if (!grouped[restaurant.cuisineType]) {
        grouped[restaurant.cuisineType] = []
      }
      grouped[restaurant.cuisineType].push(restaurant)
    })
    return grouped
  }, [filteredRestaurants])

  const featuredRestaurant = restaurants[0]

  if (restaurantsLoading || cuisinesLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  if (restaurantsError || cuisinesError) {
    const error = restaurantsError || cuisinesError
    const errorData = error && 'data' in error ? error.data : null
    const errorMessage = errorData && typeof errorData === 'object' && 'message' in errorData 
      ? String(errorData.message) 
      : null
    const isCreditsError = errorMessage?.includes('API credits') || false
    
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', p: 4 }}>
        <Typography variant="h5" color="error" sx={{ mb: 2 }}>
          {isCreditsError ? 'Foursquare API Credits Exceeded' : 'Error loading restaurants'}
        </Typography>
        {isCreditsError ? (
          <>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2, textAlign: 'center', maxWidth: 600 }}>
              Your Foursquare API account has no credits remaining. To continue using the Foursquare API, you need to:
            </Typography>
            <Box component="ul" sx={{ mb: 2, textAlign: 'left', maxWidth: 600 }}>
              <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Visit <a href="https://foursquare.com/developers/orgs" target="_blank" rel="noopener noreferrer" style={{ color: '#e50914' }}>Foursquare Billing</a> to add credits
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Enable automatic payments for continuous access
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Or use mock data for development (see instructions below)
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
              For now, the app will use mock data. Check the console for details.
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {errorMessage || 'An error occurred while loading restaurants'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Check the browser console for more details.
            </Typography>
          </>
        )}
      </Box>
    )
  }

  return (
    <Box sx={{ pb: 4 }}>
      {featuredRestaurant && <HeroSection restaurant={featuredRestaurant} />}

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <CuisineGrid cuisines={cuisines} />

        {Object.entries(restaurantsByCuisine).map(([cuisine, cuisineRestaurants]) => (
          <RestaurantSlider
            key={cuisine}
            title={cuisine}
            restaurants={cuisineRestaurants}
          />
        ))}

        {filteredRestaurants.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="text.secondary">
              No restaurants found matching your criteria
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default HomePage

