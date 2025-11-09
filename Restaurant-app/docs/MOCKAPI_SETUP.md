# MockAPI.io Setup Guide

This guide will help you set up MockAPI.io as your backend API instead of running a local server.

## What is MockAPI.io?

MockAPI.io is a free cloud-based mock API service that allows you to create REST APIs without writing any backend code. Perfect for development and testing!

## Prerequisites

- A web browser
- An email address (for signup)
- Your `db.json` file with restaurant data

## Step-by-Step Setup

### Step 1: Sign Up for MockAPI.io

1. Go to [https://mockapi.io](https://mockapi.io)
2. Click **"Sign Up"** or **"Get Started"**
3. Sign up with:
   - Email and password, OR
   - Google account (faster)
4. Verify your email if required

### Step 2: Create a New Project

1. After logging in, click **"New Project"** or **"Create Project"**
2. Enter project name: `Restaurant API` (or any name you prefer)
3. Click **"Create"**

### Step 3: Create the Restaurant Resource

1. In your project, click **"New Resource"** or **"Add Resource"**
2. Resource name: `restaurants` (must be lowercase, plural)
3. Click **"Create"**

### Step 4: Add Restaurant Data

You have two options:

#### Option A: Import from JSON (Recommended)

1. Click on the `restaurants` resource
2. Look for **"Import"** or **"Bulk Add"** button
3. Copy the restaurants array from your `db.json` file
4. Paste it into the import field
5. Click **"Import"** or **"Save"**

#### Option B: Manual Entry

1. Click **"Add Item"** for each restaurant
2. Manually enter each restaurant's data
3. Click **"Save"** after each entry

**Note:** For MockAPI.io, you need to remove the `id` field from each restaurant (MockAPI will auto-generate IDs).

### Step 5: Get Your API URL

1. In your project dashboard, you'll see your **API URL**
2. It will look like: `https://[your-project-id].mockapi.io/api/v1`

https://690dc4e6bd0fefc30a0241c0.mockapi.io/api/v1/restaurants
3. Copy this URL - you'll need it for the frontend

### Step 6: Update Frontend Configuration

1. Create or update `.env` file in your project root:
   ```bash
   VITE_API_URL=https://690dc4e6bd0fefc30a0241c.mockapi.io/api/v1
   ```

2. Replace `[your-project-id]` with your actual project ID from MockAPI.io

### Step 7: Update Frontend API Code

Update `src/store/api/restaurantApi.ts` to work with MockAPI.io:

```typescript
// MockAPI.io configuration
const baseUrl = import.meta.env.VITE_API_URL || 'https://[your-project-id].mockapi.io/api/v1'
```

The endpoints will be:
- `GET /restaurants` - Get all restaurants
- `GET /restaurants/:id` - Get restaurant by ID
- `POST /restaurants` - Create restaurant (optional)
- `PUT /restaurants/:id` - Update restaurant (optional)
- `DELETE /restaurants/:id` - Delete restaurant (optional)

### Step 8: Handle Cuisines Endpoint

MockAPI.io doesn't support custom endpoints like `/cuisines`, so you have two options:

#### Option A: Create a Separate Cuisines Resource

1. In MockAPI.io, create a new resource called `cuisines`
2. Add cuisine data from your `db.json`
3. Update the frontend to fetch from `/cuisines`

#### Option B: Extract Cuisines from Restaurants (Recommended)

Update your frontend to extract unique cuisines from the restaurants data.

## Detailed Setup Instructions

### Importing Restaurant Data

1. **Prepare your data:**
   - Open `db.json`
   - Copy only the `restaurants` array (without the `id` field)
   - Each restaurant should look like:
   ```json
   {
     "name": "Bella Italia",
     "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
     "rating": 4.5,
     "cuisineType": "Italian",
     "priceRange": "$$",
     "location": "Downtown",
     "description": "Authentic Italian cuisine with fresh ingredients",
     "menu": [...]
   }
   ```

2. **In MockAPI.io:**
   - Go to your `restaurants` resource
   - Click **"Import"** or **"Bulk Add"**
   - Paste your JSON array
   - Click **"Import"**

### Creating Cuisines Resource (Optional)

1. Create a new resource called `cuisines`
2. Add cuisine data:
   ```json
   [
     {
       "id": 1,
       "name": "Italian",
       "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400"
     },
     {
       "id": 2,
       "name": "Japanese",
       "image": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400"
     }
     // ... add all cuisines
   ]
   ```

## Frontend Code Updates

### Update restaurantApi.ts

Here's how to update your API file for MockAPI.io:

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Restaurant {
  id?: string // MockAPI.io uses string IDs
  name: string
  image: string
  rating: number
  cuisineType: string
  priceRange: string
  location: string
  description: string
  menu: MenuItem[]
}

// ... other interfaces ...

// MockAPI.io configuration
const baseUrl = import.meta.env.VITE_API_URL || 'https://[your-project-id].mockapi.io/api/v1'

export const restaurantApi = createApi({
  reducerPath: 'restaurantApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  tagTypes: ['Restaurant', 'Cuisine'],
  endpoints: (builder) => ({
    getRestaurants: builder.query<Restaurant[], void>({
      query: () => '/restaurants',
      providesTags: ['Restaurant'],
    }),
    getRestaurantById: builder.query<Restaurant, string>({
      query: (id) => `/restaurants/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Restaurant', id }],
    }),
    getCuisines: builder.query<Cuisine[], void>({
      query: () => '/cuisines', // If you created cuisines resource
      // OR extract from restaurants if not
      providesTags: ['Cuisine'],
    }),
    getRestaurantsByCuisine: builder.query<Restaurant[], string>({
      query: (cuisineType) => `/restaurants?cuisineType=${cuisineType}`,
      providesTags: ['Restaurant'],
    }),
  }),
})
```

### Alternative: Extract Cuisines from Restaurants

If you don't create a separate cuisines resource, update `getCuisines`:

```typescript
getCuisines: builder.query<Cuisine[], void>({
  query: () => '/restaurants',
  transformResponse: (response: Restaurant[]): Cuisine[] => {
    // Extract unique cuisines from restaurants
    const cuisineMap = new Map<string, Cuisine>()
    response.forEach((restaurant, index) => {
      if (!cuisineMap.has(restaurant.cuisineType)) {
        cuisineMap.set(restaurant.cuisineType, {
          id: cuisineMap.size + 1,
          name: restaurant.cuisineType,
          image: `https://images.unsplash.com/photo-${1500000000000 + index}?w=400`,
        })
      }
    })
    return Array.from(cuisineMap.values())
  },
  providesTags: ['Cuisine'],
}),
```

## Testing Your API

### Test Endpoints

1. **Get all restaurants:**
   ```
   https://[your-project-id].mockapi.io/api/v1/restaurants
   ```

2. **Get restaurant by ID:**
   ```
   https://[your-project-id].mockapi.io/api/v1/restaurants/1
   ```

3. **Filter by cuisine:**
   ```
   https://[your-project-id].mockapi.io/api/v1/restaurants?cuisineType=Italian
   ```

### Test in Browser

1. Open your API URL in a browser
2. You should see JSON data
3. Test different endpoints

### Test in Frontend

1. Update `.env` with your MockAPI.io URL
2. Restart your frontend dev server:
   ```bash
   npm run dev
   ```
3. Check browser console for any errors
4. Verify data is loading correctly

## MockAPI.io Features

### Free Tier Limits

- **50 resources** per project
- **1000 requests** per day
- **10,000 items** per resource

### Available Operations

- `GET /restaurants` - List all
- `GET /restaurants/:id` - Get one
- `POST /restaurants` - Create new
- `PUT /restaurants/:id` - Update
- `DELETE /restaurants/:id` - Delete
- `GET /restaurants?filter=value` - Filter

### Filtering

MockAPI.io supports filtering:
```
GET /restaurants?cuisineType=Italian
GET /restaurants?rating=4.5
GET /restaurants?priceRange=$$
```

## Troubleshooting

### Issue: CORS Errors

**Solution:** MockAPI.io handles CORS automatically. If you see CORS errors:
1. Check your API URL is correct
2. Ensure you're using the full URL with `https://`
3. Clear browser cache

### Issue: Data Not Loading

**Solution:**
1. Verify your API URL in `.env`
2. Check MockAPI.io dashboard - is data there?
3. Test the API URL directly in browser
4. Check browser console for errors

### Issue: IDs Are Strings

**Solution:** MockAPI.io uses string IDs. Your frontend should handle this:
```typescript
id: string // Not number
```

### Issue: Filtering Not Working

**Solution:** MockAPI.io filtering uses query parameters:
```
/restaurants?cuisineType=Italian
```

Not:
```
/restaurants/cuisine/Italian
```

## Advantages of MockAPI.io

✅ **No backend code needed**
✅ **No database setup**
✅ **Free tier available**
✅ **Cloud-hosted**
✅ **Easy to use**
✅ **Fast setup**

## Disadvantages

❌ **Rate limits** (1000 requests/day on free tier)
❌ **No custom endpoints** (like `/cuisines`)
❌ **Requires internet connection**
❌ **Data stored in cloud** (not local)

## Next Steps

1. ✅ Sign up for MockAPI.io
2. ✅ Create project and resources
3. ✅ Import restaurant data
4. ✅ Update frontend `.env`
5. ✅ Update frontend API code
6. ✅ Test the integration
7. 🎉 Start using your app!

## Quick Reference

**MockAPI.io Dashboard:** https://mockapi.io/projects

**Your API URL Format:**
```
https://[project-id].mockapi.io/api/v1
```

**Example Endpoints:**
- `GET /restaurants` - All restaurants
- `GET /restaurants/1` - Restaurant with ID 1
- `GET /restaurants?cuisineType=Italian` - Filter by cuisine

**Frontend .env:**
```env
VITE_API_URL=https://[your-project-id].mockapi.io/api/v1
```

Need help? Check the MockAPI.io documentation: https://mockapi.io/docs

