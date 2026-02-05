# -------------------------------------------------------
# 🏗️ Build Stage — Compile Angular App
# -------------------------------------------------------
# Using a lightweight Node image reduces build time and image size
FROM node:22-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy only package files first to leverage Docker cache
# This ensures "npm ci" is only re-run when dependencies change
COPY package*.json ./

# Install dependencies using npm ci for reproducible builds
RUN npm ci

# Copy the rest of the Angular project
COPY . .

# Build Angular app in production mode
RUN npm run build --prod


# -------------------------------------------------------
# 🚀 Runtime Stage — Serve with Nginx
# -------------------------------------------------------
FROM nginx:alpine AS runner

# Copy built Angular files from the builder stage to Nginx's public folder
# Angular 17+ outputs to dist/<project>/browser
COPY --from=builder /app/dist/ngelmak-web/browser /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose ports
EXPOSE 80 443

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
