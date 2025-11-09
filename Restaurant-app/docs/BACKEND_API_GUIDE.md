# Backend API Setup Guide

This guide provides multiple options for obtaining a backend API for your Restaurant Discovery App.

## Option 1: Use Existing Restaurant APIs (Quickest)

### A. Yelp Fusion API (Recommended)

**Steps:**

1. **Sign up for Yelp API:**
   - Go to https://www.yelp.com/developers
   - Create a Yelp account
   - Create a new app to get your API key

2. **Get API Key:**
   - After creating an app, you'll receive an API key
   - Copy the API key

3. **Create `.env` file:**
   ```bash
   VITE_API_URL=https://api.yelp.com/v3
   VITE_YELP_API_KEY=your_yelp_api_key_here
   ```

4. **Update `restaurantApi.ts`:**
   - Replace `queryFn` with actual API calls
   - Add authorization header with Yelp API key

**Pros:** Real restaurant data, no backend needed
**Cons:** Rate limits, requires API key, may need CORS proxy

---

### B. Zomato API (Alternative)

**Steps:**

1. **Sign up:**
   - Go to https://developers.zomato.com/api
   - Register and get API key

2. **Create `.env` file:**
   ```bash
   VITE_API_URL=https://developers.zomato.com/api/v2.1
   VITE_ZOMATO_API_KEY=your_zomato_api_key_here
   ```

**Pros:** Good restaurant data
**Cons:** Limited free tier, may be discontinued

---

## Option 2: Create Your Own Backend API

### A. Node.js + Express + MongoDB (Recommended)

**Steps:**

1. **Create backend folder:**
   ```bash
   mkdir restaurant-api
   cd restaurant-api
   npm init -y
   ```

2. **Install dependencies:**
   ```bash
   npm install express mongoose cors dotenv
   npm install -D nodemon typescript @types/express @types/node
   ```

3. **Create `server.js`:**
   ```javascript
   const express = require('express');
   const mongoose = require('mongoose');
   const cors = require('cors');
   require('dotenv').config();

   const app = express();
   app.use(cors());
   app.use(express.json());

   // Connect to MongoDB
   mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurants');

   // Restaurant Schema
   const restaurantSchema = new mongoose.Schema({
     name: String,
     image: String,
     rating: Number,
     cuisineType: String,
     priceRange: String,
     location: String,
     description: String,
     menu: [{
       name: String,
       description: String,
       price: Number,
       category: String,
       image: String
     }]
   });

   const Restaurant = mongoose.model('Restaurant', restaurantSchema);

   // Routes
   app.get('/api/restaurants', async (req, res) => {
     try {
       const restaurants = await Restaurant.find();
       res.json(restaurants);
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });

   app.get('/api/restaurants/:id', async (req, res) => {
     try {
       const restaurant = await Restaurant.findById(req.params.id);
       if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
       res.json(restaurant);
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });

   app.get('/api/cuisines', async (req, res) => {
     try {
       const cuisines = await Restaurant.distinct('cuisineType');
       const cuisineList = cuisines.map((name, index) => ({
         id: index + 1,
         name,
         image: `https://images.unsplash.com/photo-${1500000000000 + index}?w=400`
       }));
       res.json(cuisineList);
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });

   app.get('/api/restaurants/cuisine/:cuisineType', async (req, res) => {
     try {
       const restaurants = await Restaurant.find({ 
         cuisineType: req.params.cuisineType 
       });
       res.json(restaurants);
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });

   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });
   ```

4. **Create `.env` file:**
   ```bash
   MONGODB_URI=mongodb://localhost:27017/restaurants
   PORT=5000
   ```

5. **Update `package.json`:**
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

6. **Start MongoDB:**
   ```bash
   # Install MongoDB locally or use MongoDB Atlas (cloud)
   # For local: brew install mongodb-community (Mac)
   mongod
   ```

7. **Seed database (optional):**
   - Create a script to populate initial data
   - Or use MongoDB Compass to add data manually

8. **Update frontend `.env`:**
   ```bash
   VITE_API_URL=http://localhost:5000/api
   ```

**Pros:** Full control, can customize data structure
**Cons:** Requires backend setup and database

---

### B. Python + Flask + SQLite (Simpler Alternative)

**Steps:**

1. **Create backend folder:**
   ```bash
   mkdir restaurant-api
   cd restaurant-api
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install flask flask-cors
   ```

3. **Create `app.py`:**
   ```python
   from flask import Flask, jsonify
   from flask_cors import CORS
   import json

   app = Flask(__name__)
   CORS(app)

   # Load mock data (or connect to database)
   with open('data.json', 'r') as f:
       restaurants = json.load(f)

   @app.route('/api/restaurants', methods=['GET'])
   def get_restaurants():
       return jsonify(restaurants)

   @app.route('/api/restaurants/<int:id>', methods=['GET'])
   def get_restaurant(id):
       restaurant = next((r for r in restaurants if r['id'] == id), None)
       if restaurant:
           return jsonify(restaurant)
       return jsonify({'error': 'Restaurant not found'}), 404

   @app.route('/api/cuisines', methods=['GET'])
   def get_cuisines():
       cuisines = list(set(r['cuisineType'] for r in restaurants))
       return jsonify([{'id': i+1, 'name': c, 'image': f'https://images.unsplash.com/photo-{1500000000000+i}?w=400'} 
                      for i, c in enumerate(cuisines)])

   @app.route('/api/restaurants/cuisine/<cuisineType>', methods=['GET'])
   def get_restaurants_by_cuisine(cuisineType):
       filtered = [r for r in restaurants if r['cuisineType'].lower() == cuisineType.lower()]
       return jsonify(filtered)

   if __name__ == '__main__':
       app.run(port=5000, debug=True)
   ```

4. **Create `data.json` with restaurant data**

5. **Run:**
   ```bash
   python app.py
   ```

**Pros:** Simple, no database needed initially
**Cons:** Less scalable, data in JSON file

---

## Option 3: Use Mock API Services (Fastest for Development)

### A. JSON Server (Recommended for Development)

**Steps:**

1. **Install JSON Server:**
   ```bash
   npm install -g json-server
   ```

2. **Create `db.json` in your project root:**
   ```json
   {
     "restaurants": [
       {
         "id": 1,
         "name": "Bella Italia",
         "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
         "rating": 4.5,
         "cuisineType": "Italian",
         "priceRange": "$$",
         "location": "Downtown",
         "description": "Authentic Italian cuisine with fresh ingredients",
         "menu": [
           {
             "id": 1,
             "name": "Margherita Pizza",
             "description": "Fresh mozzarella, tomato sauce, basil",
             "price": 18.99,
             "category": "Pizza"
           }
         ]
       }
     ],
     "cuisines": [
       {"id": 1, "name": "Italian", "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400"}
     ]
   }
   ```

3. **Start JSON Server:**
   ```bash
   json-server --watch db.json --port 5000
   ```

4. **Update frontend `.env`:**
   ```bash
   VITE_API_URL=http://localhost:5000
   ```

5. **Update `restaurantApi.ts` endpoints:**
   - `/restaurants` → `/restaurants`
   - `/restaurants/:id` → `/restaurants/:id`
   - `/cuisines` → `/cuisines`
   - `/restaurants/cuisine/:cuisineType` → `/restaurants?cuisineType=:cuisineType`

**Pros:** Instant setup, no backend code needed
**Cons:** Not for production, limited features

---

### B. MockAPI.io (Cloud-based)

**Steps:**

1. **Sign up:** https://mockapi.io
2. **Create a project**
3. **Create resources:** `restaurants`, `cuisines`
4. **Get API URL:** `https://your-project-id.mockapi.io/api/v1`
5. **Update `.env`:**
   ```bash
   VITE_API_URL=https://your-project-id.mockapi.io/api/v1
   ```

**Pros:** Cloud-based, no local setup
**Cons:** Free tier limits, requires internet

---

## Option 4: Update Frontend to Use Real API

Once you have your backend API ready, update `restaurantApi.ts`:

### Current (Mock Data):
```typescript
getRestaurants: builder.query<Restaurant[], void>({
  queryFn: async () => {
    // Mock data
    return { data: mockRestaurants }
  },
}),
```

### Updated (Real API):
```typescript
getRestaurants: builder.query<Restaurant[], void>({
  query: () => '/restaurants',
}),
```

### With Authentication (Yelp example):
```typescript
getRestaurants: builder.query<Restaurant[], void>({
  query: () => ({
    url: '/businesses/search',
    params: { term: 'restaurants', location: 'New York' },
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_YELP_API_KEY}`
    }
  }),
  transformResponse: (response: any) => {
    // Transform Yelp API response to match your Restaurant interface
    return response.businesses.map((business: any) => ({
      id: business.id,
      name: business.name,
      image: business.image_url,
      rating: business.rating,
      cuisineType: business.categories[0]?.title || 'Unknown',
      priceRange: business.price || '$$',
      location: business.location.address1,
      description: business.alias,
      menu: [] // Yelp doesn't provide menu, you'd need another API
    }))
  }
}),
```

---

## Recommended Approach

**For Development:** Use **JSON Server** (Option 3A) - fastest setup
**For Production:** Create your own **Node.js + Express + MongoDB** backend (Option 2A)

---

## Quick Start with JSON Server

1. Install: `npm install -g json-server`
2. Create `db.json` with your restaurant data
3. Run: `json-server --watch db.json --port 5000`
4. Update `.env`: `VITE_API_URL=http://localhost:5000`
5. Update `restaurantApi.ts` to use `query` instead of `queryFn`

---

## Next Steps

1. Choose an option above
2. Set up your backend API
3. Update the `.env` file with your API URL
4. Update `restaurantApi.ts` to use real endpoints
5. Test the integration

Need help with a specific option? Let me know!

