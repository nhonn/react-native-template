module.exports = (api) => {
  api.cache(true);
  return {
    // Legacy decorators (WatermelonDB models); babel-preset-expo bundles
    // @babel/plugin-proposal-decorators, so no extra dependency is needed.
    presets: [["babel-preset-expo", { decorators: { legacy: true } }]],
    plugins: [["react-native-unistyles/plugin", { root: "src" }], "react-native-reanimated/plugin"],
  };
};
