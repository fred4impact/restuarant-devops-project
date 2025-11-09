# Foursquare API Credits Issue - Solutions

## Problem
Your Foursquare API account has no credits remaining. Error 429 indicates you've exceeded your free tier limit.

## Solutions

### Option 1: Add Credits to Foursquare (For Production)

1. **Visit Foursquare Billing:**
   - Go to: https://foursquare.com/developers/orgs
   - Sign in to your account
   - Add credits or enable automatic payments

2. **Check Your Usage:**
   - Review your API usage in the Foursquare dashboard
   - Understand your free tier limits
   - Consider upgrading if needed

### Option 2: Use Mock Data with JSON Server (For Development) ⭐ Recommended

This is the fastest solution for development and testing.

#### Step 1: Install JSON Server
```bash
npm install -g json-server
```

#### Step 2: Start JSON Server
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
```

#### Step 3: Update `.env` File
```bash
# Comment out or remove Foursquare API
# VITE_FOURSQUARE_SERVICE_KEY=WMKDFIS03544N0EG3ZRV5LX2COILF1BWEBQUEJ1DFAP2AAOM

# Add JSON Server URL
VITE_API_URL=http://localhost:5000
```

#### Step 4: Update `restaurantApi.ts`

Change the base URL to use JSON Server:

```typescript
// Change from:
const baseUrl = import.meta.env.DEV 
  ? '/api/foursquare' 
  : (import.meta.env.VITE_FOURSQUARE_API_URL || 'https://places-api.foursquare.com')

// To:
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
```

And update endpoints to match JSON Server:

```typescript
getRestaurants: builder.query<Restaurant[], void>({
  query: () => '/restaurants',
}),

getRestaurantById: builder.query<Restaurant, string>({
  query: (id) => `/restaurants/${id}`,
}),

getCuisines: builder.query<Cuisine[], void>({
  query: () => '/cuisines',
}),

getRestaurantsByCuisine: builder.query<Restaurant[], string>({
  query: (cuisineType) => `/restaurants?cuisineType=${cuisineType}`,
}),
```

**Note:** You'll need to convert IDs from string to number for JSON Server, or update `db.json` to use string IDs.

### Option 3: Use Another API Service

Consider switching to:
- **Yelp Fusion API** - 5,000 calls/day free
- **Google Places API** - $200/month credit
- **Foursquare Places API** - After adding credits

### Option 4: Create Your Own Backend

Build your own backend API with:
- Node.js + Express + MongoDB
- Python + Flask + SQLite
- Or any other backend stack

See `BACKEND_API_GUIDE.md` for detailed instructions.

---

## Quick Fix: Use JSON Server Now

1. **Terminal 1 - Start JSON Server:**
   ```bash
   json-server --watch db.json --port 5000
   ```

2. **Terminal 2 - Update `.env`:**
   ```bash
   # Remove Foursquare config, add:
   VITE_API_URL=http://localhost:5000
   ```

3. **Update `restaurantApi.ts`** to use JSON Server endpoints (see above)

4. **Restart dev server:**
   ```bash
   npm run dev
   ```

---

## Next Steps

1. **For Development:** Use JSON Server with `db.json` (already created)
2. **For Production:** Add credits to Foursquare or use another API
3. **Long-term:** Consider building your own backend API

---

## Notes

- JSON Server is perfect for development and testing
- `db.json` already contains sample restaurant data
- No API credits needed for JSON Server
- Easy to switch back to Foursquare when credits are added

**Need help with any step? Let me know!**

