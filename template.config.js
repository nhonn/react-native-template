module.exports = {
  // Name of the template
  name: "react-native-template",

  // Description of the template
  description: "A modern, feature-rich React Native template built with Expo",

  // Placeholders that will be replaced in the template files
  placeholders: {
    "my-template-app": {
      description: "Name of your project in title case, used in various places like app.json and package.json",
      default: "myapp",
    },
    "my-template-project": {
      description: "Name of your project in kebab-case, used for directory names and URLs",
      default: "my-app",
    },
    "com.mytemplateproject": {
      description:
        "Bundle identifier for iOS and Android package name - must be unique and follow reverse domain notation",
      default: "com.myapp",
    },
  },

  // Post-initialization script to ensure proper configuration synchronization
  postInitScript: {
    description: "Validates that app.json configurations are properly synchronized",
    validations: [
      {
        file: "app.json",
        checks: [
          {
            path: "expo.scheme",
            shouldMatch: "mytemplateproject",
            description: "App scheme should match the lowercase project name",
          },
          {
            path: "expo.ios.bundleIdentifier",
            shouldMatch: "com.mytemplateproject",
            description: "iOS bundle identifier should match the bundle identifier placeholder",
          },
          {
            path: "expo.android.package",
            shouldMatch: "com.mytemplateproject",
            description: "Android package should match the bundle identifier placeholder",
          },
        ],
      },
    ],
  },

  // Files to ignore when creating a new project
  ignoreFiles: [".git/**/*", "node_modules/**/*", ".github/**/*", "LICENSE"],
};
