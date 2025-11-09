# Fix MockAPI.io Data Import Issue

## Problem

The data in MockAPI.io was imported incorrectly. The entire `db.json` structure was imported as a single item, creating this structure:

```json
[
  {
    "restaurants": [...],
    "cuisines": [...]
  },
  ...other items...
]
```

But MockAPI.io should have a direct array of restaurants:

```json
[
  { restaurant 1 },
  { restaurant 2 },
  ...
]
```

## Solution

I've updated the API code to handle both structures, but it's better to fix the data in MockAPI.io.

### Option 1: Fix the Data in MockAPI.io (Recommended)

1. **Go to MockAPI.io Dashboard**
   - Navigate to your project
   - Go to the `restaurants` resource

2. **Delete All Existing Data**
   - Select all items
   - Click "Delete" or "Remove All"

3. **Re-import the Data Correctly**
   - Open `mockapi-data/restaurants.json` from your project
   - Copy the entire JSON array (should start with `[` and end with `]`)
   - In MockAPI.io, click "Import" or "Bulk Add"
   - Paste the JSON array
   - Click "Import"

4. **Verify the Structure**
   - After importing, check that you have 13 restaurant items
   - Each item should be a restaurant object (not nested in a `restaurants` property)
   - Test the API: `https://690dc4e6bd0fefc30a0241c0.mockapi.io/api/v1/restaurants`
   - Should return an array of restaurant objects directly

### Option 2: Keep Current Structure (Works but not ideal)

The API code has been updated to handle the current incorrect structure, so it should work now. However, filtering and other features may not work as expected.

## How to Verify

### Test the API

```bash
curl https://690dc4e6bd0fefc30a0241c0.mockapi.io/api/v1/restaurants
```

**Correct structure should look like:**
```json
[
  {
    "id": "1",
    "name": "Bella Italia",
    ...
  },
  {
    "id": "2",
    "name": "Sakura Sushi",
    ...
  }
]
```

**Incorrect structure (current):**
```json
[
  {
    "restaurants": [...],
    "cuisines": [...]
  },
  ...
]
```

## After Fixing

1. **Refresh your frontend**
   - The app should now load restaurants correctly
   - All features should work properly

2. **Test Filtering**
   - Filtering by cuisine should work correctly
   - Test: `https://690dc4e6bd0fefc30a0241c0.mockapi.io/api/v1/restaurants?cuisineType=Italian`

## Quick Fix Steps

1. ✅ Open MockAPI.io dashboard
2. ✅ Go to `restaurants` resource
3. ✅ Delete all items
4. ✅ Open `mockapi-data/restaurants.json`
5. ✅ Copy the entire JSON array
6. ✅ Import into MockAPI.io
7. ✅ Verify structure
8. ✅ Test in browser
9. ✅ Refresh frontend

The API code will work with both structures, but fixing the data is the best solution!

