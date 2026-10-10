const path = require("node:path");
const { CodeGenerator, withPodfile } = require("expo/config-plugins");

const { mergeContents } = CodeGenerator;

const TAG = "template-watermelondb";
const BEGIN = `# @generated begin ${TAG}`;
const END = `# @generated end ${TAG}`;

/**
 * WatermelonDB 0.28 needs the npm-vendored simdjson (never the CocoaPods build) and must be
 * compiled as a static library: this app links pods statically (expo-build-properties
 * `useFrameworks: static`), so WatermelonDB's C++ and simdjson cannot be dynamic frameworks.
 *
 * The `path:` is interpolated at prebuild time because the isolated node_modules layout does
 * not expose `@nozbe/simdjson` at the project root — it is only resolvable from WatermelonDB.
 */
function resolveSimdjsonPath() {
  try {
    const simdjsonManifest = require.resolve("@nozbe/simdjson/package.json", {
      paths: [path.dirname(require.resolve("@nozbe/watermelondb/package.json"))],
    });
    return path.dirname(simdjsonManifest);
  } catch {
    return null;
  }
}

function buildPodfileBlock() {
  const simdjsonPath = resolveSimdjsonPath();
  const podLine = simdjsonPath
    ? `  pod 'simdjson', path: '${simdjsonPath}', :modular_headers => true`
    : "  pod 'simdjson', path: '../node_modules/@nozbe/simdjson', :modular_headers => true";

  return `
  # WatermelonDB needs the npm-vendored simdjson, and both pods must be static libraries.
${podLine}

  pre_install do |installer|
    installer.pod_targets.each do |pod|
      if ['WatermelonDB', 'simdjson'].include?(pod.name)
        def pod.build_type
          Pod::BuildType.static_library
        end
      end
    end
  end
`;
}

/**
 * Android and iOS both use WatermelonDB's bridge dispatcher. The iOS JSI adapter
 * in 0.28 depends on React Native's removed RCTCxxBridge API, so enabling it
 * cannot compile with the app's React Native 0.88 toolchain.
 */
function insertPodfileEntries(contents) {
  const src = contents.replace(new RegExp(`${BEGIN}[\\s\\S]*?${END}\\n?`, "g"), "");
  const merged = mergeContents({
    tag: TAG,
    src,
    newSrc: buildPodfileBlock(),
    anchor: /prepare_react_native_project!/,
    offset: 1,
    comment: "#",
  });

  if (!merged.didMerge) {
    throw new Error(`[${TAG}] Failed to modify Podfile — could not find prepare_react_native_project! anchor.`);
  }

  return merged.contents;
}

function withWatermelonPodfile(config) {
  return withPodfile(config, (config) => {
    config.modResults.contents = insertPodfileEntries(config.modResults.contents);
    return config;
  });
}

module.exports = function withWatermelonDb(config) {
  config = withWatermelonPodfile(config);
  return config;
};

// Exposed so the local (gitignored) `ios/Podfile` can be refreshed with the same transform
// without regenerating the whole native project.
module.exports.insertPodfileEntries = insertPodfileEntries;
