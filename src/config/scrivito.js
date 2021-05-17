import * as Scrivito from "scrivito";

export function configureScrivito(options) {
  const config = {
    tenant: process.env.SCRIVITO_TENANT,
    adoptUi: "http://localhost:8090",
    unstable: {
      assetUrlBase: "http://localhost:8091",
      trustedUiOrigins: [
        "http://localhost:8090",
        "http://127.0.0.1:8090",
        "https://*.netlify.app",
      ],
    },
  };

  if (process.env.SCRIVITO_ORIGIN) {
    config.origin = process.env.SCRIVITO_ORIGIN;
  }

  if (process.env.SCRIVITO_ENDPOINT) {
    config.endpoint = process.env.SCRIVITO_ENDPOINT;
  }

  if (options?.priority) {
    config.priority = options.priority;
  }

  Scrivito.configure(config);
}
