#!/bin/sh

set -e

# ensure directories
mkdir -p storage/logs
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p bootstrap/cache

# fix permissions
chown -R www-data:www-data storage bootstrap/cache

# auto install composer if vendor missing
if [ ! -f vendor/autoload.php ]; then
    echo "📦 Installing composer dependencies..."
    composer install --no-interaction --prefer-dist
fi

# run php-fpm
exec php-fpm
