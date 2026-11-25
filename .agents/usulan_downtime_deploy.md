# Proposal: shorter production deploy downtime (parked, mas 2026-10-26)

Not done yet. Keep the current deploy until mas decides.

## Cause of the 502 Bad Gateway
- The production deploy already uses the image tested on staging; there is no rebuild. The image is pulled and nginx is built before the swap.
- The 502 comes from `docker compose up -d` in /srv/apps/mantriapps-deploy.sh: php and nginx are replaced at the same time.
- The new php container runs 6 artisan commands before php-fpm is ready. Measured on staging 2026-10-26: about 2.4 s (about 0.4 s each).
- The real downtime has not been measured yet. Plan: probe staging every 0.2 s during a deploy.

## Options, cheapest first
1. Slim docker/entrypoint.sh: drop config:clear, route:clear and view:clear (config:cache and route:cache overwrite, and a new container has no view cache). Startup goes from about 2.4 s to about 1.2 s. This change is in the repo.
2. Deploy script on the VPS: `up -d --no-deps php`, wait until php-fpm listens on 9000, then `up -d --no-deps nginx`. The 502 window shrinks to the php restart only. mas changes the VPS; the repo copy is .github/deploy/mantriapps-deploy.sh.
3. Blue-green: start the new php next to the old one, switch nginx and Traefik once it is ready, then stop the old one. No 502, but the production docker-compose structure changes.

Recommendation: 1 and 2 first; 3 only if the downtime is still noticeable.
