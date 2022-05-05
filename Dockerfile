FROM nginx:alpine
RUN apk add nodejs npm
ENV NODE_ENV production
ENV TZ="Asia/Shanghai"
WORKDIR /app
COPY --from=builder /app /app
ADD nginx.conf /etc/nginx/conf.d/default.conf
RUN chmod +x entrypoint.sh
CMD ./entrypoint.sh
