# Deploy and Host Stellar with Railway

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/TEMPLATE_CODE)

Stellar is an AI-powered business operating system that combines ERP workflows —
products, contacts, expenses, invoicing, reports, user management, and RBAC —
with AI agents for forecasting, pricing, reconciliation, and analysis. This
template deploys the prebuilt Stellar image and connects it to your own Supabase
project for Postgres, Auth, and Storage.

> Maintainers: replace `TEMPLATE_CODE`.

## About Hosting Stellar

Hosting Stellar means running one stateless Next.js container connected to your
Supabase project. Railway pulls the public image, runs a pre-deploy job that
applies Prisma migrations, seeds RBAC roles, creates the root admin, and creates
storage buckets with default fonts/logo, then starts the server behind HTTPS.
You provide six values: Supabase URL, anon key, service-role key, a session-pooler
database URL, and the root admin email/password. Supabase provides Postgres,
authentication, password reset, and file storage; Railway provides the container,
domain, healthchecks, logs, and scaling. No Railway database or volume is needed.

## Why Deploy Stellar on Railway?

Railway hosts the container with HTTPS, healthchecks, logs, and scaling without
managing servers. The public image removes build time, and runtime-resolved
`NEXT_PUBLIC_*` variables let you change configuration without rebuilding.
Supabase gives you managed Postgres, Auth, and Storage while you keep control of
your data.

## Common Use Cases

- Run a self-hosted ERP for a small or mid-sized company.
- Give finance teams AI-assisted forecasting, pricing, and reconciliation.
- Keep business data in your own Supabase project.
- Deploy a private instance with role-based access.
- Evaluate Stellar quickly, then customise the image and template.

## Dependencies for Stellar Hosting

- A Railway account.
- A Supabase project for Postgres, Auth, and Storage.
- The public image `ghcr.io/app-corp/stellar:1.0.0`.
- Optional AI keys: Google Generative AI, Replicate, Pexels.

### Deployment Dependencies

- [Stellar repository](https://github.com/app-corp/stellar)
- [Deployment repository](https://github.com/app-corp/ai-business-operating-system-deployment)
- [Supabase setup guide](https://github.com/app-corp/stellar/blob/main/docs/engineers/deployment-supabase.md)
- [Supabase documentation](https://supabase.com/docs)
- [Railway documentation](https://docs.railway.com)

## Supabase Setup

### 1. Project and keys

Create a project near your Railway region. From **Project Settings → API**, copy
the project URL, anon key, and service-role key. Keep the service-role key
server-side only.

### 2. Database connection

Use the **Session pooler** (IPv4, port `5432`):

```text
postgresql://postgres.<project-ref>:<password>@<pooler-host>:5432/postgres?sslmode=require
```

Copy the full host from Supabase; do not build it from the region. URL-encode
reserved password characters. This value is used for both `DATABASE_URL` and
`DIRECT_URL`. The direct connection is IPv6 unless you have the IPv4 add-on. For
transaction pooling, use port `6543` with `pgbouncer=true` for `DATABASE_URL`,
and keep the session pooler for `DIRECT_URL`. Never use transaction pooling for
migrations.

### 3. Auth, storage, and email

After Railway assigns a domain, set **Authentication → URL Configuration**:
Site URL `https://<your-domain>` and redirects
`https://<your-domain>/auth/confirm` and
`https://<your-domain>/auth/reset-password`.

Pre-deploy creates `erpblobPublic` (public) and `erpblob` (private) and uploads
the default logo and PDF fonts. Rename them with
`NEXT_PUBLIC_SUPABASE_PUBLIC_BUCKET` / `NEXT_PUBLIC_SUPABASE_PRIVATE_BUCKET`.
For production, configure custom SMTP under **Authentication → Emails**.

## Deploy

1. Click **Deploy on Railway**.
2. Fill in the six prompted values listed in the Variables table.
3. Deploy and watch for:
   ```text
   ✔ release complete
   ✔ root admin ready: <email>
   ```
4. Set the Supabase Auth URLs from step 3.
5. Sign in, change the admin password, then create users and grant roles in
   **User Management** and **RBAC**.

If pre-deploy fails, the new container is not switched in.

## Variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL, e.g. `https://abcd.supabase.co`. Project Settings → API; no trailing slash. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key. Browser-safe. Project Settings → API. |
| `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` | Yes, sealed | Supabase service-role secret. Server-only; used for admin bootstrap and storage. Never expose it to the browser. |
| `DATABASE_URL` | Yes, sealed | Supabase Postgres Session-pooler URL (IPv4, port `5432`) with password and `?sslmode=require`. Used by the app at runtime. |
| `BOOTSTRAP_ADMIN_EMAIL` | Yes | Email for the root admin created on first deploy. Use the address you will sign in with. |
| `BOOTSTRAP_ADMIN_PASSWORD` | Yes, sealed | Root admin password. Never logged. Use a strong password. |
| `DIRECT_URL` | Derived | Prisma migration connection. Use the same Session-pooler URL as `DATABASE_URL`. |
| `SUPABASE_SERVICE_ROLE_KEY` | Derived | Alias of `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` used by server-side storage code. |
| `NEXT_PUBLIC_SUPABASE_STORAGE_URL` | Derived | Supabase Storage endpoint: `<NEXT_PUBLIC_SUPABASE_URL>/storage/v1/object`. |
| `NEXT_PUBLIC_APP_DOMAIN` | Optional | Public origin, e.g. `https://your-app.up.railway.app`. Do not use `stellarapp.site`. |
| `NEXT_PUBLIC_BASE_URL` | Optional | Absolute base URL for links and password-reset emails. Normally the same as `NEXT_PUBLIC_APP_DOMAIN`. |
| `NEXT_PUBLIC_API_URL` | Optional | Base URL for client API requests. Normally the same as `NEXT_PUBLIC_APP_DOMAIN`. |
| `NEXT_PUBLIC_APP_NAME` | Optional | Display name in the UI. Default `Stellar App`. |
| `NEXT_PUBLIC_APP_LOGO` | Optional | Absolute logo URL in the public bucket. Default `<storage-url>/public/<public-bucket>/assets/stellar-app-logo.webp`. |
| `NEXT_PUBLIC_SUPABASE_PUBLIC_BUCKET` | Optional | Public bucket for logos/fonts/assets. Default `erpblobPublic`. |
| `NEXT_PUBLIC_SUPABASE_PRIVATE_BUCKET` | Optional | Private bucket for uploads/generated documents. Default `erpblob`. |
| `NEXT_PUBLIC_SUPABASE_CACHE_CONTROL` | Optional | Cache-Control max-age in seconds for storage requests. Default `3600`. |
| `NEXT_PUBLIC_APP_TRANSLATIONS` | Optional | Enable the Translations module. Default `true`. |
| `NEXT_PUBLIC_APP_SUPABASE_STORAGE` | Optional | Enable the Supabase Storage module. Default `true`. |
| `NEXT_PUBLIC_WORKER_URL` | Optional | Optional worker/API URL. Leave empty; no worker is deployed. |
| `BOOTSTRAP_ADMIN_RESET_PASSWORD` | Optional | Set `true` to rotate the root admin password on the next deploy. |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Optional | Google Generative AI key for AI agents. |
| `REPLICATE_API_TOKEN` | Optional | Replicate token for image generation. |
| `NEXT_PUBLIC_PEXELS_API_KEY` | Optional | Pexels key for image search. |

Derived values use Railway references: `DIRECT_URL=${{DATABASE_URL}}`,
`SUPABASE_SERVICE_ROLE_KEY=${{NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY}}`,
`NEXT_PUBLIC_SUPABASE_STORAGE_URL=${{NEXT_PUBLIC_SUPABASE_URL}}/storage/v1/object`,
`NEXT_PUBLIC_APP_DOMAIN=https://${{RAILWAY_PUBLIC_DOMAIN}}`, and
`NEXT_PUBLIC_BASE_URL`/`NEXT_PUBLIC_API_URL=${{NEXT_PUBLIC_APP_DOMAIN}}`.

## Pre-Deploy

```text
node migrate/release.mjs
  → prisma migrate deploy
  → seed RBAC roles and permissions
  → create/update root admin
  → create buckets and upload fonts/logo
```

Every step is idempotent. The container then runs `node apps/main/server.js` on
Railway's `PORT`. The configured `BOOTSTRAP_ADMIN_EMAIL` is always promoted to
`admin`; other accounts are never auto-promoted.

## After Deploy

- Change the root admin password.
- Create users and assign roles.
- Upload your logo/assets or keep the defaults.
- Configure SMTP and review Supabase backups/plan limits.
- Optional custom domain: add it in Railway, set `NEXT_PUBLIC_APP_DOMAIN`,
  update Supabase Auth URLs, and redeploy.

## Updates and Rollback

The template pins `ghcr.io/app-corp/stellar:1.0.0` and enables Railway image
auto-updates for minor/patch releases. Tags: `1.2.3`, `1.2`, `1`, `latest`,
`sha-<commit>`.

Pin a version by changing the service image tag; disable auto-updates in service
settings. Roll back by setting the previous tag — migrations are forward-only.
Major releases are not auto-applied. Docker-image templates do not get Railway
template update notifications; image auto-updates are the update mechanism.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `P1001` / DB timeout | Use the Session pooler (5432), not direct IPv6. |
| `prepared statement "s0" already exists` | Transaction pooler without `pgbouncer=true`; use session pooling. |
| Migration auth failure | URL-encode the password; confirm `DIRECT_URL` uses the session pooler. |
| Storage bootstrap fails | Check the service-role key and `bootstrap-storage.mjs` logs. |
| Login works but menu empty / 403 | Sign in with `BOOTSTRAP_ADMIN_EMAIL`; sign out and back in. |
| Reset link has wrong host | Set `NEXT_PUBLIC_BASE_URL` and Supabase Auth Site URL. |
| Uploads or PDF fonts fail | Check `erpblobPublic`/`erpblob`, `fonts/inter-*.ttf`, and the service-role key. |
| Railway cannot pull image | GHCR package must be public. |
| Demo images use another host | Some marketing content points at the demo bucket; replace for white-labelling. |

## Support and License

- [Main repository](https://github.com/app-corp/stellar)
- [Deployment repository](https://github.com/app-corp/ai-business-operating-system-deployment)
- [Issues](https://github.com/app-corp/stellar/issues)

Licensed under the **Stellar Self-Host License 1.0**. See the repository
`LICENSE`.
