import React from 'react'
import { Box, Typography, Button, Container } from '@mui/material'
import { motion } from 'framer-motion'
import { Restaurant } from '../../store/api/restaurantApi'
import { useDetailModal } from '../../context/DetailModalContext'

interface HeroSectionProps {
  restaurant: Restaurant
}

const HeroSection: React.FC<HeroSectionProps> = ({ restaurant }) => {
  const { openModal } = useDetailModal()

  const handleClick = () => {
    openModal(restaurant)
  }

  return (
    <Box
      sx={{
        position: 'relative',
        height: '80vh',
        minHeight: 500,
        display: 'flex',
        alignItems: 'center',
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url(${restaurant.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 700,
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            {restaurant.name}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              maxWidth: 600,
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
            }}
          >
            {restaurant.description}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
            <Typography variant="body1" sx={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
              {restaurant.cuisineType} • {restaurant.priceRange} • {restaurant.location}
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            onClick={handleClick}
            sx={{
              backgroundColor: '#e50914',
              color: '#ffffff',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#f40612',
              },
            }}
          >
            View Menu
          </Button>
        </motion.div>
      </Container>
    </Box>
  )
}

export default HeroSection

