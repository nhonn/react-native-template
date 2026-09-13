import type { ConfigContext, ExpoConfig } from "expo/config";

type AppVariant = "development" | "preview" | "production";

function resolveVariant(value: string | undefined): AppVariant {
  switch (value) {
    case "dev":
    case "development":
      return "development";
    case "preview":
      return "preview";
    default:
      return "production";
  }
}

const variant = resolveVariant(process.env.APP_VARIANT);

function getName(base: string) {
  switch (variant) {
    case "production":
      return base;
    case "development":
      return `${base} (Dev)`;
    case "preview":
      return `${base} (Preview)`;
  }
}

function getAppId(base: string) {
  switch (variant) {
    case "production":
      return base;
    case "development":
      return `${base}.dev`;
    case "preview":
      return `${base}.preview`;
  }
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const name = getName(config.name ?? "my-template-app");
  const appId = getAppId(config.ios?.bundleIdentifier ?? config.android?.package ?? "com.mytemplateproject");

  return {
    ...config,
    slug: config.slug || "",
    name,
    ios: {
      ...config.ios,
      bundleIdentifier: appId,
    },
    android: {
      ...config.android,
      package: appId,
    },
    extra: {
      ...config.extra,
      variant,
    },
    plugins: [
      ...(config.plugins ?? []),
      [
        "expo-dev-client",
        {
          addGeneratedScheme: variant === "development",
        },
      ],
    ],
  };
};
