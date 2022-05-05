FROM nginx:alpine
ENV NODE_ENV production
ENV TZ="Asia/Shanghai"
COPY entrypoint.sh ./entrypoint.sh
ADD nginx.conf /etc/nginx/conf.d/default.conf
RUN chmod +x ./entrypoint.sh
CMD ./entrypoint.sh
