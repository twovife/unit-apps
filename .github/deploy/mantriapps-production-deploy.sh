#!/usr/bin/env bash
# Script deploy PRODUCTION mantriapps v2 (unit-apps, tag dari main) di VPS:
#   /srv/apps/production/muv/deploy.sh   (muv.ubmidigital.com)
#
# Dipanggil oleh SSH key deploy GitHub Actions yang dikunci di authorized_keys:
#   command="/srv/apps/production/muv/deploy.sh",restrict ssh-ed25519 ... github-actions-deploy-muv
# Perintah apa pun yang dikirim lewat key itu hanya sampai ke sini sebagai SSH_ORIGINAL_COMMAND,
# dan satu-satunya yang diterima adalah tag rilis (v1.2.3). Migrasi tidak dijalankan
# (migrasi hanya dari app_laravel - database dipakai bersama).
#
# Manual / rollback dari VPS: ./deploy.sh v1.2.2
set -euo pipefail

TAG="${SSH_ORIGINAL_COMMAND:-${1:-}}"
IMAGE=ghcr.io/twovife/mantriapps
APP_DIR=/srv/apps/production/muv

if [[ ! "$TAG" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Tag tidak valid: '$TAG' (format: v1.2.3)" >&2
    exit 1
fi

cd "$APP_DIR"

# Satu deploy dalam satu waktu
exec 9>/tmp/muv-deploy.lock
flock 9

# Tarik dulu; kalau tag tidak ada di ghcr, file konfigurasi belum tersentuh
docker pull "${IMAGE}:${TAG}"

# Tag image tertulis di dua tempat: service php dan COPY --from di Dockerfile.nginx.
# Hanya tag rilis v*, production lama (/srv/apps/production/mantriapps) tak tersentuh.
sed -i -E "s#${IMAGE}:v[0-9]+\.[0-9]+\.[0-9]+#${IMAGE}:${TAG}#" docker-compose.yml Dockerfile.nginx

# nginx mengambil public/ dari image php yang sama
docker compose build nginx
docker compose up -d
docker image prune -f

echo "Deploy ${TAG} selesai."
docker compose ps
