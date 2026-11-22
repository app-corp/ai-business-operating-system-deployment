# Deploy and Host Stellar with Railway

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/ai-business-operating-system)

Stellar is an AI-powered business operating system that combines ERP workflows —
products, contacts, expenses, invoicing, reports, user management, and RBAC —
with AI agents for forecasting, pricing, reconciliation, and analysis. This
template deploys the prebuilt Stellar image and connects it to your own Supabase
project for Postgres, Auth, and Storage.

## About Hosting Stellar

Hosting Stellar means running one stateless Next.js container connected to your
Supabase project. Railway pulls the public image, runs a pre-deploy job that
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
- Give finance teams AI-assisted forecasting, pricing, and reconciliation.
- Keep business data in your own Supabase project.
- Deploy a private instance with role-based access.
- Evaluate Stellar quickly, then customise the image and template.

## Dependencies for Stellar Hosting

- A Railway account.
- A Supabase project for Postgres, Auth, and Storage.
- The public image `ghcr.io/app-corp/stellar:latest`.

> **Distribution model:** Stellar is distributed as a public, prebuilt container image (`ghcr.io/app-corp/stellar`). The image contains **compiled, minified build output only** — no application source code and no source maps. This repository hosts the deployment documentation; the source is not published. Reverse engineering and modification are prohibited by the [license](./LICENSE.md).

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
the default logo and PDF fonts. Override
`NEXT_PUBLIC_SUPABASE_PUBLIC_BUCKET` / `NEXT_PUBLIC_SUPABASE_PRIVATE_BUCKET`
to use different bucket names.
For production, configure custom SMTP under **Authentication → Emails**.

## Deploy

1. Click **Deploy on Railway**.
2. Fill in the eight prompted values listed in the Variables table.
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

| Variable                                | Required    | Description                                                                                                                |
| --------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`              | Yes         | Supabase project URL, e.g. `https://abcd.supabase.co`. Project Settings → API; no trailing slash.                          |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`         | Yes         | Supabase anon/public key. Browser-safe. Project Settings → API.                                                            |
| `SUPABASE_SERVICE_ROLE_KEY`             | Yes, sealed | Supabase service-role secret for server-side storage code. Never expose it to the browser. Project Settings → API.         |
| `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` | Yes, sealed | Supabase service-role secret. Server-only; used for admin bootstrap and storage. Never expose it to the browser.           |
| `DATABASE_URL`                          | Yes, sealed | Supabase Postgres Session-pooler URL (IPv4, port `5432`) with password and `?sslmode=require`. Used by the app at runtime. |
| `DIRECT_URL`                            | Yes, sealed | Direct connection for Prisma migrations. Use the same Session-pooler URL as `DATABASE_URL`.                                |
| `BOOTSTRAP_ADMIN_EMAIL`                 | Yes         | Email for the root admin created on first deploy. Use the address you will sign in with.                                   |
| `BOOTSTRAP_ADMIN_PASSWORD`              | Yes, sealed | Root admin password. Never logged. Use a strong password.                                                                  |
| `NEXT_PUBLIC_SUPABASE_STORAGE_URL`      | Derived     | Supabase Storage endpoint: `<NEXT_PUBLIC_SUPABASE_URL>/storage/v1/object`.                                                 |
| `NEXT_PUBLIC_SUPABASE_PUBLIC_BUCKET`    | Derived     | Public bucket for logos/fonts/assets. Default `erpblobPublic`.                                                             |
| `NEXT_PUBLIC_SUPABASE_PRIVATE_BUCKET`   | Derived     | Private bucket for uploads/generated documents. Default `erpblob`.                                                         |
| `NEXT_PUBLIC_APP_DOMAIN`                | Derived     | Public origin from `RAILWAY_PUBLIC_DOMAIN`, e.g. `https://your-app.up.railway.app`.                                        |
| `NEXT_PUBLIC_BASE_URL`                  | Derived     | Alias of `NEXT_PUBLIC_APP_DOMAIN`.                                                                                         |
| `NEXT_PUBLIC_API_URL`                   | Derived     | Alias of `NEXT_PUBLIC_APP_DOMAIN`.                                                                                         |
| `NEXT_PUBLIC_APP_LOGO`                  | Derived     | Absolute logo URL in the public bucket. Default `<storage-url>/public/<public-bucket>/assets/stellar-app-logo.webp`.       |

Derived values use Railway references:
`NEXT_PUBLIC_SUPABASE_STORAGE_URL=${{NEXT_PUBLIC_SUPABASE_URL}}/storage/v1/object`,
`NEXT_PUBLIC_SUPABASE_PUBLIC_BUCKET=erpblobPublic`,
`NEXT_PUBLIC_SUPABASE_PRIVATE_BUCKET=erpblob`,
`NEXT_PUBLIC_APP_DOMAIN=https://${{RAILWAY_PUBLIC_DOMAIN}}`,
`NEXT_PUBLIC_BASE_URL=${{NEXT_PUBLIC_APP_DOMAIN}}`,
`NEXT_PUBLIC_API_URL=${{NEXT_PUBLIC_APP_DOMAIN}}`, and
`NEXT_PUBLIC_APP_LOGO=${{NEXT_PUBLIC_SUPABASE_STORAGE_URL}}/public/${{NEXT_PUBLIC_SUPABASE_PUBLIC_BUCKET}}/assets/stellar-app-logo.webp`.

Workspace apps (`POS`, `ERP`, `Content Creator`, `Email Marketing`, `Social
Media Marketing`) and every content-creator sidebar item are always enabled.
ERP module visibility (`ERP_MODULES`), pagination (`PAGE_LIMIT` /
`PAGE_LIMIT_MAX`), quote reference length and toasts are compiled into the image
— they are not Railway variables, and changing them requires a new image.

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
- Optional custom domain: add it in Railway, override `NEXT_PUBLIC_APP_DOMAIN`
  if it differs from `RAILWAY_PUBLIC_DOMAIN`, update Supabase Auth URLs, and
  redeploy.

## Updates and Rollback

The template tracks `ghcr.io/app-corp/stellar:latest`, so new image releases,
including major versions, are picked up automatically. Versioned tags are also
published: `1.2.3`, `1.2`, `1`, and `sha-<commit>`.

Pin a version by changing the service image tag to a versioned tag; disable
auto-updates in service settings. Roll back by setting the previous tag —
migrations are forward-only. Docker-image templates do not get Railway template
update notifications; image auto-updates are the update mechanism.

---

## Troubleshooting

| Symptom                                  | Fix                                                                             |
| ---------------------------------------- | ------------------------------------------------------------------------------- |
| `P1001` / DB timeout                     | Use the Session pooler (5432), not direct IPv6.                                 |
| `prepared statement "s0" already exists` | Transaction pooler without `pgbouncer=true`; use session pooling.               |
| Migration auth failure                   | URL-encode the password; confirm `DIRECT_URL` uses the session pooler.          |
| Storage bootstrap fails                  | Check the service-role key and `bootstrap-storage.mjs` logs.                    |
| Login works but menu empty / 403         | Sign in with `BOOTSTRAP_ADMIN_EMAIL`; sign out and back in.                     |
| Reset link has wrong host                | Set `NEXT_PUBLIC_APP_DOMAIN` and Supabase Auth Site URL to the public domain.   |
| Uploads or PDF fonts fail                | Check `erpblobPublic`/`erpblob`, `fonts/inter-*.ttf`, and the service-role key. |
| Railway cannot pull image                | GHCR package must be public.                                                    |
| Demo images use another host             | Some marketing content points at the demo bucket; replace for white-labelling.  |

## Security notes

- Never commit secrets to this repository. All configuration belongs in Railway variables.
- The `service_role` key grants full database access through Supabase. Treat it like a root password.
- There is no public sign-up. Create every additional user from **User Management** and grant roles via **RBAC**.
- Change the bootstrap admin password after your first login if you set it provisionally.

---

## Support and License

- [Main repository](https://github.com/app-corp/stellar)
- [Deployment repository](https://github.com/app-corp/ai-business-operating-system-deployment)
- [Issues](https://github.com/app-corp/stellar/issues)
- [Railway documentation](https://docs.railway.com)
- [Supabase documentation](https://supabase.com/docs)

Stellar is **source-available**, not open source. See [LICENSE.md](./LICENSE.md) for the full terms.

In short: you may self-host and use Stellar for your own business, including commercially. You may not modify the Software, create derivative works, reverse engineer or decompile it, redistribute it, resell it, or operate it as a service for third parties. The image ships compiled, minified output only — the application source code is not distributed.

"Stellar" and the Stellar logo are trademarks of App Corp. Third-party open-source components bundled with the image remain under their own licenses.
