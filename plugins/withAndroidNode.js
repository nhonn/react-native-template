const { execSync } = require("node:child_process");
const {
  withAppBuildGradle,
  withDangerousMod,
  withGradleProperties,
  withSettingsGradle,
} = require("expo/config-plugins");

const TAG = "template-android-node";

function resolveNodeBinary() {
  if (process.env.NODE_BINARY) {
    return process.env.NODE_BINARY;
  }

  try {
    return execSync("command -v node", { encoding: "utf8", shell: true }).trim();
  } catch {
    return process.execPath;
  }
}

function escapeGradleString(value) {
  return value.replace(/\\/g, "\\\\");
}

function escapeShellString(value) {
  return value.replace(/'/g, `'\\''`);
}

function resolveJavaHome() {
  const fs = require("node:fs");
  const candidates = [
    "/opt/homebrew/opt/openjdk@17",
    "/opt/homebrew/opt/openjdk@21",
    "/usr/local/opt/openjdk@17",
    "/usr/local/opt/openjdk@21",
    "/Library/Java/JavaVirtualMachines/openjdk-17.jdk/Contents/Home",
    "/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home",
    "/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home",
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

function buildNodeExecutableBlock(nodeBinary) {
  const escapedNodeBinary = escapeGradleString(nodeBinary);

  return `// @generated begin ${TAG}
  def templateNodeExecutable = {
    def nodeBinary = System.getenv("NODE_BINARY")
    if (nodeBinary != null && !nodeBinary.isEmpty()) {
      return nodeBinary
    }
    def candidates = [
      "${escapedNodeBinary}",
      "/opt/homebrew/bin/node",
      "/usr/local/bin/node",
      "\${System.getProperty('user.home')}/.nvm/versions/node/current/bin/node",
      "\${System.getProperty('user.home')}/.fnm/current/bin/node",
      "\${System.getProperty('user.home')}/.volta/bin/node",
    ]
    for (candidate in candidates) {
      def file = new File(candidate)
      if (file.exists() && file.canExecute()) {
        return candidate
      }
    }
    return "node"
  }()
// @generated end ${TAG}`;
}

function buildGradlewBlock(nodeBinary) {
  const escapedNodeBinary = escapeShellString(nodeBinary);

  return `# @generated begin ${TAG}
if [ -z "$NODE_BINARY" ]; then
  for candidate in \\
    '${escapedNodeBinary}' \\
    "/opt/homebrew/bin/node" \\
    "/usr/local/bin/node" \\
    "$HOME/.nvm/versions/node/current/bin/node" \\
    "$HOME/.fnm/current/bin/node" \\
    "$HOME/.volta/bin/node"
  do
    if [ -x "$candidate" ]; then
      NODE_BINARY="$candidate"
      break
    fi
  done
fi
if [ -n "$NODE_BINARY" ]; then
  export NODE_BINARY
  export PATH="$(dirname "$NODE_BINARY"):$PATH"
fi
# @generated end ${TAG}`;
}

function stripGeneratedBlock(contents, commentPrefix) {
  const escapedTag = TAG.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const start = `${commentPrefix} @generated begin ${escapedTag}`;
  const end = `${commentPrefix} @generated end ${escapedTag}`;

  return contents.replace(new RegExp(`${start}[\\s\\S]*?${end}\\n?`, "g"), "");
}

function patchSettingsGradle(contents, nodeBinary) {
  let src = stripGeneratedBlock(contents, "//");
  src = src.replace(/commandLine\("node"/g, "commandLine(templateNodeExecutable");

  const block = `${buildNodeExecutableBlock(nodeBinary)}\n\n  `;
  const pluginManagementAnchor = "pluginManagement {";
  const anchorIndex = src.indexOf(pluginManagementAnchor);

  if (anchorIndex === -1) {
    throw new Error(`[${TAG}] Failed to modify settings.gradle — could not find pluginManagement anchor.`);
  }

  const insertAt = anchorIndex + pluginManagementAnchor.length;
  return `${src.slice(0, insertAt)}\n  ${block}${src.slice(insertAt)}`;
}

function patchAppBuildGradle(contents, nodeBinary) {
  let src = stripGeneratedBlock(contents, "//");
  src = src.replace(/\["node"/g, "[templateNodeExecutable");
  src = src.replace(/\/\/ nodeExecutableAndArgs = \["node"\]/, "nodeExecutableAndArgs = [templateNodeExecutable]");

  const block = buildNodeExecutableBlock(nodeBinary).replace(/^ {2}/gm, "");
  const projectRootAnchor = "def projectRoot = rootDir.getAbsoluteFile().getParentFile().getAbsolutePath()";
  const anchorIndex = src.indexOf(projectRootAnchor);

  if (anchorIndex === -1) {
    throw new Error(`[${TAG}] Failed to modify app/build.gradle — could not find projectRoot anchor.`);
  }

  const insertAt = anchorIndex + projectRootAnchor.length;
  return `${src.slice(0, insertAt)}\n\n${block}\n${src.slice(insertAt)}`;
}

function patchGradlew(contents, nodeBinary) {
  const src = stripGeneratedBlock(contents, "#");
  const block = `${buildGradlewBlock(nodeBinary)}\n\n`;
  const anchor = "APP_HOME=$( cd -P ";
  const anchorIndex = src.indexOf(anchor);

  if (anchorIndex === -1) {
    throw new Error(`[${TAG}] Failed to modify gradlew — could not find APP_HOME anchor.`);
  }

  const lineEnd = src.indexOf("\n", anchorIndex);
  const insertAt = lineEnd === -1 ? src.length : lineEnd;
  return `${src.slice(0, insertAt)}\n\n${block}${src.slice(insertAt)}`;
}

/**
 * Persists an absolute Node binary path for Android Gradle across `expo prebuild --clean`.
 * Android Studio and Gradle daemons often lack shell PATH (nvm/fnm/homebrew), which breaks
 * bare `node` invocations in settings.gradle and app/build.gradle.
 *
 * @type {import('expo/config-plugins').ConfigPlugin}
 */
function withAndroidNode(config) {
  const nodeBinary = resolveNodeBinary();

  config = withGradleProperties(config, (config) => {
    const properties = config.modResults;
    const setProperty = (key, value) => {
      const existing = properties.find((property) => property.type === "property" && property.key === key);

      if (existing) {
        existing.value = value;
        return;
      }

      properties.push({ type: "property", key, value });
    };

    setProperty("org.gradle.jvmargs", "-Xmx6144m -XX:MaxMetaspaceSize=1024m");
    const javaHome = resolveJavaHome();
    if (javaHome) {
      setProperty("org.gradle.java.home", javaHome);
    }
    setProperty("org.gradle.caching", "true");
    // Expo app/build.gradle still resolves Node paths via Groovy .execute(), which
    // Gradle 9 configuration cache rejects. Keep build cache; leave config cache off
    // until the template uses providers.exec / ValueSource for those lookups.
    setProperty("org.gradle.configuration-cache", "false");
    setProperty(
      "reactNativeArchitectures",
      process.env.APP_VARIANT === "development" ? "arm64-v8a,x86_64" : "armeabi-v7a,arm64-v8a,x86,x86_64",
    );
    return config;
  });

  config = withSettingsGradle(config, (config) => {
    config.modResults.contents = patchSettingsGradle(config.modResults.contents, nodeBinary);
    return config;
  });

  config = withAppBuildGradle(config, (config) => {
    config.modResults.contents = patchAppBuildGradle(config.modResults.contents, nodeBinary);
    return config;
  });

  config = withDangerousMod(config, [
    "android",
    async (config) => {
      const fs = require("node:fs");
      const path = require("node:path");
      const androidRoot = config.modRequest.platformProjectRoot;
      const gradlewPath = path.join(androidRoot, "gradlew");
      const gradlewContents = fs.readFileSync(gradlewPath, "utf8");
      fs.writeFileSync(gradlewPath, patchGradlew(gradlewContents, nodeBinary));

      const gradlePropertiesPath = path.join(androidRoot, "gradle.properties");
      const gradleProperties = fs.readFileSync(gradlePropertiesPath, "utf8");
      const withoutGeneratedProperties = gradleProperties.replace(
        /\n?# @generated begin template-android-build-cache[\s\S]*?# @generated end template-android-build-cache\n?/g,
        "",
      );
      const architectures =
        process.env.APP_VARIANT === "development" ? "arm64-v8a,x86_64" : "armeabi-v7a,arm64-v8a,x86,x86_64";
      const javaHome = resolveJavaHome();
      const javaHomeProperty = javaHome ? `\norg.gradle.java.home=${javaHome}` : "";
      const buildProperties = `# @generated begin template-android-build-cache
org.gradle.caching=true
org.gradle.configuration-cache=false
reactNativeArchitectures=${architectures}
org.gradle.jvmargs=-Xmx6144m -XX:MaxMetaspaceSize=1024m${javaHomeProperty}
# @generated end template-android-build-cache
`;
      fs.writeFileSync(gradlePropertiesPath, `${withoutGeneratedProperties.trimEnd()}\n\n${buildProperties}`);
      return config;
    },
  ]);

  return config;
}

module.exports = withAndroidNode;
