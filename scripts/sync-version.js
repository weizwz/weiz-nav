const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const jsonFiles = [
  'apps/web/package.json',
  'apps/extension/package.json',
  'packages/core/package.json',
  'packages/services/package.json',
  'packages/store/package.json',
  'apps/extension/public/manifest.json',
  'packages/core/src/data.json',
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function syncJsonVersions(version) {
  for (const relativePath of jsonFiles) {
    const filePath = path.join(rootDir, relativePath);

    if (!fs.existsSync(filePath)) {
      console.warn(`Skipping missing file: ${relativePath}`);
      continue;
    }

    const json = readJson(filePath);
    json.version = version;
    writeJson(filePath, json);
    console.log(`Updated ${relativePath} -> ${version}`);
  }
}

function syncServiceWorker(version) {
  const templatePath = path.join(rootDir, 'apps/web/scripts/sw-template.js');
  const serviceWorkerPath = path.join(rootDir, 'apps/web/public/sw.js');

  if (!fs.existsSync(templatePath)) {
    console.warn('Skipping service worker: apps/web/scripts/sw-template.js not found');
    return;
  }

  const cacheVersion = `v${version.replace(/\./g, '_')}`;
  const content = fs.readFileSync(templatePath, 'utf8').replace(/{{VERSION}}/g, cacheVersion);

  fs.writeFileSync(serviceWorkerPath, content);
  console.log(`Generated apps/web/public/sw.js -> ${cacheVersion}`);
}

function main() {
  const rootPackagePath = path.join(rootDir, 'package.json');
  const rootPackage = readJson(rootPackagePath);
  const { version } = rootPackage;

  if (!version) {
    throw new Error('Root package.json is missing a version field');
  }

  syncJsonVersions(version);
  syncServiceWorker(version);
}

try {
  main();
} catch (error) {
  console.error('Failed to sync versions:', error);
  process.exit(1);
}
