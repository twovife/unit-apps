#!/usr/bin/env bash
# Script deploy STAGING mantriapps (unit-apps, branch develop) di VPS:
#   /srv/apps/staging/mantriappsv2/deploy.sh
#
# Dipanggil oleh SSH key deploy GitHub Actions yang dikunci di authorized_keys:
#   command="/srv/apps/staging/mantriappsv2/deploy.sh",restrict ssh-ed25519 ... github-actions-deploy-mantriappsv2
# Perintah apa pun yang dikirim lewat key itu hanya sampai ke sini sebagai SSH_ORIGINAL_COMMAND,
# dan satu-satunya yang diterima adalah tag image staging-<sha commit>. Migrasi tidak dijalankan
# (migrasi hanya dari app_laravel - database dipakai bersama).
#
# Manual / rollback dari VPS: ./deploy.sh staging-<sha 40 karakter>
set -euo pipefail

TAG="${SSH_ORIGINAL_COMMAND:-${1:-}}"
IMAGE=ghcr.io/twovife/mantriapps
APP_DIR=/srv/apps/staging/mantriappsv2

if [[ ! "$TAG" =~ ^staging-[0-9a-f]{40}$ ]]; then
    echo "Tag tidak valid: '$TAG' (format: staging-<sha commit>)" >&2
    exit 1
fi

cd "$APP_DIR"

# Satu deploy dalam satu waktu
exec 9>/tmp/mantriappsv2-deploy.lock
flock 9

# Tarik dulu; kalau tag tidak ada di ghcr, file konfigurasi belum tersentuh
docker pull "${IMAGE}:${TAG}"

# Tag image tertulis di dua tempat: service php dan COPY --from di Dockerfile.nginx.
# Hanya baris image staging (staging-...), production di folder lain tak tersentuh.
sed -i -E "s#${IMAGE}:staging-[^[:space:]]+#${IMAGE}:${TAG}#" docker-compose.yml Dockerfile.nginx

# nginx mengambil public/ dari image php yang sama
docker compose build nginx
docker compose up -d
docker image prune -f

echo "Deploy ${TAG} selesai."
docker compose ps
