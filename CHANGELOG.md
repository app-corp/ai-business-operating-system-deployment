# Changelog

All notable changes to the Stellar deployment image are documented here.

This file is the primary update channel: Railway does not send template-update notifications for container-image templates, so check here before redeploying. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed

- Workspace apps (`POS`, `ERP`, `Content Creator`, `Email Marketing`, `Social Media Marketing`) and every content-creator sidebar item (Home, Image Editor, Templates, Files, Post) are now always enabled.

### Removed

- App and sidebar feature flags are no longer read: `NEXT_PUBLIC_APPS_ERP`, `NEXT_PUBLIC_APPS_CONTENT_CREATOR`, `NEXT_PUBLIC_APPS_EMAIL_MARKETING`, `NEXT_PUBLIC_APPS_SOCIAL_MEDIA_MARKETING`, `NEXT_PUBLIC_CONTENT_CREATOR_FILES`, `NEXT_PUBLIC_CONTENT_CREATOR_HOME`, `NEXT_PUBLIC_CONTENT_CREATOR_IMAGE_EDITOR`, `NEXT_PUBLIC_CONTENT_CREATOR_POST`, `NEXT_PUBLIC_CONTENT_CREATOR_TEMPLATES`. Remove them from existing Railway services; they are ignored.
- Legacy URL and app switches are no longer read: `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_TRANSLATIONS`, `NEXT_PUBLIC_APP_SUPABASE_STORAGE`, `NEXT_PUBLIC_WORKER_URL`. Use `NEXT_PUBLIC_APP_DOMAIN` for the public origin.
- Module, pagination, quote-reference and toast flags are no longer read: `NEXT_PUBLIC_ERP_*`, `NEXT_PUBLIC_PAGE_LIMIT*`, `NEXT_PUBLIC_QUOTE_INVOICE_REF_LENGTH`, `NEXT_PUBLIC_ENABLE_*_TOAST`. Those settings are compiled into the image.

## [1.0.0] - 2026-11-12

- Initial public Railway template for Stellar.
- Uses the prebuilt `ghcr.io/app-corp/stellar:1.0.0` image.
- Connects to a hosted Supabase project for Postgres, Auth, and Storage.
- Pre-deploy runs migrations, RBAC seed, root-admin bootstrap, and storage
  bucket/asset bootstrap.
