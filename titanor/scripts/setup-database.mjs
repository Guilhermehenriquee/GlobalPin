import { spawnSync } from "node:child_process";

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL?.trim());
const isWindows = process.platform === "win32";
const npm = isWindows ? "npm.cmd" : "npm";

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: process.env,
    shell: isWindows,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (!hasDatabaseUrl) {
  console.log("DATABASE_URL nao configurada. Pulando migrations e seed do Prisma.");
  process.exit(0);
}

run(npm, ["run", "db:deploy"]);
run(npm, ["run", "db:seed"]);
