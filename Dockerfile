FROM nginx:alpine
ENV NODE_ENV production
ENV TZ="Asia/Shanghai"
ADD nginx.conf /etc/nginx/conf.d/default.conf

