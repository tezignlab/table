FROM node:14-alpine as builder
WORKDIR /web
ADD package.json .
ADD yarn.lock .
RUN yarn
ADD . .
RUN yarn build

FROM nginx:alpine
ENV TZ="Asia/Shanghai"
WORKDIR /web
COPY --from=builder /web/dist /usr/share/nginx/html
ADD nginx.conf /etc/nginx/conf.d/default.conf