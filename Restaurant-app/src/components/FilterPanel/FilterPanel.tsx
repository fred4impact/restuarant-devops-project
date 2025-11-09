import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
  Slider,
  Paper,
} from '@mui/material'
import { RootState } from '../../store/store'
import {
  setSelectedCuisine,
  setPriceFilter,
  setRatingFilter,
  clearFilters,
} from '../../store/slices/uiSlice'
import { useGetCuisinesQuery } from '../../store/api/restaurantApi'

const FilterPanel: React.FC = () => {
  const dispatch = useDispatch()
  const { data: cuisines = [] } = useGetCuisinesQuery()
  const selectedCuisine = useSelector((state: RootState) => state.ui.selectedCuisine)
  const priceFilter = useSelector((state: RootState) => state.ui.priceFilter)
  const ratingFilter = useSelector((state: RootState) => state.ui.ratingFilter)

  const handleCuisineChange = (event: SelectChangeEvent) => {
    dispatch(setSelectedCuisine(event.target.value || null))
  }

  const handlePriceChange = (event: SelectChangeEvent) => {
    dispatch(setPriceFilter(event.target.value || null))
  }

  const handleRatingChange = (_event: Event, value: number | number[]) => {
    dispatch(setRatingFilter(value as number))
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
  }

  return (
    <Paper sx={{ p: 3, backgroundColor: '#141414', position: 'sticky', top: 80 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Filters
      </Typography>

      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Cuisine</InputLabel>
          <Select
            value={selectedCuisine || ''}
            label="Cuisine"
            onChange={handleCuisineChange}
            sx={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}
          >
            <MenuItem value="">All Cuisines</MenuItem>
            {cuisines.map((cuisine) => (
              <MenuItem key={cuisine.id} value={cuisine.name}>
                {cuisine.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Price Range</InputLabel>
          <Select
            value={priceFilter || ''}
            label="Price Range"
            onChange={handlePriceChange}
            sx={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}
          >
            <MenuItem value="">All Prices</MenuItem>
            <MenuItem value="$">$ - Budget Friendly</MenuItem>
            <MenuItem value="$$">$$ - Moderate</MenuItem>
            <MenuItem value="$$$">$$$ - Expensive</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>Minimum Rating</Typography>
          <Slider
            value={ratingFilter || 0}
            onChange={handleRatingChange}
            min={0}
            max={5}
            step={0.5}
            marks
            valueLabelDisplay="auto"
            sx={{
              color: '#e50914',
              '& .MuiSlider-thumb': {
                backgroundColor: '#e50914',
              },
            }}
          />
        </Box>

        <Button
          variant="outlined"
          fullWidth
          onClick={handleClearFilters}
          sx={{
            borderColor: '#e50914',
            color: '#e50914',
            '&:hover': {
              borderColor: '#f40612',
              backgroundColor: 'rgba(229, 9, 20, 0.1)',
            },
          }}
        >
          Clear Filters
        </Button>
      </Box>
    </Paper>
  )
}

export default FilterPanel

