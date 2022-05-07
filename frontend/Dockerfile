FROM node:lts-bullseye AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:lts-bullseye AS builder
WORKDIR /app
ENV NODE_ENV production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM node:16-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV TZ="Asia/Shanghai"
COPY --from=builder /app /app
CMD ["yarn", "start"]

