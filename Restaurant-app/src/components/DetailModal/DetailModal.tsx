import React from 'react'
import {
  Modal,
  Box,
  Typography,
  IconButton,
  CardMedia,
  Rating,
  Divider,
  Chip,
  Paper,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Restaurant, MenuItem } from '../../store/api/restaurantApi'
import { motion, AnimatePresence } from 'framer-motion'

interface DetailModalProps {
  restaurant: Restaurant
  open: boolean
  onClose: () => void
}

const DetailModal: React.FC<DetailModalProps> = ({
  restaurant,
  open,
  onClose,
}) => {
  const menuByCategory = restaurant.menu.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, MenuItem[]>
  )

  return (
    <AnimatePresence>
      {open && (
        <Modal
          open={open}
          onClose={onClose}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Box
              sx={{
                position: 'relative',
                backgroundColor: '#141414',
                borderRadius: 2,
                maxWidth: 900,
                maxHeight: '90vh',
                overflow: 'auto',
                outline: 'none',
                width: '100%',
              }}
            >
              <IconButton
                onClick={onClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  zIndex: 1,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)',
                  },
                }}
              >
                <CloseIcon />
              </IconButton>

              <CardMedia
                component="img"
                height="300"
                image={restaurant.image}
                alt={restaurant.name}
                sx={{ objectFit: 'cover' }}
              />

              <Box sx={{ p: 3 }}>
                <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 700 }}>
                  {restaurant.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
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
                  <Typography variant="body1">{restaurant.rating}</Typography>
                  <Chip label={restaurant.cuisineType} size="small" />
                  <Chip label={restaurant.priceRange} size="small" />
                  <Typography variant="body2" color="text.secondary">
                    {restaurant.location}
                  </Typography>
                </Box>

                <Typography variant="body1" sx={{ mb: 3 }}>
                  {restaurant.description}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
                  Menu
                </Typography>

                {Object.entries(menuByCategory).map(([category, items]) => (
                  <Box key={category} sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      {category}
                    </Typography>
                    {items.map((item) => (
                      <Paper
                        key={item.id}
                        sx={{
                          p: 2,
                          mb: 2,
                          backgroundColor: '#1a1a1a',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {item.description}
                          </Typography>
                          {item.image && (
                            <CardMedia
                              component="img"
                              height="100"
                              image={item.image}
                              alt={item.name}
                              sx={{
                                objectFit: 'cover',
                                borderRadius: 1,
                                mt: 1,
                                maxWidth: 150,
                              }}
                            />
                          )}
                        </Box>
                        <Typography variant="h6" sx={{ ml: 2, fontWeight: 600, color: '#e50914' }}>
                          ${item.price.toFixed(2)}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                ))}
              </Box>
            </Box>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  )
}

export default DetailModal

