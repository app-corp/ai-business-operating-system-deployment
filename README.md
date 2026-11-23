# Deploy and Host Stellar with Railway

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/ai-business-operating-system)

Stellar is a self-hosted AI business operating system. It combines ERP records and
documents — products, CRM, quotes, invoices, payments, expenses, banking, and a
full POS workspace — with team roles, PDF financial reports, and 15 AI business
agents that read your own data. This template runs the public Stellar container
on Railway and connects it to your Supabase project for Postgres, Auth, and
Storage.

At a glance: 12 business modules · 15 AI agents + AI Image Studio
· multi-currency · English UI · free to self-host.

## What you get

### Business modules

| Module           | What is live                                                   | Roadmap                             |
| ---------------- | -------------------------------------------------------------- | ----------------------------------- |
| Products         | Catalog, categories, pricing, quote/invoice line items         | Inventory tracking                  |
| CRM              | Companies, contacts, and customer records                      | Lead pipeline                       |
| Quotes           | Line-item quotes, expiry dates, PDF output                     | —                                   |
| Invoicing        | Invoices with tax, discounts, and currencies                   | —                                   |
| Payments         | Payments linked to the invoice or quote they settle            | —                                   |
| Expenses         | Expenses and expense categories                                | —                                   |
| Banking          | Bank account records                                           | Live bank feeds                     |
| Branches         | Branch records                                                 | Consolidated cross-branch reporting |
| Documents        | Supabase-backed file storage                                   | —                                   |
| Dashboard        | Module counts and financial totals                             | —                                   |
| Analytics        | PDF ledger, outstanding, and open-item reports                 | Interactive analytics workspace     |
| Finance settings | Currencies, tax rates, and payment modes used across documents | —                                   |

### AI agents

Fifteen business agents plus an AI Image Studio:

- **Executive and finance** — CEO Dashboard, CFO, BI Narrator, Forecasting,
  Spend Variance, Expense, Collections, Anomaly Detection, Bank Reconciliation.
- **Sales and commercial** — Pricing Intelligence, Sales Coach, Quotation,
  Upsell, Churn Prediction.
- **Compliance** — Regulatory.
- **Creative** — AI Image Studio (Replicate-backed).

Agents read the ERP records relevant to their domain when you open them and ask
a question. They summarise and recommend; output is advisory and should be
verified against your records. Run them with your own Google Generative AI key
(BYOK) or on an optional managed plan where Stellar supplies provider keys.

### Platform

- Role-based access control with route-level permissions and user management.
- No public sign-up — every user is created from **User Management**.
- Multi-currency records with configurable tax rates and payment modes.
- PDF financial reports and Supabase storage for documents and assets.
- English interface today; translations are on the roadmap.

## How it works

Railway runs one stateless container from the public
`ghcr.io/app-corp/stellar` image. There is no Railway database or volume.

- **Supabase** provides Postgres (Prisma 7), Auth (sign-in, confirmation,
  password reset), and Storage (public and private buckets).
- **Pre-deploy** runs before traffic switches: `prisma migrate deploy`, RBAC
  roles and permissions, the root admin, then storage buckets, access policies
  and default assets.
- **Runtime** is a Next.js 16 standalone server on Node.js 24, started with
  `node apps/main/server.js` on `$PORT` (default `3000`), healthcheck
  `/api/health`.
- **Configuration** is supplied as Railway variables. `NEXT_PUBLIC_*` values are
  resolved at runtime, so changing them does not require an image rebuild.
- **The image** contains compiled, minified build output only and runs as a
  non-root user. It ships no application source, TypeScript, or source maps.

## Dependencies for Stellar Hosting

- A Railway account.
- A Supabase project for Postgres, Auth, and Storage.
- The public image `ghcr.io/app-corp/stellar:latest`.

> **Distribution model:** Stellar is distributed as a public, prebuilt container image (`ghcr.io/app-corp/stellar`). The image contains **compiled, minified build output only** — no application source code and no source maps. This repository hosts the deployment documentation; the source is not published. Reverse engineering and modification are prohibited by the [license](./LICENSE.md).

### Links

- [Deployment repository](https://github.com/app-corp/ai-business-operating-system-deployment)
- [Railway template](https://railway.com/template/ai-business-operating-system)
- [Railway documentation](https://docs.railway.com)
- [Supabase documentation](https://supabase.com/docs)

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
reserved password characters. Use this value for both `DATABASE_URL` and
`DIRECT_URL`. The direct connection is IPv6 unless you have the IPv4 add-on. For
transaction pooling, use port `6543` with `pgbouncer=true` for `DATABASE_URL`,
and keep the session pooler for `DIRECT_URL`. Never use transaction pooling for
migrations.

### 3. Auth, storage, and email

After Railway assigns a domain, set **Authentication → URL Configuration**:
Site URL `https://<your-domain>` and redirects
`https://<your-domain>/auth/confirm` and
`https://<your-domain>/auth/reset-password`.

Pre-deploy creates `erpblobPublic` (public) and `erpblob` (private), applies the
storage access policies, and uploads the
default logo and PDF fonts. Private objects are owner-scoped: a user can only
read/write their own uploads, while admins use the service-role API. Override
`NEXT_PUBLIC_SUPABASE_PUBLIC_BUCKET` / `NEXT_PUBLIC_SUPABASE_PRIVATE_BUCKET`
to use different bucket names. For production, configure custom SMTP under
**Authentication → Emails**.

## Deploy

You need about 10 minutes.

1. Click **Deploy on Railway**.
2. Fill in the seven prompted values listed in the Variables table.
3. Deploy and watch for:
   ```text
   ✔ release complete
   ✔ root admin ready: <email>
   ```
4. Set the Supabase Auth URLs (see **Supabase Setup**, step 3).
5. Sign in, change the admin password, then create users and grant roles in
   **User Management** and **RBAC**.

If pre-deploy fails, the new container is not switched in.

## Variables

| Variable                                | Required    | Description                                                                                                                                     |
| --------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`              | Yes         | Supabase project URL, e.g. `https://abcd.supabase.co`. Project Settings → API; no trailing slash.                                               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`         | Yes         | Supabase anon/public key. Browser-safe. Project Settings → API.                                                                                 |
| `SUPABASE_SERVICE_ROLE_KEY`             | Yes, sealed | Server-side service-role key for admin bootstrap, storage buckets and policies. Never expose it to the browser.                                |
| `DATABASE_URL`                          | Yes, sealed | Supabase Postgres Session-pooler URL (IPv4, port `5432`) with password and `?sslmode=require`. Used by the app at runtime.                      |
| `DIRECT_URL`                            | Yes, sealed | Prisma migration connection. Use the same Session-pooler URL as `DATABASE_URL`.                                                                 |
| `BOOTSTRAP_ADMIN_EMAIL`                 | Yes         | Email for the root admin created on first deploy. Use the address you will sign in with.                                                        |
| `BOOTSTRAP_ADMIN_PASSWORD`              | Yes, sealed | Root admin password. Never logged. Use a strong password.                                                                                       |
| `NEXT_PUBLIC_SUPABASE_STORAGE_URL`      | Derived     | Supabase Storage endpoint: `<NEXT_PUBLIC_SUPABASE_URL>/storage/v1/object`.                                                                      |
| `NEXT_PUBLIC_SUPABASE_PUBLIC_BUCKET`    | Derived     | Public bucket for logos/fonts/assets. Default `erpblobPublic`.                                                                                  |
| `NEXT_PUBLIC_SUPABASE_PRIVATE_BUCKET`   | Derived     | Private bucket for uploads/generated documents. Default `erpblob`.                                                                              |
| `NEXT_PUBLIC_APP_DOMAIN`                | Derived     | Public origin from `RAILWAY_PUBLIC_DOMAIN`, e.g. `https://your-app.up.railway.app`.                                                             |
| `NEXT_PUBLIC_APP_LOGO`                  | Derived     | Absolute logo URL in the public bucket. Default `<storage-url>/public/<public-bucket>/assets/stellar-app-logo.webp`.                            |

The five derived values use Railway references:

```text
NEXT_PUBLIC_SUPABASE_STORAGE_URL=${{NEXT_PUBLIC_SUPABASE_URL}}/storage/v1/object
NEXT_PUBLIC_SUPABASE_PUBLIC_BUCKET=erpblobPublic
NEXT_PUBLIC_SUPABASE_PRIVATE_BUCKET=erpblob
NEXT_PUBLIC_APP_DOMAIN=https://${{RAILWAY_PUBLIC_DOMAIN}}
NEXT_PUBLIC_APP_LOGO=${{NEXT_PUBLIC_SUPABASE_STORAGE_URL}}/public/${{NEXT_PUBLIC_SUPABASE_PUBLIC_BUCKET}}/assets/stellar-app-logo.webp
```

### Optional variables

Add these in Railway only if you need them; the template does not prompt for
them.

| Variable                             | Default       | Purpose                                                          |
| ------------------------------------ | ------------- | ---------------------------------------------------------------- |
| `GOOGLE_GENERATIVE_AI_API_KEY`       | —             | BYOK provider key for all AI agents (Google Generative AI).      |
| `REPLICATE_API_TOKEN`                | —             | Image generation for the AI Image Studio.                        |
| `NEXT_PUBLIC_PEXELS_API_KEY`         | —             | Pexels image search in PDF grid flows.                           |
| `NEXT_PUBLIC_SUPABASE_CACHE_CONTROL` | `3600`        | `Cache-Control` max-age in seconds for Storage requests.         |
| `NEXT_PUBLIC_APP_NAME`               | `Stellar App` | Display name in the UI.                                          |
| `BOOTSTRAP_ADMIN_RESET_PASSWORD`     | `false`       | Set `true` to rotate the root admin password on the next deploy. |

## Pre-Deploy

```text
node migrate/release.mjs
  → prisma migrate deploy
  → seed RBAC roles and permissions
  → create/update root admin
  → create/update buckets, apply storage policies, upload fonts/logo
```

Every step is idempotent. The configured `BOOTSTRAP_ADMIN_EMAIL` is always
promoted to `admin`; other accounts are never auto-promoted.

## After Deploy

- Change the root admin password.
- Create users and assign roles.
- Upload your logo/assets or keep the defaults.
- Configure SMTP and review Supabase backups/plan limits.
- Optional custom domain: add it in Railway, override `NEXT_PUBLIC_APP_DOMAIN`
  if it differs from `RAILWAY_PUBLIC_DOMAIN`, update Supabase Auth URLs, and
  redeploy.
- Optional AI: add a Google key (and Replicate key for image generation) as
  Railway variables.

## Updates and Rollback

The template tracks `ghcr.io/app-corp/stellar:latest`. Railway redeploys when a
new digest is pushed to that tag, so every published build — including major
versions — is picked up automatically. Versioned tags are also published for
pinning: `1.0.3`, `1.0`, `1`, and `sha-<commit>`.

Pin a release by changing the service image tag to a versioned tag; disable
auto-updates in service settings for manual control. Migrations are forward-only,
so only roll back to a build that supports your current schema. Docker-image
templates do not receive Railway template update notifications; image
auto-updates are the update mechanism.

## Troubleshooting

| Symptom                                  | Fix                                                                                                    |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `P1001` / DB timeout                     | Use the Session pooler (5432), not direct IPv6.                                                        |
| `prepared statement "s0" already exists` | Transaction pooler without `pgbouncer=true`; use session pooling.                                      |
| Migration auth failure                   | URL-encode the password; confirm `DIRECT_URL` uses the session pooler.                                 |
| Storage bootstrap fails                  | Check the service-role key and `bootstrap-storage.mjs` logs.                                           |
| Nobody can sign in                       | Set `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD`, then redeploy. There is no public sign-up. |
| Login works but menu empty / 403         | Sign in with `BOOTSTRAP_ADMIN_EMAIL`; sign out and back in.                                            |
| Reset link has wrong host                | Set `NEXT_PUBLIC_APP_DOMAIN` and Supabase Auth Site URL to the public domain.                          |
| Password reset email missing             | Configure custom SMTP under Supabase **Authentication → Emails**.                                      |
| Uploads or PDF fonts fail                | Check `erpblobPublic`/`erpblob`, the `storage.objects` policies, `fonts/inter-*.ttf`, and the service-role key. |
| `must be owner of table objects`         | The bootstrap must not run `ALTER TABLE storage.objects` on hosted Supabase; RLS is already enabled. |
| Another user cannot open my private file | Expected: `erpblob` is owner-scoped. Share through the app or use an admin account.                     |
| AI agent requests fail                   | Check your Google/Replicate key, provider quota, and that the key is set on the service.               |
| Railway cannot pull image                | GHCR package must be public.                                                                           |
| Demo images use another host             | Some marketing content points at the demo bucket; replace for white-labelling.                         |
| Site not indexed / empty sitemap         | Expected on self-hosted domains: the sitemap is empty and robots disallows crawling.                   |

## FAQ

**Do I need a Railway database?** No. Railway runs only the stateless app
container; Postgres, Auth, and Storage come from your Supabase project.

**Can I host Stellar outside Railway?** Yes. The public image is a standard
container and can run on any Docker host; you still need Supabase for Postgres,
Auth, and Storage.

**Where is my data stored?** In your Supabase project — database rows in
Postgres and files in Supabase Storage. Railway holds no persistent data.

**Is the source code available?** No. Stellar is source-available, not open
source; the image ships compiled output only. See [LICENSE.md](./LICENSE.md).

**Can I use a custom domain?** Yes. Add it in Railway, override
`NEXT_PUBLIC_APP_DOMAIN` if it differs from `RAILWAY_PUBLIC_DOMAIN`, and update
the Supabase Auth Site URL and redirects.

**How do I use the AI agents?** Add your own Google Generative AI key to run
agents on your provider account (BYOK), or use an optional managed plan. Add a
Replicate token for the AI Image Studio. Agent output is advisory.

**Is the UI multilingual?** The interface is English today; translations are on
the roadmap.

**How do updates work?** The template tracks `:latest`, so new image builds are
redeployed automatically. Pin a versioned tag if you want a fixed release.

## Security notes

- Never commit secrets to this repository. All configuration belongs in Railway
  variables.
- The service-role key bypasses Supabase RLS. Treat it like a root password and
  keep it server-side. It is `SUPABASE_SERVICE_ROLE_KEY` — never create a
  `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`; the browser env script exposes safe
  `NEXT_PUBLIC_*` values and denylists secret-shaped names.
- There is no public sign-up. Create every additional user from **User
  Management** and grant roles via **RBAC**.
- Change the bootstrap admin password after your first login. Set
  `BOOTSTRAP_ADMIN_RESET_PASSWORD=true` to rotate it on a later deploy.

## Support and License

- [Deployment repository](https://github.com/app-corp/ai-business-operating-system-deployment)
- [Railway template](https://railway.com/template/ai-business-operating-system)
- [Railway documentation](https://docs.railway.com)
- [Supabase documentation](https://supabase.com/docs)

Stellar is **source-available**, not open source. See [LICENSE.md](./LICENSE.md) for the full terms.

In short: you may self-host and use Stellar for your own business, including commercially. You may not modify the Software, create derivative works, reverse engineer or decompile it, redistribute it, resell it, or operate it as a service for third parties. The image ships compiled, minified output only — the application source code is not distributed.

"Stellar" and the Stellar logo are trademarks of App Corp. Third-party open-source components bundled with the image remain under their own licenses.
