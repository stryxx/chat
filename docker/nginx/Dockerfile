FROM nginx:latest

RUN apt-get update && apt-get install -y net-tools iputils-ping procps && rm -rf /var/lib/apt/lists/*

COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/default.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /etc/nginx/ssl

COPY ssl/cert.pem /etc/nginx/ssl/cert.pem
COPY ssl/key.pem /etc/nginx/ssl/key.pem

RUN ls -l /etc/nginx/
RUN ls -l /etc/nginx/conf.d/