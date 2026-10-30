// Runs nitrogen in the repo root and in every modules/*/ that has a nitro.json.
// Usage: bun run codegen
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dirs = [".", ...(existsSync("modules") ? readdirSync("modules").map((d) => join("modules", d)) : [])].filter(
  (d) => existsSync(join(d, "nitro.json")),
);

if (dirs.length === 0) {
  console.log("no nitro.json found, nothing to generate");
}

for (const cwd of dirs) {
  console.log(`nitrogen: ${cwd}`);
  const { exitCode } = Bun.spawnSync(["bunx", "nitrogen"], { cwd, stdio: ["inherit", "inherit", "inherit"] });
  if (exitCode !== 0) process.exit(exitCode);
}
