FROM nginx

RUN mkdir -p /etc/nginx/ssl/

COPY tools/* /etc/nginx/ssl/

COPY conf/* /etc/nginx/conf.d/

RUN rm -rf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]