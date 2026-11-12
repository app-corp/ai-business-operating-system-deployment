import { defineRailway, image, project, service } from "railway/iac";

// Source project for the public Stellar template.
//
// Template prompts, sealed inputs, and reference variables are configured in
// the Railway template composer; they are not part of the IaC DSL. Apply this
// file to create the service with the correct source and deploy settings, then
// generate the template from the project.
export default defineRailway(() => {
  const main = service("main", {
    source: image("ghcr.io/app-corp/stellar:1.0.0", {
      autoUpdates: { type: "minor" },
    }),
    preDeploy: "node migrate/release.mjs",
    healthcheck: "/api/health",
    healthcheckTimeout: 120,
  });

  return project("stellar-public", {
    resources: [main],
  });
});
