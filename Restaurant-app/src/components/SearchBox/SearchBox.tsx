import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TextField, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { RootState } from '../../store/store'
import { setSearchQuery } from '../../store/slices/uiSlice'

const SearchBox: React.FC = () => {
  const dispatch = useDispatch()
  const searchQuery = useSelector((state: RootState) => state.ui.searchQuery)
  const [localQuery, setLocalQuery] = useState(searchQuery)

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(localQuery))
    }, 300)

    return () => clearTimeout(timer)
  }, [localQuery, dispatch])

  return (
    <TextField
      fullWidth
      placeholder="Search restaurants..."
      value={localQuery}
      onChange={(e) => setLocalQuery(e.target.value)}
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#e50914',
          },
        },
        '& .MuiInputBase-input': {
          color: '#ffffff',
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: '#b3b3b3' }} />
          </InputAdornment>
        ),
      }}
    />
  )
}

export default SearchBox

