const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

const root = path.resolve(__dirname, "..");

// Monkey-patch the @prisma/client generator-build
const pnpmDir = path.join(root, "node_modules", ".pnpm");
const cliDir = fs.readdirSync(pnpmDir).find((d) => d.startsWith("prisma@6.19.3"));
const clientDir = fs.readdirSync(pnpmDir).find((d) => d.startsWith("@prisma+client@"));
const genBuildPath = path.join(pnpmDir, clientDir, "node_modules", "@prisma", "client", "generator-build", "index.js");

let source = fs.readFileSync(genBuildPath, "utf8");

// Patch findPrismaClientDir to not do the sibling check
source = source.replace(
  `const resolvedClientDir = clientDir && await import_promises6.default.realpath(clientDir);`,
  `const resolvedClientDir = clientDir && await import_promises6.default.realpath(clientDir);
  if (cliDir === void 0) return resolvedClientDir;
  if (clientDir === void 0) return resolvedClientDir;
  return resolvedClientDir;`
);

// And remove the old check
source = source.replace(
  `  debug3("prismaClientDir", clientDir);
  if (cliDir === void 0) return resolvedClientDir;
  if (clientDir === void 0) return resolvedClientDir;
  const relDir = import_node_path5.default.relative(cliDir, clientDir).split(import_node_path5.default.sep);
  if (relDir[0] !== ".." || relDir[1] === "..") return void 0;
  return resolvedClientDir;`,
  `  debug3("prismaClientDir", clientDir);
  return resolvedClientDir;`
);

// Write patched file
fs.writeFileSync(genBuildPath + ".bak", fs.readFileSync(genBuildPath));

// Temporarily replace the file
const backup = fs.readFileSync(genBuildPath, "utf8");
fs.writeFileSync(genBuildPath, source);

try {
  const prismaCli = path.join(pnpmDir, cliDir, "node_modules", "prisma", "build", "index.js");
  execSync(`node "${prismaCli}" generate --schema="${path.join(root, "prisma", "schema.prisma")}"`, {
    cwd: path.join(root, "packages", "database"),
    encoding: "utf8",
    stdio: "inherit",
    env: { ...process.env, PRISMA_GENERATE_SKIP_AUTOINSTALL: "true" },
  });
  console.log("Prisma client generated successfully!");
} finally {
  // Restore the original file
  fs.writeFileSync(genBuildPath, backup);
  try { fs.unlinkSync(genBuildPath + ".bak"); } catch {}
}
