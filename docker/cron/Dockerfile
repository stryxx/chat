FROM php_base AS cron

COPY . /var/www/html

WORKDIR /var/www/html

CMD ["cron", "-f"]
