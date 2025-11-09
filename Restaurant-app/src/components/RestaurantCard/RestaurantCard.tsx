import React from 'react'
import { Card, CardMedia, CardContent, Typography, Box, Rating } from '@mui/material'
import { motion } from 'framer-motion'
import { Restaurant } from '../../store/api/restaurantApi'
import { useDetailModal } from '../../context/DetailModalContext'

interface RestaurantCardProps {
  restaurant: Restaurant
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const { openModal } = useDetailModal()
  const [imageError, setImageError] = React.useState(false)
  const [imageLoading, setImageLoading] = React.useState(true)
  const [imageSrc, setImageSrc] = React.useState(restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800')

  const handleClick = () => {
    openModal(restaurant)
  }

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true)
      // Fallback to a default restaurant image
      setImageSrc('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800')
      setImageLoading(false)
    }
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{ cursor: 'pointer' }}
    >
      <Card
        sx={{
          backgroundColor: '#141414',
          borderRadius: 2,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
          },
        }}
        onClick={handleClick}
      >
        <Box sx={{ position: 'relative', height: 200, backgroundColor: '#2a2a2a' }}>
          {imageLoading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#2a2a2a',
                zIndex: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Loading...
              </Typography>
            </Box>
          )}
          <CardMedia
            component="img"
            height="200"
            image={imageSrc}
            alt={restaurant.name}
            onError={handleImageError}
            onLoad={handleImageLoad}
            sx={{ 
              objectFit: 'cover',
              backgroundColor: '#2a2a2a',
              minHeight: 200,
              opacity: imageLoading ? 0 : 1,
              transition: 'opacity 0.3s ease',
            }}
          />
        </Box>
        <CardContent>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {restaurant.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Rating
              value={restaurant.rating}
              precision={0.1}
              readOnly
              size="small"
              sx={{
                '& .MuiRating-iconFilled': {
                  color: '#e50914',
                },
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {restaurant.rating}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {restaurant.cuisineType}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              •
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {restaurant.priceRange}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              •
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {restaurant.location}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {restaurant.description}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default RestaurantCard

