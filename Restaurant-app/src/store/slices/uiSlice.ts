import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UiState {
  searchQuery: string
  selectedCuisine: string | null
  priceFilter: string | null
  ratingFilter: number | null
}

const initialState: UiState = {
  searchQuery: '',
  selectedCuisine: null,
  priceFilter: null,
  ratingFilter: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setSelectedCuisine: (state, action: PayloadAction<string | null>) => {
      state.selectedCuisine = action.payload
    },
    setPriceFilter: (state, action: PayloadAction<string | null>) => {
      state.priceFilter = action.payload
    },
    setRatingFilter: (state, action: PayloadAction<number | null>) => {
      state.ratingFilter = action.payload
    },
    clearFilters: (state) => {
      state.searchQuery = ''
      state.selectedCuisine = null
      state.priceFilter = null
      state.ratingFilter = null
    },
  },
})

export const {
  setSearchQuery,
  setSelectedCuisine,
  setPriceFilter,
  setRatingFilter,
  clearFilters,
} = uiSlice.actions

export default uiSlice.reducer

