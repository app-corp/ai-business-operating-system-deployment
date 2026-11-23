import { defineRailway, image, project, service } from "railway/iac";

// Source project for the public Stellar template.
//
// Variable metadata below feeds the template deploy form. Descriptions are
// required for every prompted variable; defaults/references keep the form short.
export default defineRailway(() => {
  const main = service("main", {
    source: image("ghcr.io/app-corp/stellar:latest", {
      // `latest` is a non-semver tag: Railway redeploys when a new digest is
      // pushed to it, so the update policy type does not apply.
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
      SUPABASE_SERVICE_ROLE_KEY: {
        description:
          "Supabase service-role secret for server-side storage code. Never expose it to the browser. Project Settings → API.",
        isSealed: true,
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
      DIRECT_URL: {
        description:
          "Direct connection for Prisma migrations. Use the same Supabase Session-pooler URL as DATABASE_URL.",
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
      NEXT_PUBLIC_APP_DOMAIN: {
        description: "Public origin of this deployment.",
        defaultValue: "https://${{RAILWAY_PUBLIC_DOMAIN}}",
        isOptional: true,
      },
      NEXT_PUBLIC_APP_LOGO: {
        description:
          "Absolute logo URL in the public Supabase bucket.",
        defaultValue:
          "${{NEXT_PUBLIC_SUPABASE_STORAGE_URL}}/public/${{NEXT_PUBLIC_SUPABASE_PUBLIC_BUCKET}}/assets/stellar-app-logo.webp",
        isOptional: true,
      },
    },
  });

  return project("stellar-public", {
    resources: [main],
  });
});
