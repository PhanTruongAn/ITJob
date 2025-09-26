# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài dependencies
RUN npm install --frozen-lockfile

# Copy toàn bộ source code
COPY . .

# Build production
RUN npm run build

# Stage 2: Run app
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist


EXPOSE 4173

CMD ["npx", "vite", "preview", "--port", "4173", "--host"]
