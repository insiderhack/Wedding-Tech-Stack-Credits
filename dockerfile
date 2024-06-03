# Stage 1: Build the Application
FROM node:18-alpine AS builder

WORKDIR /app

# 1. Cache Dependencies
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/app/node_modules npm ci --omit=dev

COPY . .
RUN npm run build

# Stage 2: Production Environment (Using the base image with ONBUILD)
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000

# Copy only essential files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

EXPOSE 3000

# Use a non-root user to improve security
USER node

CMD ["npm", "start"]
