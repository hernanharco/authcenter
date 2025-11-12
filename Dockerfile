# ==== Base Stage ====
FROM node:20-alpine AS base
WORKDIR /app

# ==== Dependencies Stage ====
FROM base AS deps
COPY package.json ./
RUN npm install

# ==== Builder Stage ====
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ==== Runner Stage ====
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
