FROM nginx:alpine
ENV TZ="Asia/Shanghai"
ADD nginx.conf /etc/nginx/conf.d/default.conf
