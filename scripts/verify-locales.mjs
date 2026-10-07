import fs from "node:fs";
import path from "node:path";

function getAllKeys(obj, prefix = "") {
  let keys = [];
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
        keys = keys.concat(getAllKeys(obj[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    }
  }
  return keys;
}

function getKeyOrder(obj, prefix = "") {
  const keys = [];
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      keys.push(fullKey);
      if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
        keys.push(...getKeyOrder(obj[key], fullKey));
      }
    }
  }
  return keys;
}

const namespacesDir = path.join(import.meta.dirname, "../src/i18n/locales");
const languages = fs
  .readdirSync(namespacesDir)
  .filter((f) => fs.statSync(path.join(namespacesDir, f)).isDirectory())
  .sort();

if (languages.length === 0) {
  process.stderr.write("❌ No language directories found\n");
  process.exit(1);
}

const referenceLanguage = "en";
if (!languages.includes(referenceLanguage)) {
  process.stderr.write(`❌ Reference language '${referenceLanguage}' not found\n`);
  process.exit(1);
}

// Get all namespace files from reference language
const referenceLangDir = path.join(namespacesDir, referenceLanguage);
const namespaces = fs
  .readdirSync(referenceLangDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => path.basename(f, ".json"))
  .sort();

if (namespaces.length === 0) {
  process.stderr.write(`❌ No namespace files found in ${referenceLanguage}\n`);
  process.exit(1);
}

let hasErrors = false;

// Check that all languages have the same namespaces
for (const lang of languages) {
  const langDir = path.join(namespacesDir, lang);
  const langNamespaces = fs
    .readdirSync(langDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.basename(f, ".json"))
    .sort();

  const missingNamespaces = namespaces.filter((ns) => !langNamespaces.includes(ns));
  const extraNamespaces = langNamespaces.filter((ns) => !namespaces.includes(ns));

  if (missingNamespaces.length > 0) {
    hasErrors = true;
    process.stderr.write(`❌ ${lang}: Missing namespaces: ${missingNamespaces.join(", ")}\n`);
  }

  if (extraNamespaces.length > 0) {
    hasErrors = true;
    process.stderr.write(`❌ ${lang}: Extra namespaces: ${extraNamespaces.join(", ")}\n`);
  }
}

if (hasErrors) {
  process.exit(1);
}

// Load and validate each namespace across all languages
for (const namespace of namespaces) {
  const namespaceData = {};
  const namespaceKeys = {};
  const namespaceKeyOrder = {};

  // Load namespace data for all languages
  for (const lang of languages) {
    const filePath = path.join(namespacesDir, lang, `${namespace}.json`);
    if (!fs.existsSync(filePath)) {
      hasErrors = true;
      process.stderr.write(`❌ File not found: ${filePath}\n`);
      continue;
    }

    try {
      namespaceData[lang] = JSON.parse(fs.readFileSync(filePath, "utf8"));
      namespaceKeys[lang] = getAllKeys(namespaceData[lang]);
      namespaceKeyOrder[lang] = getKeyOrder(namespaceData[lang]);
    } catch (error) {
      hasErrors = true;
      process.stderr.write(`❌ Invalid JSON in ${filePath}: ${error.message}\n`);
    }
  }

  if (!namespaceData[referenceLanguage]) {
    continue; // Skip if reference language failed to load
  }

  const referenceKeys = namespaceKeys[referenceLanguage];
  const referenceKeyOrder = namespaceKeyOrder[referenceLanguage];

  // Check keys consistency across languages
  for (const lang of languages) {
    if (lang === referenceLanguage || !namespaceKeys[lang]) {
      continue;
    }

    const currentKeys = namespaceKeys[lang];
    const currentKeyOrder = namespaceKeyOrder[lang];

    // Check for missing keys
    const missingKeys = referenceKeys.filter((key) => !currentKeys.includes(key));
    if (missingKeys.length > 0) {
      hasErrors = true;
      const noun = missingKeys.length === 1 ? "key" : "keys";
      process.stderr.write(`❌ ${namespace}.json (${lang}): Missing ${missingKeys.length} ${noun}\n`);

      const isVerbose = process.argv.includes("--verbose");
      const displayCount = isVerbose ? missingKeys.length : 5;
      const missingSorted = [...missingKeys].sort();

      for (const key of missingSorted.slice(0, displayCount)) {
        process.stderr.write(`  ${key}\n`);
      }

      if (!isVerbose && missingKeys.length > displayCount) {
        process.stderr.write(`  ... and ${missingKeys.length - displayCount} more\n`);
      }
    }

    // Check for extra keys
    const extraKeys = currentKeys.filter((key) => !referenceKeys.includes(key));
    if (extraKeys.length > 0) {
      hasErrors = true;
      const noun = extraKeys.length === 1 ? "key" : "keys";
      process.stderr.write(`❌ ${namespace}.json (${lang}): Extra ${extraKeys.length} ${noun}\n`);

      const isVerbose = process.argv.includes("--verbose");
      const displayCount = isVerbose ? extraKeys.length : 5;
      const extraSorted = [...extraKeys].sort();

      for (const key of extraSorted.slice(0, displayCount)) {
        process.stderr.write(`  ${key}\n`);
      }

      if (!isVerbose && extraKeys.length > displayCount) {
        process.stderr.write(`  ... and ${extraKeys.length - displayCount} more\n`);
      }
    }

    // Check key order consistency
    const orderMismatch = !currentKeyOrder.every((key, index) => key === referenceKeyOrder[index]);
    if (orderMismatch && currentKeys.length === referenceKeys.length) {
      hasErrors = true;
      process.stderr.write(`❌ ${namespace}.json (${lang}): Key order differs from ${referenceLanguage}\n`);

      if (process.argv.includes("--verbose")) {
        process.stderr.write(
          `  Expected order (${referenceLanguage}): ${referenceKeyOrder.slice(0, 3).join(", ")}...\n`,
        );
        process.stderr.write(`  Actual order (${lang}): ${currentKeyOrder.slice(0, 3).join(", ")}...\n`);
      }
    }
  }
}

if (hasErrors) {
  process.exit(1);
} else {
  process.stdout.write(
    `✅ All ${namespaces.length} namespaces have consistent keys and order across ${languages.length} languages!\n`,
  );
}
