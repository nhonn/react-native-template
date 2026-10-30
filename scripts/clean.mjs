// Removes generated/untracked build output. Keeps source, bun.lock and .env files.
// Usage: bun run clean
import { existsSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const targets = [
  "node_modules",
  "ios",
  "android",
  ".expo",
  "dist",
  "web-build",
  ".kotlin",
  ".metro",
  ".cache",
  ".tmp",
  ".temp",
  "coverage",
  "e2e/results",
  "tsconfig.tsbuildinfo",
  ".eslintcache",
  "babel.cache.json",
  "nitrogen/generated",
];

// Nitro modules under modules/*: codegen output and native build dirs
const modules = existsSync("modules") ? readdirSync("modules") : [];
for (const m of modules) {
  targets.push(join("modules", m, "nitrogen/generated"), join("modules", m, "android/build"));
}

for (const target of targets) {
  rmSync(target, { recursive: true, force: true });
  console.log(`removed ${target}`);
}
