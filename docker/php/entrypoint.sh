#!/bin/sh

if [ -d "/var/www/html/vendor" ] && [ ! -w "/var/www/html/vendor" ]; then
    echo "Naprawiam uprawnienia w kontenerze..."
    chown -R www-data:www-data /var/www/html/vendor /var/www/html/var /var/www/html/public
    chmod -R 755 /var/www/html/vendor /var/www/html/var /var/www/html/public
    chown -R www-data:www-data /var/www/html/var/cache
    chmod -R 775 /var/www/html/var/cache
fi

exec "$@"