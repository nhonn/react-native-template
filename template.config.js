module.exports = {
  // Name of the template
  name: "react-native-template",
  
  // Description of the template
  description: "A modern, feature-rich React Native template built with Expo",
  
  // Placeholders that will be replaced in the template files
  placeholders: {
    "MyTemplateProject": {
      description: "Name of your project in title case, used in various places like app.json and package.json",
      default: "MyApp"
    },
    "my-template-project": {
      description: "Name of your project in kebab-case, used for directory names and URLs",
      default: "my-app"
    },
    "mytemplateproject": {
      description: "Name of your project in lowercase without hyphens, used for bundle identifiers",
      default: "myapp"
    },
    "com.mytemplateproject": {
      description: "Bundle identifier for your app",
      default: "com.myapp"
    }
  },
  
  // Files to ignore when creating a new project
  ignoreFiles: [
    ".git/**/*",
    "node_modules/**/*",
    ".github/**/*",
    "LICENSE"
  ]
};
