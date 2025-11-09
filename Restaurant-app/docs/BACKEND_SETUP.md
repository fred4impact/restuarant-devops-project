# Backend Setup Guide - Quick Start

This guide will help you set up your Node.js + Express + MongoDB backend to replace the Foursquare API.

## Prerequisites

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** - Choose one:
   - **Local MongoDB**: Install locally
   - **MongoDB Atlas** (Recommended): Free cloud database - [Sign up](https://www.mongodb.com/cloud/atlas)

## Quick Setup Steps

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Set Up MongoDB

#### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier is fine)
4. Create a database user (username/password)
5. Whitelist your IP address (or use `0.0.0.0/0` for all IPs - development only)
6. Get your connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/restaurants`

#### Option B: Local MongoDB

**macOS:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
Download and install from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongod
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
touch .env
```

Add the following to `.env`:

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurants
PORT=5000
NODE_ENV=development
```

**For Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/restaurants
PORT=5000
NODE_ENV=development
```

### 4. Seed the Database

Populate your database with restaurant data from `db.json`:

```bash
npm run seed
```

You should see:
```
MongoDB Connected for seeding...
Cleared existing restaurants...
Seeded 8 restaurants successfully!

Database Summary:
- Total Restaurants: 8
- Cuisine Types: 8
- Cuisines: Italian, Japanese, Mexican, Chinese, French, Indian, Thai, Mediterranean
```

### 5. Start the Backend Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
MongoDB Connected: ...
Server running on port 5000
Environment: development
```

### 6. Update Frontend Environment

Create a `.env` file in the project root (if it doesn't exist):

```bash
# In the project root (not backend folder)
touch .env
```

Add:
```env
VITE_API_URL=http://localhost:5000/api
```

### 7. Start the Frontend

In a new terminal, from the project root:

```bash
npm run dev
```

## Testing the Backend

### Test Endpoints

1. **Health Check:**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Get All Restaurants:**
   ```bash
   curl http://localhost:5000/api/restaurants
   ```

3. **Get Cuisines:**
   ```bash
   curl http://localhost:5000/api/cuisines
   ```

4. **Get Restaurant by ID:**
   ```bash
   # First get a restaurant ID from the restaurants endpoint
   curl http://localhost:5000/api/restaurants/[ID]
   ```

5. **Get Restaurants by Cuisine:**
   ```bash
   curl http://localhost:5000/api/restaurants/cuisine/Italian
   ```

## Troubleshooting

### MongoDB Connection Issues

**Error: "MongoServerError: bad auth"**
- Check your username and password in the connection string
- Ensure you're using the correct database user

**Error: "MongoNetworkError: failed to connect"**
- Check if MongoDB Atlas cluster is running
- Verify your IP is whitelisted in MongoDB Atlas
- Check your internet connection

**Error: "connect ECONNREFUSED 127.0.0.1:27017"** (Local MongoDB)
- Ensure MongoDB is running:
  ```bash
  # macOS
  brew services start mongodb-community
  
  # Check status
  brew services list
  ```

### Port Already in Use

If port 5000 is already in use:

1. Change `PORT` in `backend/.env`:
   ```env
   PORT=5001
   ```

2. Update frontend `.env`:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

### Database Not Seeding

If the seed script fails:

1. Check that `db.json` exists in the project root
2. Verify MongoDB connection is working
3. Try running the seed script again:
   ```bash
   npm run seed
   ```

### Frontend Not Connecting

1. Ensure backend is running on the correct port
2. Check `VITE_API_URL` in frontend `.env`
3. Restart the frontend dev server after changing `.env`
4. Check browser console for CORS errors (should be handled by backend)

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js      # MongoDB connection
│   ├── models/
│   │   └── Restaurant.js    # Restaurant schema
│   ├── routes/
│   │   └── restaurantRoutes.js  # API routes
│   ├── scripts/
│   │   └── seed.js          # Database seeding script
│   └── server.js            # Express server
├── .env                     # Environment variables (create this)
├── .env.example            # Example environment file
├── package.json
└── README.md
```

## Next Steps

1. ✅ Backend is set up and running
2. ✅ Database is seeded with restaurant data
3. ✅ Frontend is configured to use the backend
4. 🎉 Test your app - it should work without Foursquare API!

## Additional Features

The backend supports:
- ✅ Get all restaurants
- ✅ Get restaurant by ID
- ✅ Get all cuisines
- ✅ Get restaurants by cuisine type
- ✅ Search restaurants (optional endpoint)

You can extend the backend with:
- User authentication
- Reviews and ratings
- Favorites/bookmarks
- Restaurant management (CRUD operations)

## Need Help?

Check the `backend/README.md` for more detailed documentation.

