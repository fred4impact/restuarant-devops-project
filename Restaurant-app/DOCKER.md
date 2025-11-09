# Docker Setup Guide

This guide explains how to run the Restaurant Discovery App using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, but recommended)

## Quick Start

### Production Build with Build Arguments

**Important:** Vite environment variables are embedded at **build time**, not runtime. You must pass them as build arguments.

1. **Build the Docker image with API configuration:**
   ```bash
   docker build \
     --build-arg VITE_API_URL=https://690dc4e6bd0fefc30a0241c0.mockapi.io/api/v1 \
     -t restaurant-app .
   ```

   Or with a different MockAPI.io project:
   ```bash
   docker build \
     --build-arg VITE_API_URL=https://your-project-id.mockapi.io/api/v1 \
     -t restaurant-app .
   ```

2. **Run the container:**
   ```bash
   docker run -p 3000:80 restaurant-app
   ```

3. **Access the app:**
   Open your browser and go to `http://localhost:3000`

### Using Docker Compose (Recommended)

1. **Create a `.env` file** with your MockAPI.io API URL:
   ```env
   # MockAPI.io API URL (embedded at build time)
   VITE_API_URL=https://690dc4e6bd0fefc30a0241c0.mockapi.io/api/v1
   ```
   
   **Note:** Replace with your own MockAPI.io project URL if different.

2. **Build and start the application:**
   ```bash
   docker-compose up -d --build
   ```

   The build arguments are automatically passed from your `.env` file.

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Stop the application:**
   ```bash
   docker-compose down
   ```

5. **Rebuild and restart:**
   ```bash
   docker-compose up -d --build
   ```

## Development Mode

For development with hot-reload:

1. **Build and run:**
   ```bash
   docker build -f Dockerfile.dev -t restaurant-app-dev .
   docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules --env-file .env restaurant-app-dev
   ```

   Or with Docker Compose:
   ```bash
   docker-compose -f docker-compose.dev.yml up
   ```

## Build Arguments

The Dockerfile accepts the following build argument (passed at build time):

- `VITE_API_URL` - MockAPI.io API endpoint URL (default: `https://690dc4e6bd0fefc30a0241c0.mockapi.io/api/v1`)

**Note:** MockAPI.io doesn't require API keys - it's a free mock API service. You only need to provide the API URL.

**Important:** This is a **build-time** argument, not a runtime environment variable. Vite embeds it into the JavaScript bundle during the build process. To change it, you must rebuild the Docker image.

### Passing Build Arguments

**Using docker build:**
```bash
# Build with default MockAPI.io URL
docker build -t restaurant-app .

# Build with custom MockAPI.io URL
docker build \
  --build-arg VITE_API_URL=https://your-project-id.mockapi.io/api/v1 \
  -t restaurant-app .
```

**Using docker-compose:**
The `docker-compose.yml` automatically reads from your `.env` file and passes it as a build argument.

## Docker Commands

### Build
```bash
# Basic build (uses default API URL)
docker build -t restaurant-app .

# Build with custom API URL
docker build --build-arg VITE_API_URL=https://your-api-url.com/api/v1 -t restaurant-app .

# Build with custom MockAPI.io URL
docker build \
  --build-arg VITE_API_URL=https://your-project-id.mockapi.io/api/v1 \
  -t restaurant-app .
```

### Run
```bash
docker run -p 3000:80 restaurant-app
```

**Note:** Environment variables are embedded at build time, not runtime. You cannot change them with `-e` flag. You must rebuild the image with `--build-arg`.

### Run in detached mode
```bash
docker run -d -p 3000:80 --name restaurant-app restaurant-app
```

### View logs
```bash
docker logs restaurant-app
```

### Stop container
```bash
docker stop restaurant-app
```

### Remove container
```bash
docker rm restaurant-app
```

### Remove image
```bash
docker rmi restaurant-app
```

## Production Deployment

### Build for Production

1. **Build the image:**
   ```bash
   docker build -t restaurant-app:latest .
   ```

2. **Tag for registry (optional):**
   ```bash
   docker tag restaurant-app:latest your-registry/restaurant-app:latest
   ```

3. **Push to registry (optional):**
   ```bash
   docker push your-registry/restaurant-app:latest
   ```

### Deploy to Cloud

The Docker image can be deployed to:
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform
- Heroku
- Any Docker-compatible platform

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, change the port mapping:
```bash
docker run -p 8080:80 restaurant-app
```

Then access at `http://localhost:8080`

### Environment Variables Not Working

Remember that Vite environment variables are embedded at **build time**. To change them:
1. Update `.env` file
2. Rebuild the Docker image
3. Restart the container

### Container Won't Start

Check logs:
```bash
docker logs restaurant-app
```

### Build Fails

1. Clear Docker cache:
   ```bash
   docker builder prune
   ```

2. Rebuild without cache:
   ```bash
   docker build --no-cache -t restaurant-app .
   ```

## File Structure

```
.
├── Dockerfile          # Production build
├── Dockerfile.dev      # Development build
├── docker-compose.yml  # Production compose
├── nginx.conf          # Nginx configuration
└── .dockerignore       # Files to exclude from build
```

## Notes

- The production build uses nginx to serve static files
- The development build uses Vite dev server with hot-reload
- Environment variables are embedded at build time for Vite
- The app is served on port 80 inside the container
- External port mapping can be customized (e.g., 3000:80)

