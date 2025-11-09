import React, { useMemo } from 'react'
import { Box, Container, Grid, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { useGetRestaurantsQuery } from '../../store/api/restaurantApi'
import { RootState } from '../../store/store'
import RestaurantCard from '../../components/RestaurantCard/RestaurantCard'
import FilterPanel from '../../components/FilterPanel/FilterPanel'

const BrowsePage: React.FC = () => {
  const { data: restaurants = [], isLoading } = useGetRestaurantsQuery()
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

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box sx={{ width: 300, flexShrink: 0 }}>
          <FilterPanel />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 600 }}>
            Browse Restaurants
            {filteredRestaurants.length > 0 && (
              <Typography component="span" variant="body1" color="text.secondary" sx={{ ml: 2 }}>
                ({filteredRestaurants.length} found)
              </Typography>
            )}
          </Typography>

          {filteredRestaurants.length > 0 ? (
            <Grid container spacing={3}>
              {filteredRestaurants.map((restaurant) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={restaurant.id}>
                  <RestaurantCard restaurant={restaurant} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" color="text.secondary">
                No restaurants found matching your criteria
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  )
}

export default BrowsePage

