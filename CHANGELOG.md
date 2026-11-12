# Changelog

## [1.0.0] - 2026-11-12

- Initial public Railway template for Stellar.
- Uses the prebuilt `ghcr.io/app-corp/stellar:1.0.0` image.
- Connects to a hosted Supabase project for Postgres, Auth, and Storage.
- Pre-deploy runs migrations, RBAC seed, root-admin bootstrap, and storage
  bucket/asset bootstrap.
