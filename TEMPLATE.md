# Deploy and Host Stellar with Railway

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/ai-business-operating-system)

Stellar is a self-hosted AI business operating system: ERP records and documents
(products, CRM, quotes, invoices, payments, expenses, banking), a POS workspace,
team roles, PDF financial reports, and 15 AI business agents that read your own
data. This template runs the public Stellar container on Railway and connects it
to your Supabase project for Postgres, Auth, and Storage.

## About Hosting Stellar

Hosting Stellar means running one stateless Next.js container connected to your
Supabase project. Railway pulls the public image and runs a pre-deploy job that
applies Prisma migrations, seeds RBAC roles, creates the root admin, and creates
storage buckets with default fonts/logo, then starts the server behind HTTPS.
You provide eight values: Supabase URL, anon key, both service-role key
variables, the session-pooler `DATABASE_URL`, the `DIRECT_URL`, and the root
admin email/password. Supabase provides Postgres, authentication, password
reset, and file storage; Railway provides the container, domain, healthchecks,
logs, and scaling. No Railway database or volume is needed.

## Why Deploy Stellar on Railway?

Railway hosts the container with HTTPS, healthchecks, logs, and scaling without
managing servers. The public image removes build time, and runtime-resolved
`NEXT_PUBLIC_*` variables let you change configuration without rebuilding.
Supabase gives you managed Postgres, Auth, and Storage while you keep control of
your data.

## Common Use Cases

- Run a self-hosted ERP for a small or mid-sized company.
- Operate retail stores with the POS workspace.
- Give finance and sales teams AI-assisted analysis and reporting.
- Keep business data in your own Supabase project.
- Deploy a private instance with role-based access.

## Dependencies for Stellar Hosting

- A Railway account.
- A Supabase project for Postgres, Auth, and Storage.
- The public image `ghcr.io/app-corp/stellar:latest`.
- Optional AI keys: Google Generative AI, Replicate, Pexels.

### Deployment Dependencies

- [Deployment repository](https://github.com/app-corp/ai-business-operating-system-deployment)
- [Railway template](https://railway.com/template/ai-business-operating-system)
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
postgresql://postgres.[project-ref]:[password]@[pooler-host]:5432/postgres?sslmode=require
```

Copy the full host from Supabase; do not build it from the region. URL-encode
reserved password characters. Use this value for both `DATABASE_URL` and
`DIRECT_URL`. The direct connection is IPv6 unless you have the IPv4 add-on. For
transaction pooling, use port `6543` with `pgbouncer=true` for `DATABASE_URL`,
and keep the session pooler for `DIRECT_URL`. Never use transaction pooling for
migrations.

### 3. Auth, storage, and email

After Railway assigns a domain, set **Authentication → URL Configuration**:
Site URL `https://[your-domain]` and redirects
`https://[your-domain]/auth/confirm` and
`https://[your-domain]/auth/reset-password`.

Pre-deploy creates `erpblobPublic` (public) and `erpblob` (private) and uploads
the default logo and PDF fonts. Override
`NEXT_PUBLIC_SUPABASE_PUBLIC_BUCKET` / `NEXT_PUBLIC_SUPABASE_PRIVATE_BUCKET`
to use different bucket names. For production, configure custom SMTP under
**Authentication → Emails**.

## Deploy

1. Click **Deploy on Railway**.
2. Fill in the eight prompted values listed in the Variables table.
3. Deploy and watch for:
   ```text
   ✔ release complete
   ✔ root admin ready: [email]
   ```
4. Set the Supabase Auth URLs (see **Supabase Setup**, step 3).
5. Sign in, change the admin password, then create users and grant roles in
   **User Management** and **RBAC**.

If pre-deploy fails, the new container is not switched in.

## Variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL; no trailing slash. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key; browser-safe. |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes, sealed | Server-side service-role key; same value as the public variable. |
| `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` | Yes, sealed | Service-role key for admin bootstrap and storage. Never expose it. |
| `DATABASE_URL` | Yes, sealed | Session-pooler URL (IPv4, port `5432`) with `?sslmode=require`. |
| `DIRECT_URL` | Yes, sealed | Prisma migration URL; use the same value as `DATABASE_URL`. |
| `BOOTSTRAP_ADMIN_EMAIL` | Yes | Root admin email; use the address you will sign in with. |
| `BOOTSTRAP_ADMIN_PASSWORD` | Yes, sealed | Root admin password. Never logged. |
| `NEXT_PUBLIC_SUPABASE_STORAGE_URL` | Derived | `[supabase-url]/storage/v1/object`. |
| `NEXT_PUBLIC_SUPABASE_PUBLIC_BUCKET` | Derived | Public assets bucket. Default `erpblobPublic`. |
| `NEXT_PUBLIC_SUPABASE_PRIVATE_BUCKET` | Derived | Private uploads bucket. Default `erpblob`. |
| `NEXT_PUBLIC_APP_DOMAIN` | Derived | Public origin from `RAILWAY_PUBLIC_DOMAIN`. |
| `NEXT_PUBLIC_APP_LOGO` | Derived | Logo URL in the public bucket. |

Optional variables: `GOOGLE_GENERATIVE_AI_API_KEY` (BYOK agents),
`REPLICATE_API_TOKEN` (AI Image Studio), `NEXT_PUBLIC_PEXELS_API_KEY` (image
search), `NEXT_PUBLIC_SUPABASE_CACHE_CONTROL` (default `3600`),
`NEXT_PUBLIC_APP_NAME`, `BOOTSTRAP_ADMIN_RESET_PASSWORD` (set `true` to rotate
the root password), `GOOGLE_ANALYTICS_ID`, Facebook/Instagram publishing keys,
and `ALLOWED_IMAGE_HOSTS`.

Derived values use Railway references:
`NEXT_PUBLIC_SUPABASE_STORAGE_URL=${{NEXT_PUBLIC_SUPABASE_URL}}/storage/v1/object`,
`NEXT_PUBLIC_SUPABASE_PUBLIC_BUCKET=erpblobPublic`,
`NEXT_PUBLIC_SUPABASE_PRIVATE_BUCKET=erpblob`,
`NEXT_PUBLIC_APP_DOMAIN=https://${{RAILWAY_PUBLIC_DOMAIN}}`, and
`NEXT_PUBLIC_APP_LOGO=${{NEXT_PUBLIC_SUPABASE_STORAGE_URL}}/public/${{NEXT_PUBLIC_SUPABASE_PUBLIC_BUCKET}}/assets/stellar-app-logo.webp`.

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
- Optional custom domain: add it in Railway, override
  `NEXT_PUBLIC_APP_DOMAIN` if it differs from `RAILWAY_PUBLIC_DOMAIN`, update
  Supabase Auth URLs, and redeploy.
- Optional AI: add a Google key (and Replicate key for image generation).

## Updates and Rollback

The template tracks `ghcr.io/app-corp/stellar:latest`. Railway redeploys when a
new digest is pushed to that tag, so every published build — including major
versions — is picked up automatically. Versioned tags are also published for
pinning: `1.0.3`, `1.0`, `1`, and `sha-[commit]`.

Pin a release by changing the service image tag to a versioned tag; disable
auto-updates in service settings for manual control. Migrations are forward-only,
so only roll back to a build that supports your current schema. Docker-image
templates do not receive Railway template update notifications; image
auto-updates are the update mechanism.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `P1001` / DB timeout | Use the Session pooler (5432), not direct IPv6. |
| `prepared statement "s0" already exists` | Transaction pooler without `pgbouncer=true`; use session pooling. |
| Migration auth failure | URL-encode the password; confirm `DIRECT_URL` uses the session pooler. |
| Storage bootstrap fails | Check the service-role key and `bootstrap-storage.mjs` logs. |
| Nobody can sign in | Set `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD`, then redeploy. |
| Login works but menu empty / 403 | Sign in with `BOOTSTRAP_ADMIN_EMAIL`; sign out and back in. |
| Reset link has wrong host | Set `NEXT_PUBLIC_APP_DOMAIN` and Supabase Auth Site URL. |
| Password reset email missing | Configure custom SMTP under Supabase **Authentication → Emails**. |
| Uploads or PDF fonts fail | Check `erpblobPublic`/`erpblob`, `fonts/inter-*.ttf`, and the service-role key. |
| Railway cannot pull image | GHCR package must be public. |
| Site not indexed / empty sitemap | Expected on self-hosted domains. |

## Support and License

- [Deployment repository](https://github.com/app-corp/ai-business-operating-system-deployment)
- [Railway template](https://railway.com/template/ai-business-operating-system)
- [Railway documentation](https://docs.railway.com)
- [Supabase documentation](https://supabase.com/docs)

Licensed under the **Stellar Self-Host License 1.0**. See
[LICENSE.md](https://github.com/app-corp/ai-business-operating-system-deployment/blob/main/LICENSE.md)
for the full terms.
