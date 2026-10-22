# syntax=docker/dockerfile:1.7

FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,id=tappy-api-build-npm,target=/root/.npm,sharing=locked npm ci

FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-bookworm-slim AS production-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,id=tappy-api-production-npm,target=/root/.npm,sharing=locked npm ci --omit=dev --ignore-scripts

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
RUN groupadd --system --gid 1001 nestjs && useradd --system --uid 1001 --gid nestjs nestjs
COPY --from=production-deps --chown=nestjs:nestjs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nestjs /app/dist ./dist
COPY --from=builder --chown=nestjs:nestjs /app/package.json ./package.json
USER nestjs
EXPOSE 3000
CMD ["node", "dist/main"]
