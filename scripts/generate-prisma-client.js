// Monkey-patch to fix Prisma + pnpm compatibility issue
const path = require("path");
const fs = require("fs");

// Find the generator-build index
const pnpmDir = path.join(__dirname, "..", "node_modules", ".pnpm");
const clientDir = fs.readdirSync(pnpmDir).find((d) => d.startsWith("@prisma+client@"));
const genBuildPath = path.join(pnpmDir, clientDir, "node_modules", "@prisma", "client", "generator-build", "index.js");

// Read, patch, and eval the modified source
let source = fs.readFileSync(genBuildPath, "utf8");

// Replace the problematic findPrismaClientDir to always resolve
source = source.replace(
  `async function findPrismaClientDir(baseDir) {`,
  `async function findPrismaClientDir(baseDir) {
  const resolveOpts2 = { basedir: baseDir, preserveSymlinks: true };
  const clientDir2 = await resolvePkg("@prisma/client", resolveOpts2);
  if (clientDir2) return clientDir2;`
);

const Module = require("module");
const originalRequire = Module.prototype.require;

// Override require to inject our patched module
const patchedModule = { exports: {} };
const patchedId = path.join(pnpmDir, clientDir, "node_modules", "@prisma", "client", "generator-build", "patched.js");

// Write patched version
fs.writeFileSync(patchedId, source);

// Use the patched version
delete require.cache[genBuildPath];
const patched = require(patchedId);

// Now run prisma generate with patched module
const prismaBuildPath = path.join(
  pnpmDir,
  fs.readdirSync(pnpmDir).find((d) => d.startsWith("prisma@6.19.3")),
  "node_modules",
  "prisma",
  "build",
  "index.js"
);

// Set up environment
process.env.PRISMA_GENERATE_SKIP_AUTOINSTALL = "true";
process.env.PRISMA_SKIP_POSTINSTALL_GENERATE = "true";

// Run prisma generate
const { execSync } = require("child_process");
const result = execSync(
  `node "${prismaBuildPath}" generate --schema="${path.join(__dirname, "..", "prisma", "schema.prisma")}"`,
  {
    cwd: path.join(__dirname, "..", "packages", "database"),
    encoding: "utf8",
    env: { ...process.env },
    stdio: "inherit",
  }
);

console.log("Prisma client generated successfully!");
