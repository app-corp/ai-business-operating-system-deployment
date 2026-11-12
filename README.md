# Deploy and Host Stellar with Railway

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/TEMPLATE_CODE)

Stellar is an AI-powered business operating system that combines ERP workflows —
products, contacts, expenses, invoicing, reports, user management, and RBAC —
with AI agents for forecasting, pricing, reconciliation, and analysis. This
template deploys the prebuilt Stellar image and connects it to your own Supabase
project for Postgres, Auth, and Storage.

> **Maintainers:** replace `TEMPLATE_CODE` after publishing the template.

## About Hosting Stellar

Hosting Stellar means running one stateless Next.js container that talks to your
Supabase project. Railway pulls the public image, runs a pre-deploy job to apply
Prisma migrations, seed RBAC roles, create the root admin, and create storage
buckets with default fonts/logo, then starts the server behind HTTPS. You provide
six values: Supabase URL, anon key, service-role key, a session-pooler database
URL, and the root admin email/password. Supabase supplies Postgres,
authentication, password reset, and file storage; Railway supplies the container,
domain, healthchecks, logs, and scaling. No Railway database or volume is needed.

## Why Deploy Stellar on Railway?

Railway hosts the container and provides HTTPS, healthchecks, logs, and scaling
without managing servers. The public image removes build time, and
runtime-resolved `NEXT_PUBLIC_*` variables let you change configuration without
rebuilding. Paired with Supabase, you get managed Postgres, Auth, and Storage
while keeping control of your data.

## Common Use Cases

- Run a self-hosted ERP for a small or mid-sized company.
- Give finance teams AI-assisted forecasting, pricing, and reconciliation.
- Keep business data in your own Supabase project.
- Deploy a private instance for one organisation with role-based access.
- Evaluate Stellar quickly, then customise the open image and template.

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

## What You Get

- ERP: dashboard, products, contacts, expenses, quotes, invoices, payments,
  reports, PDF grid, preferences, users, RBAC, translations, and file storage.
- AI agents for sales, pricing, forecasting, anomalies, budgets, CEO reporting,
  quotations, compliance, and upsell.
- Supabase Auth, runtime-resolved environment variables, non-root container, and
  `/api/health` healthchecks.
- Automated migrations, RBAC seed, root-admin bootstrap, and storage setup.

## Architecture

```text
User ──HTTPS──▶ Railway service (ghcr.io/app-corp/stellar:1.0.0)
                  pre-deploy: migrate + seed + admin + storage
                                   │
                                   ▼
                Supabase: Postgres · Auth · Storage
```

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
reserved password characters. This single value is used for both `DATABASE_URL`
and `DIRECT_URL`. The direct connection is IPv6 unless you have the IPv4 add-on.
For transaction pooling, use port `6543` with `pgbouncer=true` for
`DATABASE_URL`, and keep the session pooler for `DIRECT_URL`. Never use
transaction pooling for migrations.

### 3. Auth URLs

After Railway assigns a domain, set **Authentication → URL Configuration**:

- Site URL: `https://<your-domain>`
- Redirects: `https://<your-domain>/auth/confirm` and
  `https://<your-domain>/auth/reset-password`

Update these if you add a custom domain.

### 4. Storage

Pre-deploy creates `erpblobPublic` (public) and `erpblob` (private), and uploads
the default logo and PDF fonts. Rename them with
`NEXT_PUBLIC_SUPABASE_PUBLIC_BUCKET` / `NEXT_PUBLIC_SUPABASE_PRIVATE_BUCKET`.

### 5. Email

Supabase's built-in mailer is rate-limited. For production, configure custom
SMTP under **Authentication → Emails** and verify the sender domain.

## Deploy

1. Click **Deploy on Railway**.
2. Fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL` (session-pooler string)
   - `BOOTSTRAP_ADMIN_EMAIL`
   - `BOOTSTRAP_ADMIN_PASSWORD`
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

Prompted: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` (sealed), `DATABASE_URL` (sealed),
`BOOTSTRAP_ADMIN_EMAIL`, `BOOTSTRAP_ADMIN_PASSWORD` (sealed).

Derived by the template:

| Variable | Value |
| --- | --- |
| `SUPABASE_SERVICE_ROLE_KEY` | `${{NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY}}` |
| `NEXT_PUBLIC_SUPABASE_STORAGE_URL` | `${{NEXT_PUBLIC_SUPABASE_URL}}/storage/v1/object` |
| `NEXT_PUBLIC_SUPABASE_PUBLIC_BUCKET` | `erpblobPublic` |
| `NEXT_PUBLIC_SUPABASE_PRIVATE_BUCKET` | `erpblob` |
| `DIRECT_URL` | `${{DATABASE_URL}}` |
| `NEXT_PUBLIC_APP_DOMAIN` | `https://${{RAILWAY_PUBLIC_DOMAIN}}` |
| `NEXT_PUBLIC_BASE_URL` / `NEXT_PUBLIC_API_URL` | `${{NEXT_PUBLIC_APP_DOMAIN}}` |
| `NEXT_PUBLIC_APP_NAME` | `Stellar App` |
| `NEXT_PUBLIC_APP_LOGO` | `${{NEXT_PUBLIC_SUPABASE_STORAGE_URL}}/public/${{NEXT_PUBLIC_SUPABASE_PUBLIC_BUCKET}}/assets/stellar-app-logo.webp` |

Optional: `GOOGLE_GENERATIVE_AI_API_KEY`, `REPLICATE_API_TOKEN`,
`NEXT_PUBLIC_PEXELS_API_KEY`, `NEXT_PUBLIC_APP_DOMAIN` (custom domain), and
`BOOTSTRAP_ADMIN_RESET_PASSWORD=true`.

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
| Uploads fail | Check `erpblobPublic`/`erpblob` and the service-role key. |
| PDF fonts fail | Public bucket needs `fonts/inter-*.ttf`; re-run pre-deploy. |
| Railway cannot pull image | GHCR package must be public. |
| Demo images use another host | Some marketing content points at the demo bucket; replace for white-labelling. |

## Support and License

- [Main repository](https://github.com/app-corp/stellar)
- [Deployment repository](https://github.com/app-corp/ai-business-operating-system-deployment)
- [Issues](https://github.com/app-corp/stellar/issues)

Licensed under the **Stellar Self-Host License 1.0**. The image is compiled-only;
see the repository `LICENSE`.
