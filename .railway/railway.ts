import { defineRailway, image, project, service } from "railway/iac";

// Source project for the public Stellar template.
//
// Variable metadata below feeds the template deploy form. Descriptions are
// required for every prompted variable; defaults/references keep the form short.
export default defineRailway(() => {
  const main = service("main", {
    source: image("ghcr.io/app-corp/stellar:1.0.0", {
      autoUpdates: { type: "minor" },
    }),
    preDeploy: "node migrate/release.mjs",
    healthcheck: "/api/health",
    healthcheckTimeout: 120,
    variables: {
      NEXT_PUBLIC_SUPABASE_URL: {
        description:
          "Supabase project URL, e.g. https://abcd.supabase.co. Copy from Project Settings → API; no trailing slash.",
      },
      NEXT_PUBLIC_SUPABASE_ANON_KEY: {
        description:
          "Supabase anon/public key. Browser-safe. Project Settings → API.",
      },
      NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY: {
        description:
          "Supabase service-role secret. Server-only; used for admin bootstrap and storage. Never expose it to the browser.",
        isSealed: true,
      },
      DATABASE_URL: {
        description:
          "Supabase Postgres Session-pooler URL (IPv4, port 5432), including the password and ?sslmode=require. Used by the app at runtime.",
        isSealed: true,
      },
      BOOTSTRAP_ADMIN_EMAIL: {
        description:
          "Email for the root admin account created on first deploy. Use the address you will sign in with.",
      },
      BOOTSTRAP_ADMIN_PASSWORD: {
        description:
          "Password for the root admin account. Sealed and never logged. Use a strong password.",
        isSealed: true,
      },
      DIRECT_URL: {
        description:
          "Connection used by Prisma migrations. Use the same Supabase Session-pooler URL as DATABASE_URL.",
        defaultValue: "${{DATABASE_URL}}",
        isOptional: true,
      },
      SUPABASE_SERVICE_ROLE_KEY: {
        description:
          "Alias of NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY used by server-side storage code.",
        defaultValue: "${{NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY}}",
        isOptional: true,
      },
      NEXT_PUBLIC_SUPABASE_STORAGE_URL: {
        description: "Supabase Storage endpoint for the project.",
        defaultValue: "${{NEXT_PUBLIC_SUPABASE_URL}}/storage/v1/object",
        isOptional: true,
      },
      NEXT_PUBLIC_SUPABASE_PUBLIC_BUCKET: {
        description:
          "Public bucket for logos, fonts, and public assets.",
        defaultValue: "erpblobPublic",
        isOptional: true,
      },
      NEXT_PUBLIC_SUPABASE_PRIVATE_BUCKET: {
        description:
          "Private bucket for uploads and generated documents.",
        defaultValue: "erpblob",
        isOptional: true,
      },
      NEXT_PUBLIC_SUPABASE_CACHE_CONTROL: {
        description:
          "Cache-Control max-age in seconds for Supabase Storage requests.",
        defaultValue: "3600",
        isOptional: true,
      },
      NEXT_PUBLIC_APP_DOMAIN: {
        description:
          "Public origin of this deployment. Do not use stellarapp.site.",
        defaultValue: "https://${{RAILWAY_PUBLIC_DOMAIN}}",
        isOptional: true,
      },
      NEXT_PUBLIC_BASE_URL: {
        description:
          "Absolute base URL for links and password-reset emails.",
        defaultValue: "${{NEXT_PUBLIC_APP_DOMAIN}}",
        isOptional: true,
      },
      NEXT_PUBLIC_API_URL: {
        description: "Base URL for client API requests.",
        defaultValue: "${{NEXT_PUBLIC_APP_DOMAIN}}",
        isOptional: true,
      },
      NEXT_PUBLIC_APP_NAME: {
        description: "Display name shown in the UI and metadata.",
        defaultValue: "Stellar App",
        isOptional: true,
      },
      NEXT_PUBLIC_APP_LOGO: {
        description:
          "Absolute logo URL in the public Supabase bucket.",
        defaultValue:
          "${{NEXT_PUBLIC_SUPABASE_STORAGE_URL}}/public/${{NEXT_PUBLIC_SUPABASE_PUBLIC_BUCKET}}/assets/stellar-app-logo.webp",
        isOptional: true,
      },
      NEXT_PUBLIC_APP_TRANSLATIONS: {
        description:
          "Feature flag for the Translations module: true or false.",
        defaultValue: "true",
        isOptional: true,
      },
      NEXT_PUBLIC_APP_SUPABASE_STORAGE: {
        description:
          "Feature flag for the Supabase Storage module: true or false.",
        defaultValue: "true",
        isOptional: true,
      },
      NEXT_PUBLIC_WORKER_URL: {
        description:
          "Optional worker/API base URL. Leave empty; this template does not deploy a worker.",
        defaultValue: "",
        isOptional: true,
      },
      BOOTSTRAP_ADMIN_RESET_PASSWORD: {
        description:
          "Set true to rotate the root admin password on the next deploy; otherwise false or empty.",
        defaultValue: "false",
        isOptional: true,
      },
    },
  });

  return project("stellar-public", {
    resources: [main],
  });
});
