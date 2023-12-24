FROM nginx

COPY conf/* /etc/nginx/conf.d/

RUN rm -rf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]