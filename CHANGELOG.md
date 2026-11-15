# Changelog

<<<<<<< HEAD
## [1.0.0] - 2026-11-12

- Initial public Railway template for Stellar.
- Uses the prebuilt `ghcr.io/app-corp/stellar:1.0.0` image.
- Connects to a hosted Supabase project for Postgres, Auth, and Storage.
- Pre-deploy runs migrations, RBAC seed, root-admin bootstrap, and storage
  bucket/asset bootstrap.
=======
All notable changes to the Stellar deployment image are documented here.

This file is the primary update channel: Railway does not send template-update notifications for container-image templates, so check here before redeploying. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

Nothing yet.

## [1.0.0] — 2026-10-24

### Added

- First public Railway template release, distributed as a private prebuilt image (`ghcr.io/app-corp/stellar`).
- One-click deploy that provisions the application and a PostgreSQL service, wires `DATABASE_URL`/`DIRECT_URL` automatically, and runs migrations, RBAC seed, and admin bootstrap in a pre-deploy step.
- Runtime-resolved `NEXT_PUBLIC_*` configuration — change URLs, branding, and feature flags in Railway and redeploy without rebuilding the image.
- Health endpoint at `GET /api/health` used by the Railway healthcheck.
- CI pipeline that boots the built image and verifies `/api/health` before publishing, so a broken entrypoint can never reach users.
- Semantic version tags (`1.2.3`, `1.2`, `1`) alongside `latest` and per-commit SHA tags.

### Known limitations

- A Supabase project (authentication and storage) must be created before deploying; the template cannot provision it.
- `next/image` remote patterns are derived from `NEXT_PUBLIC_SUPABASE_URL` at build time, with `*.supabase.co` allowed as a wildcard. Custom Supabase domains are not supported by the image.
- Users cannot pin image tags: the template holds hidden registry credentials, which disables image-source editing by design.
>>>>>>> bc3324d (docs: add one-click Railway deployment guide, source-available license, and changelog)
