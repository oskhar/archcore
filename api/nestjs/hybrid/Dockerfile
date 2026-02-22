# Base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy root package.json and workspace package.json's
COPY package.json package-lock.json ./
COPY apps/api-gateway/package.json ./apps/api-gateway/
COPY apps/products-service/package.json ./apps/products-service/
COPY apps/inventories-service/package.json ./apps/inventories-service/
COPY apps/sales-service/package.json ./apps/sales-service/

RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Run build for all apps
RUN npx turbo run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# You should not run as root for security reasons
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# We only need the built files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/apps ./apps
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/turbo.json ./turbo.json

USER nestjs

# The command will be overridden in docker-compose
CMD ["node", "apps/api-gateway/dist/main"]
