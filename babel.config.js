module.exports = (api) => {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["inline-import", { extensions: [".sql"] }],
      ["react-native-unistyles/plugin", { root: "src" }],
      "react-native-reanimated/plugin",
    ],
  };
};
