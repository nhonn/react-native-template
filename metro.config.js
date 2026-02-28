const { withUniwindConfig } = require("uniwind/metro");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: true,
      inlineRequires: true,
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
  sourceExts: [...(config.resolver?.sourceExts || []), "mjs", "sql"],
};

config.watchFolders = [];

module.exports = withUniwindConfig(config, { cssEntryFile: "./src/global.css" });
