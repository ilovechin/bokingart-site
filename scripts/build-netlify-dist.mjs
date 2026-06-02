import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.join(projectRoot, ".netlify-dist");

const filesToCopy = [
  "index.html",
  "artworks.html",
  "furniture.html",
  "lighting.html",
  "custom-projects.html",
  "privacy.html",
  "terms.html",
  "styles.css",
  "script.js",
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
];

async function ensurePathExists(targetPath) {
  await mkdir(path.dirname(targetPath), { recursive: true });
}

async function copyEntry(relativePath) {
  const sourcePath = path.join(projectRoot, relativePath);
  const destinationPath = path.join(outputDir, relativePath);
  const sourceStats = await stat(sourcePath);

  if (sourceStats.isDirectory()) {
    await cp(sourcePath, destinationPath, { recursive: true, force: true });
    return;
  }

  await ensurePathExists(destinationPath);
  await cp(sourcePath, destinationPath, { force: true });
}

async function main() {
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  for (const relativePath of filesToCopy) {
    await copyEntry(relativePath);
  }

  await copyEntry("assets");

  const deployedFiles = await readdir(outputDir);
  console.log(`Prepared ${deployedFiles.length} top-level entries in ${outputDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
