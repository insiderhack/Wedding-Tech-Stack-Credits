# Stage 1: Build the Application
FROM node:18-alpine AS builder

WORKDIR /app

# 1. Cache Dependencies
COPY package.json package-lock.json ./
# Use --mount=type=cache to cache the node_modules folder
RUN --mount=type=cache,target=/app/node_modules npm ci --omit=dev

COPY . .
RUN npm run build

# Stage 2: Production Environment
FROM node:18-alpine

# Install only 'production' dependencies
FROM node:18-alpine ONBUILD

WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

EXPOSE 3000
USER node
CMD ["npm", "start"]
