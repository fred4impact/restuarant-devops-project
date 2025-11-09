# Restaurant Discovery App

A modern restaurant discovery and menu browsing application built with React, TypeScript, and Material-UI.

## Features

- 🏠 **Home Page**: Hero section with featured restaurant and cuisine browsing
- 🔍 **Search**: Real-time search across restaurants, cuisines, and descriptions
- 🎯 **Filtering**: Filter by cuisine type, price range, and rating
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI**: Beautiful dark theme with smooth animations
- 🍽️ **Menu Display**: Detailed menu view with categories and prices
- 🎬 **Carousel Sliders**: Netflix-style horizontal scrolling for restaurant categories

## Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit (RTK) + RTK Query
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router v6 (with lazy loading)
- **Animations**: Framer Motion
- **Carousels**: React Slick

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Main layout wrapper
│   ├── Navbar/         # Navigation bar
│   ├── SearchBox/      # Search input component
│   ├── RestaurantCard/ # Restaurant card component
│   ├── RestaurantSlider/ # Carousel slider for restaurants
│   ├── HeroSection/    # Hero banner component
│   ├── DetailModal/    # Modal for restaurant details
│   ├── CuisineGrid/    # Grid of cuisine categories
│   └── FilterPanel/    # Filter sidebar component
├── pages/              # Page components
│   ├── HomePage/       # Home page with hero and sliders
│   ├── BrowsePage/     # Browse page with filters
│   ├── CuisinePage/    # Cuisine-specific page
│   └── RestaurantDetailPage/ # Individual restaurant page
├── store/              # Redux store configuration
│   ├── store.ts        # Store setup
│   ├── api/            # RTK Query API slices
│   └── slices/         # Redux slices
├── context/            # React Context providers
├── theme/              # MUI theme configuration
└── App.tsx             # Main app component
```

## API Integration

Currently, the app uses mock data. To integrate with a real API:

1. Set the `VITE_API_URL` environment variable in a `.env` file:
```
VITE_API_URL=https://your-api-url.com
```

2. Update the `restaurantApi.ts` file to replace `queryFn` with actual `query` endpoints:
```typescript
getRestaurants: builder.query<Restaurant[], void>({
  query: () => '/restaurants',
}),
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features in Detail

### Search Functionality
- Real-time search with 300ms debounce
- Searches across restaurant names, cuisines, and descriptions
- Updates results as you type

### Filtering System
- Filter by cuisine type
- Filter by price range ($, $$, $$$)
- Filter by minimum rating (0-5 stars)
- Clear all filters with one click

### Restaurant Display
- Card-based layout with hover effects
- Rating display with stars
- Price range and location information
- Click to view detailed menu

### Menu Display
- Organized by category
- Item descriptions and prices
- Modal view for quick browsing
- Full page view for detailed exploration

## Future Enhancements

- [ ] User authentication
- [ ] Favorites/bookmarks
- [ ] Reviews and ratings
- [ ] Order placement
- [ ] Map integration
- [ ] Real-time availability
- [ ] Reservation system

## License

MIT

