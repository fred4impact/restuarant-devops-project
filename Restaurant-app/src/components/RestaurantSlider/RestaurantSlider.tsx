import React from 'react'
import Slider from 'react-slick'
import { Box, Typography } from '@mui/material'
import { Restaurant } from '../../store/api/restaurantApi'
import RestaurantCard from '../RestaurantCard/RestaurantCard'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

interface RestaurantSliderProps {
  title: string
  restaurants: Restaurant[]
}

const RestaurantSlider: React.FC<RestaurantSliderProps> = ({
  title,
  restaurants,
}) => {
  const settings = {
    dots: false,
    infinite: false,
    arrows: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 3,
    swipe: true,
    swipeToSlide: true,
    draggable: true,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  if (restaurants.length === 0) {
    return null
  }

  return (
    <Box sx={{ mb: 4, position: 'relative' }}>
      <Typography
        variant="h4"
        component="h2"
        sx={{ mb: 2, fontWeight: 600, px: 2 }}
      >
        {title}
      </Typography>
      <Box 
        sx={{ 
          px: 2, 
          position: 'relative',
          '&:hover .slick-arrow': {
            opacity: 1,
          },
          '& .slick-slider': {
            position: 'relative',
          },
          '& .slick-list': {
            overflow: 'hidden',
          },
          '& .slick-slide': {
            height: 'auto',
            '& > div': {
              height: '100%',
            },
          },
          '& .slick-arrow': {
            zIndex: 3,
            width: '50px',
            height: '50px',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            '&:before': {
              fontSize: '40px',
              color: '#ffffff',
              opacity: 0.9,
            },
            '&:hover:before': {
              opacity: 1,
              color: '#e50914',
            },
          },
          '& .slick-prev': {
            left: '-50px',
            '&:before': {
              content: '"←"',
            },
          },
          '& .slick-next': {
            right: '-50px',
            '&:before': {
              content: '"→"',
            },
          },
          '& .slick-prev:hover, & .slick-next:hover': {
            '&:before': {
              color: '#e50914',
            },
          },
          '& .slick-disabled': {
            opacity: 0.2,
            cursor: 'not-allowed',
          },
        }}
      >
        <Slider {...settings}>
          {restaurants.map((restaurant) => (
            <div key={restaurant.id}>
              <Box sx={{ px: 1, height: '100%' }}>
                <RestaurantCard restaurant={restaurant} />
              </Box>
            </div>
          ))}
        </Slider>
      </Box>
    </Box>
  )
}

export default RestaurantSlider

