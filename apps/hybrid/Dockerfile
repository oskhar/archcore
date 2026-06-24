FROM node:20-slim AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY turbo.json ./
COPY apps/api-gateway/package*.json ./apps/api-gateway/
COPY apps/inventory-service/package*.json ./apps/inventory-service/
COPY apps/product-service/package*.json ./apps/product-service/
COPY apps/sales-service/package*.json ./apps/sales-service/
COPY packages/contracts/package*.json ./packages/contracts/
COPY packages/eslint-config/package*.json ./packages/eslint-config/
COPY packages/tsconfig/package*.json ./packages/tsconfig/

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Build all packages and apps
RUN npm run build

FROM node:20-slim

WORKDIR /app

ARG APP_NAME
ENV APP_NAME=${APP_NAME}

# Copy built artifacts from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/${APP_NAME}/dist ./apps/${APP_NAME}/dist
COPY --from=builder /app/apps/${APP_NAME}/package.json ./apps/${APP_NAME}/package.json
COPY --from=builder /app/packages ./packages
# Also need node_modules in the specific app if they were not hoisted correctly, 
# but in npm workspaces they should be in root.
# We also need the root package.json for workspace resolution if node_modules are hoisted.
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000 3001 3002 3003

CMD node apps/${APP_NAME}/dist/main.js
