# Railway template variable descriptions

Use these descriptions in the Railway template composer. Every required variable
must have one; the text below is written for the person filling the deploy form.

## Required prompts

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL, e.g. `https://abcd.supabase.co`. Copy it from Project Settings → API; do not add a trailing slash. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key. This key is safe for the browser. Project Settings → API. |
| `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role secret. Server-only; used for admin bootstrap and storage. Never expose it to the browser. |
| `DATABASE_URL` | Supabase Postgres Session-pooler URL (IPv4, port `5432`), including the database password and `?sslmode=require`. Used by the app at runtime. |
| `BOOTSTRAP_ADMIN_EMAIL` | Email for the root admin account created on first deploy. Use the address you will sign in with. |
| `BOOTSTRAP_ADMIN_PASSWORD` | Password for the root admin account. Sealed and never logged. Use a strong password. |

## Derived values

| Variable | Description |
| --- | --- |
| `DIRECT_URL` | Connection used by Prisma migrations. Use the same Supabase Session-pooler URL as `DATABASE_URL`, or a direct connection if your project has IPv6 access. |
| `SUPABASE_SERVICE_ROLE_KEY` | Alias of `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` used by server-side storage code. Set it to the same value. |
| `NEXT_PUBLIC_SUPABASE_STORAGE_URL` | Supabase Storage endpoint: `<NEXT_PUBLIC_SUPABASE_URL>/storage/v1/object`. |
| `NEXT_PUBLIC_APP_DOMAIN` | Public origin of this deployment, e.g. `https://your-app.up.railway.app`. Used for platform checks and absolute links. Do not use `stellarapp.site`. |
| `NEXT_PUBLIC_BASE_URL` | Absolute base URL for links and emails. Normally the same as `NEXT_PUBLIC_APP_DOMAIN`; used for password-reset redirects. |
| `NEXT_PUBLIC_API_URL` | Base URL for client API requests. Normally the same as `NEXT_PUBLIC_APP_DOMAIN`. |
| `NEXT_PUBLIC_APP_LOGO` | Absolute logo URL, usually `<storage-url>/public/<public-bucket>/assets/stellar-app-logo.webp`. |

## Optional values

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_PUBLIC_BUCKET` | Public bucket for logos, fonts, and public assets. Default `erpblobPublic`. |
| `NEXT_PUBLIC_SUPABASE_PRIVATE_BUCKET` | Private bucket for uploads and generated documents. Default `erpblob`. |
| `NEXT_PUBLIC_SUPABASE_CACHE_CONTROL` | Cache-Control max-age in seconds for Supabase Storage requests. Default `3600`. |
| `NEXT_PUBLIC_APP_NAME` | Display name shown in the UI and metadata. Default `Stellar App`. |
| `NEXT_PUBLIC_APP_TRANSLATIONS` | Feature flag for the Translations module: `true` or `false`. Default `true`. |
| `NEXT_PUBLIC_APP_SUPABASE_STORAGE` | Feature flag for the Supabase Storage module: `true` or `false`. Default `true`. |
| `NEXT_PUBLIC_WORKER_URL` | Optional worker/API base URL. Leave empty; this template does not deploy a worker service. |
| `BOOTSTRAP_ADMIN_RESET_PASSWORD` | Set `true` to rotate the root admin password on the next deploy; otherwise `false` or empty. |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Optional Google Generative AI key for AI agents. |
| `REPLICATE_API_TOKEN` | Optional Replicate token for image generation. |
| `NEXT_PUBLIC_PEXELS_API_KEY` | Optional Pexels key for image search. |

## Where to apply

- **New template:** set these descriptions in the template composer, or apply
  them through `.railway/railway.ts` before generating the template.
- **Existing template (`1.0.2`):** edit the template draft and paste the
  descriptions into each variable. Updating the source project alone does not
  change an already-published template.
