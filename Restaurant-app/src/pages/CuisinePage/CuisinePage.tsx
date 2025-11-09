import React from 'react'
import { useParams } from 'react-router-dom'
import { Box, Container, Grid, Typography } from '@mui/material'
import { useGetRestaurantsByCuisineQuery } from '../../store/api/restaurantApi'
import RestaurantCard from '../../components/RestaurantCard/RestaurantCard'

const CuisinePage: React.FC = () => {
  const { cuisineType } = useParams<{ cuisineType: string }>()
  const { data: restaurants = [], isLoading } = useGetRestaurantsByCuisineQuery(
    cuisineType || ''
  )

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" sx={{ mb: 4, fontWeight: 600, textTransform: 'capitalize' }}>
        {cuisineType} Restaurants
      </Typography>

      {restaurants.length > 0 ? (
        <Grid container spacing={3}>
          {restaurants.map((restaurant) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={restaurant.id}>
              <RestaurantCard restaurant={restaurant} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary">
            No restaurants found for {cuisineType}
          </Typography>
        </Box>
      )}
    </Container>
  )
}

export default CuisinePage

