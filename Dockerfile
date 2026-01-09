# --- Build Stage ---
FROM node:18 AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build Angular app
COPY . .
RUN npm run build --prod

# --- Runtime Stage ---
FROM nginx:alpine AS runner

# Copy built Angular app to Nginx
COPY --from=builder /app/dist/ngelmak-web /usr/share/nginx/html

# Expose frontend port
EXPOSE 4200

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]