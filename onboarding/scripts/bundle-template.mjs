import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = path.resolve(__dirname, '../..');
const OUTPUT_PATH = path.resolve(__dirname, '../public/template-bundle.json');

const EXCLUDE = new Set([
  'node_modules',
  '.git',
  '.next',
  'onboarding',
  'pnpm-lock.yaml',
  '.env.local',
  '.DS_Store',
]);

const BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.webp', '.avif',
  '.woff', '.woff2', '.ttf', '.eot', '.otf',
  '.pdf', '.zip', '.gz', '.tar',
  '.mp4', '.mp3', '.wav', '.webm',
]);

function isBinary(filePath) {
  return BINARY_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

async function walk(dirPath, relativeTo) {
  const files = {};
  let entries;
  try {
    entries = await fs.readdir(dirPath, { withFileTypes: true });
  } catch {
    return files;
  }

  for (const entry of entries) {
    if (EXCLUDE.has(entry.name)) continue;

    const fullPath = path.join(dirPath, entry.name);
    const relPath = path.relative(relativeTo, fullPath);

    if (entry.isDirectory()) {
      Object.assign(files, await walk(fullPath, relativeTo));
    } else if (isBinary(entry.name)) {
      const buf = await fs.readFile(fullPath);
      files[relPath] = { binary: true, data: buf.toString('base64') };
    } else {
      const content = await fs.readFile(fullPath, 'utf-8');
      files[relPath] = { binary: false, data: content };
    }
  }
  return files;
}

async function main() {
  console.log(`Bundling template from: ${TEMPLATE_DIR}`);
  const files = await walk(TEMPLATE_DIR, TEMPLATE_DIR);
  const count = Object.keys(files).length;
  const json = JSON.stringify(files);
  await fs.writeFile(OUTPUT_PATH, json, 'utf-8');
  const sizeKB = (Buffer.byteLength(json, 'utf-8') / 1024).toFixed(1);
  console.log(`Bundled ${count} files (${sizeKB} KB) -> ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error('Bundle failed:', err);
  process.exit(1);
});
