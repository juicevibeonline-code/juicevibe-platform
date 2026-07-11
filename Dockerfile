FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
RUN apk add --no-cache libc6-compat

FROM base AS builder
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY apps/admin/package.json ./apps/admin/
COPY packages/database/package.json ./packages/database/
COPY packages/services/package.json ./packages/services/
COPY packages/config/package.json ./packages/config/
COPY packages/types/package.json ./packages/types/
COPY packages/ui/package.json ./packages/ui/
COPY packages/hooks/package.json ./packages/hooks/
COPY packages/utils/package.json ./packages/utils/

RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm db:generate
RUN pnpm build
RUN pnpm prune --prod

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app /app

EXPOSE 4000 3000
CMD ["pnpm", "--filter", "@juice-vibe/web", "start"]
