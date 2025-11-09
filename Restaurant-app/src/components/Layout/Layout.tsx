import React, { ReactNode } from 'react'
import { Box } from '@mui/material'
import Navbar from '../Navbar/Navbar'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
      <Navbar />
      <Box component="main">{children}</Box>
    </Box>
  )
}

export default Layout

