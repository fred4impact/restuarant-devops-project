import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import Layout from './components/Layout/Layout'
import { DetailModalProvider } from './context/DetailModalContext'

// Lazy load pages
const HomePage = React.lazy(() => import('./pages/HomePage/HomePage'))
const BrowsePage = React.lazy(() => import('./pages/BrowsePage/BrowsePage'))
const CuisinePage = React.lazy(() => import('./pages/CuisinePage/CuisinePage'))
const RestaurantDetailPage = React.lazy(() => import('./pages/RestaurantDetailPage/RestaurantDetailPage'))

const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <CircularProgress />
  </Box>
)

function App() {
  return (
    <DetailModalProvider>
      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/cuisine/:cuisineType" element={<CuisinePage />} />
            <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </DetailModalProvider>
  )
}

export default App

