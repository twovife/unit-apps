#!/usr/bin/env bash
# Script deploy mantriapps v2 (unit-apps) di VPS: /srv/apps/mantriapps-deploy.sh
# Salinan pola app_laravel (/srv/apps/app_laravel-deploy.sh).
#
# Dipanggil oleh SSH key deploy GitHub Actions yang dikunci di authorized_keys:
#   command="/srv/apps/mantriapps-deploy.sh",restrict ssh-ed25519 ... github-actions-deploy-mantriapps
# Perintah apa pun yang dikirim lewat key itu hanya sampai ke sini sebagai SSH_ORIGINAL_COMMAND.
# Yang diterima hanya "<tujuan> <tag>": tujuan staging/production/preproduction, tag rilis v1.2.3.
# Migrasi tidak dijalankan (migrasi hanya dari app_laravel - database dipakai bersama).
#
# Manual / rollback dari VPS: /srv/apps/mantriapps-deploy.sh production v1.2.2
set -euo pipefail

read -r TUJUAN TAG <<< "${SSH_ORIGINAL_COMMAND:-$*}"
IMAGE=ghcr.io/twovife/mantriapps

case "${TUJUAN:-}" in
    staging)    APP_DIR=/srv/apps/staging/mantriappsv2 ;;   # stagingmantriapps.usberdigital.com
    production) APP_DIR=/srv/apps/production/muv ;;          # muv.ubmidigital.com
    # Salinan production (DB production yang sama) untuk dipakai dulu saat production ramai.
    preproduction) APP_DIR=/srv/apps/preproduction/muvpre ;; # preproduction.usberdigital.com
    *) echo "Tujuan tidak valid: '${TUJUAN:-}' (staging / production / preproduction)" >&2; exit 1 ;;
esac

if [[ ! "${TAG:-}" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Tag tidak valid: '${TAG:-}' (format: v1.2.3)" >&2
    exit 1
fi

cd "$APP_DIR"

# Satu deploy dalam satu waktu per tujuan
exec 9>"/tmp/mantriapps-deploy-${TUJUAN}.lock"
flock 9

# Tarik dulu; kalau tag tidak ada di ghcr, file konfigurasi belum tersentuh
docker pull "${IMAGE}:${TAG}"

# Tag image tertulis di dua tempat: service php dan COPY --from di Dockerfile.nginx
sed -i -E "s#${IMAGE}:[^[:space:]]+#${IMAGE}:${TAG}#" docker-compose.yml Dockerfile.nginx

# nginx mengambil public/ dari image php yang sama
docker compose build nginx
docker compose up -d
docker image prune -f

echo "Deploy ${TAG} ke ${TUJUAN} selesai."
docker compose ps
