import type { ConfigContext, ExpoConfig } from "expo/config";

type AppVariant = "development" | "production";

function resolveVariant(value: string | undefined): AppVariant {
  switch (value) {
    case "dev":
      return "development";
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
  }
}

function getAppId(base: string) {
  switch (variant) {
    case "production":
      return base;
    case "development":
      return `${base}.dev`;
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
