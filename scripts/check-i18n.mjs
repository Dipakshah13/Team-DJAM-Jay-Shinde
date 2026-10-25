import en from '../lib/i18n/en.js';
import mr from '../lib/i18n/mr.js';
import hi from '../lib/i18n/hi.js';
import fs from 'fs';
import path from 'path';

let hasError = false;

// 1. Key Parity Check
const enKeys = new Set(Object.keys(en));
const mrKeys = new Set(Object.keys(mr));
const hiKeys = new Set(Object.keys(hi));

console.log(`Checking i18n key counts: EN=${enKeys.size}, MR=${mrKeys.size}, HI=${hiKeys.size}`);

for (const key of enKeys) {
  if (!mrKeys.has(key)) {
    console.error(`❌ Key missing in mr.js: "${key}"`);
    hasError = true;
  }
  if (!hiKeys.has(key)) {
    console.error(`❌ Key missing in hi.js: "${key}"`);
    hasError = true;
  }
}

for (const key of mrKeys) {
  if (!enKeys.has(key)) {
    console.error(`❌ Key present in mr.js but missing in en.js: "${key}"`);
    hasError = true;
  }
}

for (const key of hiKeys) {
  if (!enKeys.has(key)) {
    console.error(`❌ Key present in hi.js but missing in en.js: "${key}"`);
    hasError = true;
  }
}

// 2. Scan code for t('key') or t("key") usages
function scanDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        scanDir(fullPath, fileList);
      }
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const sourceFiles = [
  ...scanDir(path.resolve('./app')),
  ...scanDir(path.resolve('./components')),
];

const tKeyRegex = /\bt\(\s*['"]([a-zA-Z0-9_.-]+)['"]\s*[,)]/g;
const missingInEn = new Set();

for (const filePath of sourceFiles) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let match;
  while ((match = tKeyRegex.exec(content)) !== null) {
    const key = match[1];
    if (!enKeys.has(key)) {
      missingInEn.add(`${key} (in ${path.relative('.', filePath)})`);
    }
  }
}

if (missingInEn.size > 0) {
  for (const item of missingInEn) {
    console.error(`❌ t('key') used in code is missing from en.js: ${item}`);
  }
  hasError = true;
}

if (hasError) {
  console.error('\n💥 i18n check failed!');
  process.exit(1);
} else {
  console.log('✅ i18n parity check passed perfectly! 100% parity across EN, MR, and HI.');
  process.exit(0);
}
