# Quick Start - MockAPI.io Setup

Follow these steps to set up MockAPI.io as your backend API.

## 🚀 Quick Setup (10 minutes)

### Step 1: Sign Up for MockAPI.io

1. Go to [https://mockapi.io](https://mockapi.io)
2. Click **"Sign Up"** or **"Get Started"**
3. Sign up with email or Google account
4. Verify your email if required

### Step 2: Create a Project

1. After logging in, click **"New Project"**
2. Project name: `Restaurant API`
3. Click **"Create"**

### Step 3: Create Restaurant Resource

1. Click **"New Resource"**
2. Resource name: `restaurants` (must be lowercase, plural)
3. Click **"Create"**

### Step 4: Convert and Import Data

**Option A: Use the Helper Script (Recommended)**

1. Run the conversion script:
   ```bash
   node convert-for-mockapi.js
   ```

2. This creates `mockapi-data/restaurants.json` and `mockapi-data/cuisines.json`

3. In MockAPI.io:
   - Go to your `restaurants` resource
   - Click **"Import"** or **"Bulk Add"**
   - Copy the contents of `mockapi-data/restaurants.json`
   - Paste and click **"Import"**

**Option B: Manual Import**

1. Open `db.json`
2. Copy the `restaurants` array
3. Remove the `id` field from each restaurant (MockAPI will auto-generate IDs)
4. In MockAPI.io, go to `restaurants` resource
5. Click **"Import"** and paste the JSON array

### Step 5: Create Cuisines Resource (Optional)

1. Click **"New Resource"**
2. Resource name: `cuisines`
3. Click **"Create"**
4. Import data from `mockapi-data/cuisines.json` (if you ran the script)
   OR manually add cuisine data

### Step 6: Get Your API URL

1. In your MockAPI.io project dashboard
2. Copy your **API URL**
   - Format: `https://[your-project-id].mockapi.io/api/v1`
   - Example: `https://1234567890abcdef.mockapi.io/api/v1`

### Step 7: Update Frontend Configuration

1. Create or update `.env` file in project root:
   ```bash
   VITE_API_URL=https://[your-project-id].mockapi.io/api/v1
   ```

2. Replace `[your-project-id]` with your actual project ID

### Step 8: Update Frontend API Code

**Option A: Use the MockAPI.io Version**

1. Copy `src/store/api/restaurantApi.mockapi.ts` to `restaurantApi.ts`:
   ```bash
   cp src/store/api/restaurantApi.mockapi.ts src/store/api/restaurantApi.ts
   ```

2. Update the `baseUrl` in the file with your project ID:
   ```typescript
   const baseUrl = import.meta.env.VITE_API_URL || 'https://[your-project-id].mockapi.io/api/v1'
   ```

**Option B: Manual Update**

Update `src/store/api/restaurantApi.ts`:

1. Change baseUrl to your MockAPI.io URL
2. Update `getRestaurantsByCuisine` to use query parameters:
   ```typescript
   query: (cuisineType) => `/restaurants?cuisineType=${encodeURIComponent(cuisineType)}`
   ```

### Step 9: Test Your API

1. **Test in Browser:**
   ```
   https://[your-project-id].mockapi.io/api/v1/restaurants
   ```

2. **Test Frontend:**
   ```bash
   npm run dev
   ```

3. Check browser console for any errors
4. Verify data is loading correctly

## ✅ That's It!

Your app is now using MockAPI.io as the backend!

## 📋 Checklist

- [ ] Signed up for MockAPI.io
- [ ] Created project
- [ ] Created `restaurants` resource
- [ ] Imported restaurant data
- [ ] Created `cuisines` resource (optional)
- [ ] Got API URL
- [ ] Updated frontend `.env`
- [ ] Updated frontend API code
- [ ] Tested API in browser
- [ ] Tested frontend app

## 🔧 Troubleshooting

### Issue: Data Not Loading

**Solution:**
1. Check your API URL in `.env`
2. Verify data exists in MockAPI.io dashboard
3. Test API URL directly in browser
4. Check browser console for errors

### Issue: CORS Errors

**Solution:** MockAPI.io handles CORS automatically. If you see errors:
1. Ensure you're using the full URL with `https://`
2. Clear browser cache
3. Restart dev server

### Issue: Filtering Not Working

**Solution:** MockAPI.io uses query parameters:
```
/restaurants?cuisineType=Italian
```

Not:
```
/restaurants/cuisine/Italian
```

### Issue: IDs Are Strings

**Solution:** MockAPI.io uses string IDs. Your code should handle this:
```typescript
id: string // Not number
```

## 📚 More Information

- See `MOCKAPI_SETUP.md` for detailed instructions
- MockAPI.io Docs: https://mockapi.io/docs
- MockAPI.io Dashboard: https://mockapi.io/projects

## 🎯 Next Steps

1. ✅ MockAPI.io is set up
2. ✅ Data is imported
3. ✅ Frontend is configured
4. 🎉 Start using your app!

## 💡 Tips

- **Free Tier Limits:** 1000 requests/day, 10,000 items/resource
- **Filtering:** Use query parameters: `?cuisineType=Italian`
- **IDs:** MockAPI.io auto-generates string IDs
- **Updates:** Changes in MockAPI.io dashboard are instant

Need help? Check `MOCKAPI_SETUP.md` for detailed documentation.

