import fs from "node:fs";
import path from "node:path";

/**
 * One walk: `order` includes intermediate object paths (for order parity),
 * `leaves` is the Set of terminal keys (for missing/extra checks).
 */
function walk(obj, prefix = "") {
  const order = [];
  const leaves = new Set();

  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    order.push(fullKey);

    const val = obj[key];
    if (typeof val === "object" && val !== null && !Array.isArray(val)) {
      const nested = walk(val, fullKey);
      order.push(...nested.order);
      for (const k of nested.leaves) {
        leaves.add(k);
      }
    } else {
      leaves.add(fullKey);
    }
  }

  return { order, leaves };
}

function setsEqual(a, b) {
  if (a.size !== b.size) {
    return false;
  }
  for (const k of a) {
    if (!b.has(k)) {
      return false;
    }
  }
  return true;
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

const isVerbose = process.argv.includes("--verbose");
let hasErrors = false;

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

for (const namespace of namespaces) {
  /** @type {Record<string, { order: string[], leaves: Set<string> }>} */
  const byLang = {};

  for (const lang of languages) {
    const filePath = path.join(namespacesDir, lang, `${namespace}.json`);
    try {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      byLang[lang] = walk(data);
    } catch (error) {
      hasErrors = true;
      if (error && error.code === "ENOENT") {
        process.stderr.write(`❌ File not found: ${filePath}\n`);
      } else {
        process.stderr.write(`❌ Invalid JSON in ${filePath}: ${error.message}\n`);
      }
    }
  }

  const reference = byLang[referenceLanguage];
  if (!reference) {
    continue;
  }

  for (const lang of languages) {
    if (lang === referenceLanguage || !byLang[lang]) {
      continue;
    }

    const current = byLang[lang];

    const missingKeys = [];
    for (const key of reference.leaves) {
      if (!current.leaves.has(key)) {
        missingKeys.push(key);
      }
    }
    if (missingKeys.length > 0) {
      hasErrors = true;
      const noun = missingKeys.length === 1 ? "key" : "keys";
      process.stderr.write(`❌ ${namespace}.json (${lang}): Missing ${missingKeys.length} ${noun}\n`);
      missingKeys.sort();
      const displayCount = isVerbose ? missingKeys.length : 5;
      for (const key of missingKeys.slice(0, displayCount)) {
        process.stderr.write(`  ${key}\n`);
      }
      if (!isVerbose && missingKeys.length > displayCount) {
        process.stderr.write(`  ... and ${missingKeys.length - displayCount} more\n`);
      }
    }

    const extraKeys = [];
    for (const key of current.leaves) {
      if (!reference.leaves.has(key)) {
        extraKeys.push(key);
      }
    }
    if (extraKeys.length > 0) {
      hasErrors = true;
      const noun = extraKeys.length === 1 ? "key" : "keys";
      process.stderr.write(`❌ ${namespace}.json (${lang}): Extra ${extraKeys.length} ${noun}\n`);
      extraKeys.sort();
      const displayCount = isVerbose ? extraKeys.length : 5;
      for (const key of extraKeys.slice(0, displayCount)) {
        process.stderr.write(`  ${key}\n`);
      }
      if (!isVerbose && extraKeys.length > displayCount) {
        process.stderr.write(`  ... and ${extraKeys.length - displayCount} more\n`);
      }
    }

    // Order only when leaf sets match — mismatched keys make order noise.
    if (setsEqual(current.leaves, reference.leaves)) {
      const orderMismatch = !current.order.every((key, index) => key === reference.order[index]);
      if (orderMismatch) {
        hasErrors = true;
        process.stderr.write(`❌ ${namespace}.json (${lang}): Key order differs from ${referenceLanguage}\n`);
        if (isVerbose) {
          process.stderr.write(
            `  Expected order (${referenceLanguage}): ${reference.order.slice(0, 3).join(", ")}...\n`,
          );
          process.stderr.write(`  Actual order (${lang}): ${current.order.slice(0, 3).join(", ")}...\n`);
        }
      }
    }
  }
}

if (hasErrors) {
  process.exit(1);
}

process.stdout.write(
  `✅ All ${namespaces.length} namespaces have consistent keys and order across ${languages.length} languages!\n`,
);
