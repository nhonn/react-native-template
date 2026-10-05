const { execFileSync, execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const { withDangerousMod, withXcodeProject } = require("expo/config-plugins");

const TAG = "template-ios-node";
const XCODE_ENV_LOCAL = ".xcode.env.local";

function resolveNodeProcessPath(candidate) {
  if (typeof candidate !== "string" || candidate.length === 0) {
    return null;
  }

  try {
    return execFileSync(candidate, ["-p", "process.execPath"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

/**
 * Resolve an absolute, persistent Node binary path for Xcode.
 *
 * Nub can expose NODE_BINARY as a temporary shim while running Expo. That
 * path disappears after the command exits, so persisting it makes the next
 * Xcode build fail before any application code runs.
 */
function resolveStableNodeBinary(candidate) {
  if (typeof candidate !== "string" || candidate.length === 0) {
    return null;
  }

  try {
    fs.accessSync(candidate, fs.constants.X_OK);
    if (!fs.statSync(candidate).isFile()) {
      return null;
    }

    const resolved = fs.realpathSync(candidate);
    if (resolved.includes("nub-node-shim")) {
      return null;
    }
    return resolved;
  } catch {
    return null;
  }
}

function resolveNodeBinary() {
  const candidates = [];
  if (process.env.NODE_BINARY) {
    candidates.push(resolveNodeProcessPath(process.env.NODE_BINARY), process.env.NODE_BINARY);
  }

  try {
    const commandPath = execSync("command -v node", { encoding: "utf8", shell: true }).trim();
    candidates.push(resolveNodeProcessPath(commandPath), commandPath);
  } catch {
    // Continue with the known installation paths below.
  }

  candidates.push(
    "/opt/homebrew/bin/node",
    "/usr/local/bin/node",
    path.join(process.env.HOME ?? "", ".nvm/versions/node/current/bin/node"),
    path.join(process.env.HOME ?? "", ".fnm/current/bin/node"),
    path.join(process.env.HOME ?? "", ".volta/bin/node"),
    resolveNodeProcessPath(process.execPath),
    process.execPath,
  );

  for (const candidate of candidates) {
    const stableBinary = resolveStableNodeBinary(candidate);
    if (stableBinary) {
      return stableBinary;
    }
  }

  throw new Error(`[${TAG}] Could not find a persistent Node executable.`);
}

function stripGeneratedBlock(contents) {
  return contents.replace(new RegExp(`# @generated begin ${TAG}[\\s\\S]*?# @generated end ${TAG}\\n?`, "g"), "");
}

function buildEnvLocalBlock(nodeBinary) {
  return `# @generated begin ${TAG}
# Xcode build phases inherit no login shell, so PATH has no node and the
# \`command -v node\` default in .xcode.env resolves to nothing. Pin the absolute
# binary here; .xcode.env.local is sourced after .xcode.env by every Expo and
# React Native build phase.
export NODE_BINARY="${nodeBinary}"
# @generated end ${TAG}
`;
}

function writeXcodeEnvLocal(config, nodeBinary) {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const envLocalPath = path.join(config.modRequest.platformProjectRoot, XCODE_ENV_LOCAL);
      const existing = fs.existsSync(envLocalPath) ? fs.readFileSync(envLocalPath, "utf8") : "";
      const preserved = stripGeneratedBlock(existing).trimEnd();

      if (preserved.length === 0) {
        fs.writeFileSync(envLocalPath, buildEnvLocalBlock(nodeBinary));
        return config;
      }

      fs.writeFileSync(envLocalPath, `${preserved}\n\n${buildEnvLocalBlock(nodeBinary)}`);
      return config;
    },
  ]);
}

/**
 * Exposes NODE_BINARY to every script phase through the build settings, which Xcode
 * exports as environment variables. Sentry's "Upload Debug Symbols to Sentry" phase
 * resolves its script path with `${NODE_BINARY:-node}`; the generated phase
 * sources .xcode.env.local for consistency with Expo/RN phases.
 */
function withNodeBinaryBuildSetting(config, nodeBinary) {
  return withXcodeProject(config, (config) => {
    const xcodeProject = config.modResults;
    const appTargetName = config.modRequest.projectName ?? config.name;
    const appTarget = xcodeProject.pbxTargetByName(appTargetName);

    if (!appTarget) {
      throw new Error(`[${TAG}] Failed to modify the Xcode project — no target named "${appTargetName}".`);
    }

    const configurationList = xcodeProject.pbxXCConfigurationList()[appTarget.buildConfigurationList];
    if (!configurationList) {
      throw new Error(`[${TAG}] Failed to modify the Xcode project — "${appTargetName}" has no configuration list.`);
    }

    const configurations = xcodeProject.pbxXCBuildConfigurationSection();
    for (const reference of configurationList.buildConfigurations) {
      const buildSettings = configurations[reference.value]?.buildSettings;
      if (!buildSettings) {
        throw new Error(
          `[${TAG}] Failed to modify the Xcode project — missing build settings for "${reference.value}".`,
        );
      }

      buildSettings.NODE_BINARY = JSON.stringify(nodeBinary);
    }

    const sentryPhase = xcodeProject.pbxItemByComment("Upload Debug Symbols to Sentry", "PBXShellScriptBuildPhase");
    if (sentryPhase) {
      const script = JSON.parse(sentryPhase.shellScript);
      if (!script.includes(".xcode.env.local")) {
        sentryPhase.shellScript = JSON.stringify(
          `if [ -f "$PROJECT_DIR/.xcode.env.local" ]; then\n  . "$PROJECT_DIR/.xcode.env.local"\nfi\n${script}`,
        );
      }
    }

    return config;
  });
}

/**
 * Persists an absolute Node binary path for iOS Xcode builds across `expo prebuild --clean`.
 * Xcode, unlike a terminal, runs build phases without a login shell: `node` is not on PATH,
 * so `command -v node` yields nothing and Expo / Sentry script phases fail with
 * "node: command not found".
 *
 * @type {import('expo/config-plugins').ConfigPlugin}
 */
function withIosNode(config) {
  const nodeBinary = resolveNodeBinary();

  config = writeXcodeEnvLocal(config, nodeBinary);
  config = withNodeBinaryBuildSetting(config, nodeBinary);

  return config;
}

module.exports = withIosNode;
