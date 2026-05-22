import fs from 'node:fs/promises';
import path from 'node:path';

export async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

export async function writeFile(filePath, content) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, 'utf-8');
}

export async function copyDir(src, dest) {
  await ensureDir(dest);
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

export async function exists(filePath) {
  try { await fs.access(filePath); return true; } catch { return false; }
}

export function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function escapeAttr(str) {
  return escapeHtml(str);
}

export function jsonScript(obj) {
  return JSON.stringify(obj, null, 2)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

export function readConfigCredentials(configPath) {
  // Parses js/config.js to extract SUPABASE_URL + SUPABASE_ANON_KEY at build time.
  return fs.readFile(configPath, 'utf-8').then(src => {
    const url = src.match(/SUPABASE_URL:\s*['"]([^'"]+)['"]/)?.[1];
    const key = src.match(/SUPABASE_ANON_KEY:\s*['"]([^'"]+)['"]/)?.[1];
    if (!url || !key) throw new Error(`Could not parse Supabase credentials from ${configPath}`);
    return { url, key };
  });
}

export function pluralize(n, singular, plural, plural5) {
  // CG/SR pluralization: 1 / 2-4 / 5+
  // Example: pluralize(3, 'salon', 'salona', 'salona') → 'salona'
  const last = Math.abs(n) % 100;
  const lastDigit = last % 10;
  if (last >= 11 && last <= 14) return plural5;
  if (lastDigit === 1) return singular;
  if (lastDigit >= 2 && lastDigit <= 4) return plural;
  return plural5;
}
