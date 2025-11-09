# Multi-stage build for React/Vite application

# ---------- Stage 1: Build ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency files first (leverage Docker cache)
COPY package*.json ./

# Install dependencies (npm ci uses package-lock.json automatically)
RUN npm ci

# Copy application source
COPY . .

# Pass build-time API configuration as build arguments
# MockAPI.io doesn't require API keys, only the API URL
ARG VITE_API_URL

# Set environment variable for Vite build (Vite embeds this at build time)
# Default to MockAPI.io URL if not provided
ENV VITE_API_URL=${VITE_API_URL:-https://690dc4e6bd0fefc30a0241c0.mockapi.io/api/v1}

# Build optimized production bundle
RUN npm run build && npm cache clean --force

# ---------- Stage 2: NGINX serve ----------
FROM nginx:stable-alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Clean default nginx content
RUN rm -rf ./*

# Copy built app from builder
COPY --from=builder /app/dist .

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Run nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]

