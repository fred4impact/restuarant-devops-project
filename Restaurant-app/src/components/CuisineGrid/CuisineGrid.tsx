import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Grid, Card, CardMedia, CardContent, Typography, Box } from '@mui/material'
import { motion } from 'framer-motion'
import { Cuisine } from '../../store/api/restaurantApi'

interface CuisineGridProps {
  cuisines: Cuisine[]
}

const CuisineGrid: React.FC<CuisineGridProps> = ({ cuisines }) => {
  const navigate = useNavigate()
  const [imageErrors, setImageErrors] = React.useState<Record<number, boolean>>({})
  const [imageLoading, setImageLoading] = React.useState<Record<number, boolean>>({})

  // Initialize loading state for all cuisines when they change
  useEffect(() => {
    const initial: Record<number, boolean> = {}
    cuisines.forEach(cuisine => {
      initial[cuisine.id] = true
    })
    setImageLoading(initial)
  }, [cuisines])

  const handleClick = (cuisineName: string) => {
    navigate(`/cuisine/${cuisineName.toLowerCase()}`)
  }

  const handleImageError = (cuisineId: number) => {
    if (!imageErrors[cuisineId]) {
      setImageErrors(prev => ({ ...prev, [cuisineId]: true }))
      setImageLoading(prev => ({ ...prev, [cuisineId]: false }))
    }
  }

  const handleImageLoad = (cuisineId: number) => {
    setImageLoading(prev => ({ ...prev, [cuisineId]: false }))
  }

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 600, px: 2 }}>
        Explore by Cuisine
      </Typography>
      <Box sx={{ px: 2 }}>
        <Grid container spacing={3}>
          {cuisines.map((cuisine) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={cuisine.id}>
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
                  onClick={() => handleClick(cuisine.name)}
                >
                  <Box sx={{ position: 'relative', height: 150, backgroundColor: '#2a2a2a' }}>
                    {imageLoading[cuisine.id] && (
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
                      height="150"
                      image={cuisine.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'}
                      alt={cuisine.name}
                      onError={() => handleImageError(cuisine.id)}
                      onLoad={() => handleImageLoad(cuisine.id)}
                      sx={{ 
                        objectFit: 'cover',
                        backgroundColor: '#2a2a2a',
                        minHeight: 150,
                        opacity: imageLoading[cuisine.id] ? 0 : 1,
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
                        textAlign: 'center',
                        textTransform: 'capitalize',
                      }}
                    >
                      {cuisine.name}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}

export default CuisineGrid

