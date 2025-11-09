# Quick Start - Backend Setup

Your Node.js + Express + MongoDB backend is ready! Follow these steps to get it running.

## 🚀 Quick Start (5 minutes)

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Set Up MongoDB

**Option A: MongoDB Atlas (Cloud - Easiest)**
1. Sign up at https://www.mongodb.com/cloud/atlas (free)
2. Create a cluster
3. Get your connection string
4. Add it to `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurants
   PORT=5000
   ```

**Option B: Local MongoDB**
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community
```

Then in `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/restaurants
PORT=5000
```

### Step 3: Seed the Database

```bash
cd backend
npm run seed
```

### Step 4: Start Backend Server

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 5: Configure Frontend

Create `.env` in project root:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 6: Start Frontend

In a new terminal:
```bash
npm run dev
```

## ✅ That's It!

Your app is now using your own backend instead of Foursquare API!

## 📁 What Was Created

- `backend/` - Complete Node.js + Express + MongoDB backend
  - `src/server.js` - Express server
  - `src/models/Restaurant.js` - MongoDB schema
  - `src/routes/restaurantRoutes.js` - API endpoints
  - `src/scripts/seed.js` - Database seeding script
  - `src/config/database.js` - MongoDB connection

## 🔗 API Endpoints

- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `GET /api/cuisines` - Get all cuisines
- `GET /api/restaurants/cuisine/:cuisineType` - Get restaurants by cuisine
- `GET /health` - Health check

## 📚 More Details

- See `BACKEND_SETUP.md` for detailed setup instructions
- See `backend/README.md` for backend documentation

## 🐛 Troubleshooting

**Backend won't start?**
- Check MongoDB is running (local) or cluster is active (Atlas)
- Verify `.env` file exists in `backend/` folder
- Check port 5000 is not in use

**Database not seeding?**
- Ensure `db.json` exists in project root
- Check MongoDB connection string is correct
- Run `npm run seed` again

**Frontend not connecting?**
- Ensure backend is running
- Check `VITE_API_URL` in frontend `.env`
- Restart frontend dev server

