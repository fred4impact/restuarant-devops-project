# Foursquare Places API Setup Guide

Complete step-by-step guide to set up Foursquare Places API for your Restaurant Discovery App.

---

## Step 1: Create an App on Foursquare

1. **Go to Foursquare Developer Console:**
   - Visit: https://developer.foursquare.com/
   - Click **"Sign In"** (top right) if not already logged in

2. **Access My Apps:**
   - After logging in, click on **"My Apps"** in the top navigation
   - Or go directly to: https://developer.foursquare.com/apps

3. **Create New App:**
   - Click the **"Create a new app"** button
   - Or click **"New App"** if you see the button

4. **Fill in App Details:**
   - **App Name:** `Restaurant Discovery App` (or any name you prefer)
   - **App Website:** `http://localhost:3000` (or your website URL)
   - **Redirect URI:** `http://localhost:3000` (for OAuth, can be same as website)
   - **App Description:** `Restaurant discovery and menu browsing application`
   - **Category:** Select `Food & Drink` or `Travel & Local`

5. **Submit:**
   - Click **"Save"** or **"Create App"**

---

## Step 2: Get Your API Credentials

After creating the app, you'll see your app dashboard with:

1. **Client ID** (also called App ID)
2. **Client Secret** (also called App Secret)

**Important:** Copy both of these - you'll need them!

**Location:**
- They appear on the app details page
- Look for sections labeled:
  - **"Client ID"** or **"App ID"**
  - **"Client Secret"** or **"App Secret"**

---

## Step 3: Understand Foursquare Places API

Foursquare uses the **Places API** (migrated from v3 to new Places API).

**Important:** The API has been updated! See the [migration guide](https://docs.foursquare.com/fsq-developers-places/reference/migration-guide) for details.

### Key Endpoints for Restaurants:

1. **Search Places:**
   ```
   GET https://places-api.foursquare.com/places/search
   ```
   (Old: `api.foursquare.com/v3/places/search`)

2. **Get Place Details:**
   ```
   GET https://places-api.foursquare.com/places/{fsq_place_id}
   ```
   (Old: `api.foursquare.com/v3/places/{fsq_id}`)

3. **Get Place Photos:**
   ```
   GET https://places-api.foursquare.com/places/{fsq_place_id}/photos
   ```
   (Old: `api.foursquare.com/v3/places/{fsq_id}/photos`)

### Authentication Changes:
- **Old:** API Keys with `Authorization: YOUR_API_KEY`
- **New:** Service Keys with `Authorization: Bearer YOUR_SERVICE_KEY`
- You need to create a **Service Key** (not API Key) in the developer console

---

## Step 4: Get Your Service Key

**Important:** Foursquare now uses **Service Keys** instead of API Keys!

1. **In your app dashboard:**
   - Go to your app settings
   - Look for **"Service Keys"** or **"API Keys"** section
   - Click **"Create Service Key"** or **"Generate Key"**
   - Copy the Service Key (starts with `fsq3...`)

2. **Service Key Format:**
   - Service keys look like: `fsq3OzmFptL2Ycq2n52MaODDVhTTAbjjDxiEyRK8CaT4J4k=`
   - They're longer than old API keys

3. **Authentication Header:**
   - **New Format:** `Authorization: Bearer YOUR_SERVICE_KEY`
   - **Old Format (deprecated):** `Authorization: YOUR_API_KEY`
   - Always use `Bearer` prefix with Service Keys!

---

## Step 5: Test Your Service Key

### Test with cURL:

**New Endpoint (Correct):**
```bash
curl -X GET "https://places-api.foursquare.com/places/search?query=restaurant&ll=40.7128,-74.0060" \
  -H "Authorization: Bearer WMKDFIS03544N0EG3ZRV5LX2COILF1BWEBQUEJ1DFAP2AAOM " \
  -H "X-Places-Api-Version: 2025-06-17"
```

**Important Notes:**
- Use `places-api.foursquare.com` (not `api.foursquare.com`)
- Use `Bearer` prefix in Authorization header
- Include version header: `X-Places-Api-Version: 2025-06-17`
- Replace `YOUR_SERVICE_KEY` with your actual service key

**Example with your key:**
```bash
curl -X GET "https://places-api.foursquare.com/places/search?query=restaurant&ll=40.7128,-74.0060" \
  -H "Authorization: Bearer fsq3OzmFptL2Ycq2n52MaODDVhTTAbjjDxiEyRK8CaT4J4k=" \
  -H "X-Places-Api-Version: 2025-06-17"
```

### Expected Response:
```json
{
  "results": [
    {
      "fsq_place_id": "...",
      "name": "Restaurant Name",
      "location": {
        "address": "...",
        "locality": "...",
        "region": "..."
      },
      "rating": 8.5,
      "price": 2,
      "categories": [...],
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  ]
}
```

**Note:** Field name changed from `fsq_id` to `fsq_place_id` in the new API!

---

## Step 6: Set Up Environment Variables

1. **Create `.env` file** in your project root:

```bash
VITE_FOURSQUARE_SERVICE_KEY=WMKDFIS03544N0EG3ZRV5LX2COILF1BWEBQUEJ1DFAP2AAOM
VITE_FOURSQUARE_API_URL=https://places-api.foursquare.com
```

2. **Replace `your_service_key_here`** with your actual Service Key

3. **Important:** Add `.env` to `.gitignore` to keep your key secure!

---

## Step 7: Update Your Restaurant API

Now update `src/store/api/restaurantApi.ts` to use Foursquare API:

### Example Implementation:

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Restaurant {
  id: string
  name: string
  image: string
  rating: number
  cuisineType: string
  priceRange: string
  location: string
  description: string
  menu: MenuItem[]
}

export interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image?: string
  category: string
}

export interface Cuisine {
  id: number
  name: string
  image: string
}

const serviceKey = import.meta.env.VITE_FOURSQUARE_SERVICE_KEY
const baseUrl = import.meta.env.VITE_FOURSQUARE_API_URL || 'https://places-api.foursquare.com'

export const restaurantApi = createApi({
  reducerPath: 'restaurantApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      if (serviceKey) {
        headers.set('Authorization', `Bearer ${serviceKey}`)
        headers.set('X-Places-Api-Version', '2025-06-17')
      }
      return headers
    },
  }),
  tagTypes: ['Restaurant', 'Cuisine'],
  endpoints: (builder) => ({
    getRestaurants: builder.query<Restaurant[], void>({
      query: () => ({
        url: '/places/search',
        params: {
          query: 'restaurant',
          ll: '40.7128,-74.0060', // New York coordinates (change to your location)
          limit: 50,
        },
      }),
      transformResponse: (response: any): Restaurant[] => {
        // Transform Foursquare response to match your Restaurant interface
        return response.results?.map((place: any) => ({
          id: place.fsq_place_id, // Changed from fsq_id to fsq_place_id
          name: place.name,
          image: place.photos?.[0]?.prefix + '800x600' + place.photos?.[0]?.suffix || 
                 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
          rating: (place.rating || 0) / 2, // Foursquare uses 0-10, convert to 0-5
          cuisineType: place.categories?.[0]?.name || 'Restaurant',
          priceRange: place.price ? '$'.repeat(place.price) : '$$',
          location: place.location?.address || place.location?.locality || 'Unknown',
          description: place.description || place.categories?.[0]?.name || '',
          menu: [], // Foursquare doesn't provide menu data
        })) || []
      },
      providesTags: ['Restaurant'],
    }),

    getRestaurantById: builder.query<Restaurant, string>({
      query: (id) => `/places/${id}`,
      transformResponse: (place: any): Restaurant => ({
        id: place.fsq_place_id, // Changed from fsq_id to fsq_place_id
        name: place.name,
        image: place.photos?.[0]?.prefix + '800x600' + place.photos?.[0]?.suffix || 
               'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        rating: (place.rating || 0) / 2,
        cuisineType: place.categories?.[0]?.name || 'Restaurant',
        priceRange: place.price ? '$'.repeat(place.price) : '$$',
        location: place.location?.address || place.location?.locality || 'Unknown',
        description: place.description || place.categories?.[0]?.name || '',
        menu: [], // Foursquare doesn't provide menu data
      }),
      providesTags: (_result, _error, id) => [{ type: 'Restaurant', id }],
    }),

    getCuisines: builder.query<Cuisine[], void>({
      query: () => ({
        url: '/places/search',
        params: {
          query: 'restaurant',
          ll: '40.7128,-74.0060',
          limit: 50,
        },
      }),
      transformResponse: (response: any): Cuisine[] => {
        // Extract unique cuisine types from restaurants
        const cuisines = new Map<string, Cuisine>()
        response.results?.forEach((place: any, index: number) => {
          const category = place.categories?.[0]
          if (category && !cuisines.has(category.name)) {
            cuisines.set(category.name, {
              id: cuisines.size + 1,
              name: category.name,
              image: category.icon?.prefix + '64' + category.icon?.suffix || 
                     `https://images.unsplash.com/photo-${1500000000000 + index}?w=400`,
            })
          }
        })
        return Array.from(cuisines.values())
      },
      providesTags: ['Cuisine'],
    }),

    getRestaurantsByCuisine: builder.query<Restaurant[], string>({
      query: (cuisineType) => ({
        url: '/places/search',
        params: {
          query: cuisineType,
          ll: '40.7128,-74.0060',
          limit: 50,
        },
      }),
      transformResponse: (response: any): Restaurant[] => {
        return response.results?.map((place: any) => ({
          id: place.fsq_place_id, // Changed from fsq_id to fsq_place_id
          name: place.name,
          image: place.photos?.[0]?.prefix + '800x600' + place.photos?.[0]?.suffix || 
                 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
          rating: (place.rating || 0) / 2,
          cuisineType: place.categories?.[0]?.name || 'Restaurant',
          priceRange: place.price ? '$'.repeat(place.price) : '$$',
          location: place.location?.address || place.location?.locality || 'Unknown',
          description: place.description || place.categories?.[0]?.name || '',
          menu: [],
        })) || []
      },
      providesTags: ['Restaurant'],
    }),
  }),
})

export const {
  useGetRestaurantsQuery,
  useGetRestaurantByIdQuery,
  useGetCuisinesQuery,
  useGetRestaurantsByCuisineQuery,
} = restaurantApi
```

---

## Step 8: Important Notes

### 1. **Location Coordinates:**
   - Update `ll` parameter to your location
   - Format: `latitude,longitude`
   - Example: `40.7128,-74.0060` (New York)
   - Get your coordinates: https://www.latlong.net/

### 2. **Rate Limits:**
   - Free tier: 50,000 calls/day
   - Monitor usage in Foursquare dashboard

### 3. **Menu Data:**
   - Foursquare Places API doesn't provide menu data
   - You'll need to:
     - Use mock menu data
     - Integrate another API for menus
     - Or add menu data manually

### 4. **CORS:**
   - Foursquare API may have CORS restrictions
   - If you get CORS errors, you may need:
     - A backend proxy
     - Or use a CORS proxy service

---

## Step 9: Test the Integration

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Check browser console** for any errors

3. **Check Network tab** in DevTools:
   - Look for requests to `places-api.foursquare.com`
   - Check if they return 200 status
   - Verify response data

4. **If you see CORS errors:**
   - You may need to set up a proxy
   - Or use a backend to make API calls

---

## Step 10: Troubleshooting

### Issue: "Invalid API Key" or "Unauthorized"
- **Solution:** 
  - Double-check your Service Key in `.env` file
  - Make sure you're using `Bearer` prefix: `Authorization: Bearer YOUR_KEY`
  - Verify the key starts with `fsq3...`
  - Make sure there are no extra spaces
  - Restart your dev server after updating `.env`

### Issue: "CORS Error"
- **Solution:** Foursquare API may block browser requests
- **Option 1:** Use a CORS proxy (for development only)
- **Option 2:** Create a simple backend proxy
- **Option 3:** Use Vite proxy configuration

### Issue: "No results returned"
- **Solution:** 
  - Check your location coordinates (`ll` parameter)
  - Try a different location
  - Verify the query parameters

### Issue: "Rate limit exceeded"
- **Solution:** 
  - You've exceeded 50K calls/day
  - Wait 24 hours or upgrade plan
  - Check your usage in Foursquare dashboard

---

## Step 11: Vite Proxy Setup (For CORS)

If you encounter CORS issues, add a proxy in `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api/foursquare': {
        target: 'https://places-api.foursquare.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/foursquare/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            const serviceKey = process.env.VITE_FOURSQUARE_SERVICE_KEY
            if (serviceKey) {
              proxyReq.setHeader('Authorization', `Bearer ${serviceKey}`)
              proxyReq.setHeader('X-Places-Api-Version', '2025-06-17')
            }
          })
        },
      },
    },
  },
})
```

Then update your API base URL to use the proxy:
```typescript
const baseUrl = '/api/foursquare'
```

---

## Quick Checklist

- [ ] Created Foursquare app
- [ ] Got Service Key (not API key!)
- [ ] Created `.env` file with Service Key
- [ ] Updated `restaurantApi.ts` with new Places API endpoints
- [ ] Added `Bearer` prefix to Authorization header
- [ ] Added `X-Places-Api-Version` header
- [ ] Updated field names (`fsq_id` → `fsq_place_id`)
- [ ] Updated location coordinates
- [ ] Tested API calls
- [ ] Handled CORS if needed
- [ ] Verified data is displaying in app

---

## Next Steps

1. **Get your Service Key** from Foursquare dashboard (not API key!)
2. **Create `.env` file** with your Service Key
3. **Update `restaurantApi.ts`** with new endpoints and authentication
4. **Test the integration** with the new API
5. **Handle menu data** (since Foursquare doesn't provide it)

## Important Migration Notes

Based on the [Foursquare Migration Guide](https://docs.foursquare.com/fsq-developers-places/reference/migration-guide):

✅ **What Changed:**
- Host: `api.foursquare.com` → `places-api.foursquare.com`
- Path: Removed `/v3/` version segment
- Auth: API Keys → Service Keys with `Bearer` prefix
- Field: `fsq_id` → `fsq_place_id`
- Headers: Added `X-Places-Api-Version: 2025-06-17`

✅ **What Stayed the Same:**
- Response structure (mostly)
- Query parameters
- Rate limits

**Need help with any step? Let me know!**

