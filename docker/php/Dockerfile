FROM php:8.4-fpm

RUN apt-get update && apt-get install -y \
    net-tools iputils-ping procps git unzip zip curl wget nano cron \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y \
    libpq-dev libzip-dev libjpeg-dev libpng-dev libfreetype6-dev libonig-dev \
    libxml2-dev libxslt1-dev libssl-dev libcurl4-openssl-dev libicu-dev \
    libbz2-dev libgmp-dev libsqlite3-dev libedit-dev zlib1g-dev \
    libsodium-dev \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        pdo pdo_mysql zip opcache mbstring xml xsl soap intl gd \
        sockets pcntl bcmath bz2 exif gmp sodium

RUN pecl install redis xdebug \
    && docker-php-ext-enable redis xdebug opcache

WORKDIR /var/www/html

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

CMD ["php-fpm"]
