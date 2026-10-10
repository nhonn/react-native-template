const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Metro replaces its base `nonInlinedRequires` list when a transform option is
// supplied, so the React/React Native entries must be repeated here.
const nonInlinedRequires = [
  "React",
  "react",
  "react/jsx-dev-runtime",
  "react/jsx-runtime",
  "react-compiler-runtime",
  "react-native",
  // WatermelonDB's import-time setup must run eagerly, never deferred by inlineRequires.
  "@nozbe/watermelondb",
];

config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: true,
      inlineRequires: true,
      nonInlinedRequires,
    },
  }),
  maxWorkerCount: require("node:os").cpus().length,
  enableBabelRCLookup: false,
  enableBabelRuntime: false,
};

config.serializer = {
  ...config.serializer,
};

config.resolver = {
  ...config.resolver,
  assetExts: [...(config.resolver?.assetExts || []), "bin"],
  sourceExts: [...(config.resolver?.sourceExts || []), "mjs"],
};

config.watchFolders = [];

module.exports = config;
