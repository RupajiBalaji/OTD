# ==========================================
# STAGE 1: Build & Transpile TypeScript
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Install build dependencies for native modules (e.g., argon2)
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install all dependencies including devDependencies for compilation
RUN npm ci

# Copy source code and configs
COPY tsconfig.json ./
COPY src/ ./src/

# Compile TypeScript to JavaScript in dist/
RUN npm run build

# Prune devDependencies to keep final image lightweight
RUN npm prune --production

# ==========================================
# STAGE 2: Production Execution Environment
# ==========================================
FROM node:22-alpine AS runner

WORKDIR /usr/src/app

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

# Install runtime dependencies for argon2/native binaries
RUN apk add --no-cache dumb-init

# Create non-root system user
RUN addgroup -S otd && adduser -S otd -G otd

# Copy pruned production node_modules from builder
COPY --chown=otd:otd --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=otd:otd --from=builder /usr/src/app/dist ./dist
COPY --chown=otd:otd --from=builder /usr/src/app/package.json ./package.json

USER otd

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
