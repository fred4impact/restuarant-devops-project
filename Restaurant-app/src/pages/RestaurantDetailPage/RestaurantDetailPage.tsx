import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Button, Rating, Chip, Divider, Paper } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useGetRestaurantByIdQuery } from '../../store/api/restaurantApi'
import { CardMedia } from '@mui/material'

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: restaurant, isLoading, error } = useGetRestaurantByIdQuery(
    id || ''
  )

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  if (error || !restaurant) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" color="error">
          Restaurant not found
        </Typography>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Go Home
        </Button>
      </Container>
    )
  }

  const menuByCategory = restaurant.menu.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, typeof restaurant.menu>
  )

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <CardMedia
        component="img"
        height="400"
        image={restaurant.image}
        alt={restaurant.name}
        sx={{ objectFit: 'cover', borderRadius: 2, mb: 4 }}
      />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 700 }}>
          {restaurant.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Rating
            value={restaurant.rating}
            precision={0.1}
            readOnly
            sx={{
              '& .MuiRating-iconFilled': {
                color: '#e50914',
              },
            }}
          />
          <Typography variant="h6">{restaurant.rating}</Typography>
          <Chip label={restaurant.cuisineType} />
          <Chip label={restaurant.priceRange} />
          <Typography variant="body1" color="text.secondary">
            {restaurant.location}
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem' }}>
          {restaurant.description}
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
          Menu
        </Typography>

        {Object.entries(menuByCategory).map(([category, items]) => (
          <Box key={category} sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              {category}
            </Typography>
            {items.map((item) => (
              <Paper
                key={item.id}
                sx={{
                  p: 3,
                  mb: 2,
                  backgroundColor: '#1a1a1a',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {item.description}
                  </Typography>
                  {item.image && (
                    <CardMedia
                      component="img"
                      height="150"
                      image={item.image}
                      alt={item.name}
                      sx={{
                        objectFit: 'cover',
                        borderRadius: 1,
                        maxWidth: 200,
                      }}
                    />
                  )}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#e50914' }}>
                  ${item.price.toFixed(2)}
                </Typography>
              </Paper>
            ))}
          </Box>
        ))}
      </Box>
    </Container>
  )
}

export default RestaurantDetailPage

