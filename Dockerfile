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


# Runtime Stage — Serve with Nginx
FROM nginx:alpine AS runner

# Prepare directories for rootless operation
RUN mkdir -p /var/cache/nginx /var/run/nginx /run \
    && touch /run/nginx.pid \
    && chown -R 1000:1000 /var/cache/nginx /var/run/nginx /etc/nginx /run/nginx.pid

# Copy Angular build
COPY --from=builder /app/dist/ngelmak-web/browser /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

USER 1000:1000

CMD ["nginx", "-g", "daemon off;"]
