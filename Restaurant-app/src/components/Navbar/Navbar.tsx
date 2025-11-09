import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import SearchBox from '../SearchBox/SearchBox'

const Navbar: React.FC = () => {
  const navigate = useNavigate()

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#141414',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <RestaurantMenuIcon sx={{ fontSize: 32, color: '#e50914' }} />
            <Typography
              variant="h5"
              component="div"
              sx={{ fontWeight: 700, color: '#ffffff' }}
            >
              Foodie
            </Typography>
          </Link>
        </Box>

        <Box sx={{ flex: 1, maxWidth: 600, mx: 4 }}>
          <SearchBox />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ textTransform: 'none' }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/browse')}
            sx={{ textTransform: 'none' }}
          >
            Browse
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar

