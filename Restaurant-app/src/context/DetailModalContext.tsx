import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Restaurant } from '../store/api/restaurantApi'
import DetailModal from '../components/DetailModal/DetailModal'

interface DetailModalContextType {
  openModal: (restaurant: Restaurant) => void
  closeModal: () => void
}

const DetailModalContext = createContext<DetailModalContextType | undefined>(
  undefined
)

export const useDetailModal = () => {
  const context = useContext(DetailModalContext)
  if (!context) {
    throw new Error('useDetailModal must be used within DetailModalProvider')
  }
  return context
}

interface DetailModalProviderProps {
  children: ReactNode
}

export const DetailModalProvider: React.FC<DetailModalProviderProps> = ({
  children,
}) => {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const openModal = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setSelectedRestaurant(null)
  }

  return (
    <DetailModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {selectedRestaurant && (
        <DetailModal
          restaurant={selectedRestaurant}
          open={isOpen}
          onClose={closeModal}
        />
      )}
    </DetailModalContext.Provider>
  )
}

