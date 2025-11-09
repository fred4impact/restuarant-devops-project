# Quick Start: Connect to Backend API

## Fastest Option: JSON Server (Recommended for Development)

### Step 1: Install JSON Server
```bash
npm install -g json-server
```

### Step 2: Start the Mock API Server
```bash
json-server --watch db.json --port 5000
```

You should see:
```
\{^_^}/ hi!

Loading db.json
Done

Resources
http://localhost:5000/restaurants
http://localhost:5000/cuisines

Home
http://localhost:5000
```

### Step 3: Create `.env` file in project root
```bash
VITE_API_URL=http://localhost:5000
```

### Step 4: Update `restaurantApi.ts`

Replace the mock `queryFn` with actual `query` endpoints:

**File:** `src/store/api/restaurantApi.ts`

**Change from:**
```typescript
getRestaurants: builder.query<Restaurant[], void>({
  queryFn: async () => {
    // Mock data
    return { data: mockRestaurants }
  },
}),
```

**Change to:**
```typescript
getRestaurants: builder.query<Restaurant[], void>({
  query: () => '/restaurants',
}),
```

**Do the same for other endpoints:**

```typescript
getRestaurantById: builder.query<Restaurant, number>({
  query: (id) => `/restaurants/${id}`,
}),

getCuisines: builder.query<Cuisine[], void>({
  query: () => '/cuisines',
}),

getRestaurantsByCuisine: builder.query<Restaurant[], string>({
  query: (cuisineType) => `/restaurants?cuisineType=${cuisineType}`,
}),
```

### Step 5: Test the Connection

1. Make sure JSON Server is running on port 5000
2. Start your frontend: `npm run dev`
3. Open the app in your browser
4. You should see data from the API!

---

## Alternative: Use Your Own Backend

If you have a backend API running, just update the `.env` file:

```bash
VITE_API_URL=http://localhost:5000/api
# or
VITE_API_URL=https://your-api-domain.com/api
```

Then update `restaurantApi.ts` endpoints to match your API structure.

---

## Troubleshooting

**CORS Error?**
- Make sure your backend allows CORS from `http://localhost:3000`
- For JSON Server, CORS is enabled by default

**404 Not Found?**
- Check that JSON Server is running
- Verify the endpoint URLs match your API structure
- Check browser console for errors

**Data not showing?**
- Check Network tab in browser DevTools
- Verify API responses match your TypeScript interfaces
- Check Redux DevTools for API state

---

## Next Steps

1. ✅ JSON Server running on port 5000
2. ✅ `.env` file created with `VITE_API_URL`
3. ✅ `restaurantApi.ts` updated to use `query` instead of `queryFn`
4. ✅ Frontend running and connected to API

**Need help?** Check `BACKEND_API_GUIDE.md` for more detailed options!

