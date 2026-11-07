#!/usr/bin/env node
/* Weekly repository audit, run by .github/workflows/scheduled-health.yml.
 *
 * Push-time CI proves the current commit works. This checks the slower things
 * that no push catches: an asset referenced from index.html that was renamed,
 * a service-worker shell entry that no longer exists, a sitemap that drifted
 * away from the files on disk.
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ignored = new Set(['.git', 'node_modules', '.wrangler', 'dist', 'build']);
const problems = [];
const notes = [];

function walk(dir, out = []) {
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    if (ignored.has(item.name)) continue;
    const full = join(dir, item.name);
    if (item.isDirectory()) walk(full, out);
    else if (item.isFile()) out.push(full);
  }
  return out;
}

const files = walk(ROOT);
const rel = (f) => f.slice(ROOT.length + 1);

/* 1. Every asset referenced from index.html must exist. */
const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
let refCount = 0;
for (const m of html.matchAll(/(?:href|src)\s*=\s*["']([^"']+)["']/gi)) {
  const raw = m[1].trim();
  if (!raw || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(raw)) continue;
  const clean = raw.split('#')[0].split('?')[0];
  if (!clean) continue;
  refCount += 1;
  const target = clean.startsWith('/') ? join(ROOT, clean) : join(ROOT, clean);
  if (!existsSync(target)) problems.push(`index.html → ${raw} does not exist`);
}
notes.push(`${refCount} local references from index.html`);

/* 2. The manifest and its icons. */
const manifestPath = join(ROOT, 'manifest.json');
if (!existsSync(manifestPath)) {
  problems.push('manifest.json is missing');
} else {
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch (err) {
    problems.push(`manifest.json is not valid JSON: ${err.message}`);
  }
  if (manifest) {
    const icons = manifest.icons || [];
    if (icons.length === 0) problems.push('manifest.json declares no icons');
    for (const icon of icons) {
      if (!existsSync(join(ROOT, icon.src))) problems.push(`manifest icon missing: ${icon.src}`);
    }
    notes.push(`${icons.length} manifest icons`);
  }
}

/* 3. Every file the service worker precaches must exist. */
const swPath = join(ROOT, 'sw.js');
if (!existsSync(swPath)) {
  problems.push('sw.js is missing');
} else {
  const sw = readFileSync(swPath, 'utf8');
  const shell = [...sw.matchAll(/["'](\/[^"'\s]+\.(?:js|css|json|html|png|svg|woff2?))["']/g)].map((m) => m[1]);
  const unique = [...new Set(shell)];
  for (const path of unique) {
    if (!existsSync(join(ROOT, path))) problems.push(`service worker precaches a missing file: ${path}`);
  }
  notes.push(`${unique.length} precached shell entries`);
}

/* 4. sitemap.xml and robots.txt must still describe the site. */
for (const required of ['sitemap.xml', 'robots.txt', 'llms.txt']) {
  if (!existsSync(join(ROOT, required))) problems.push(`${required} is missing`);
}
const sitemapPath = join(ROOT, 'sitemap.xml');
if (existsSync(sitemapPath)) {
  const sitemap = readFileSync(sitemapPath, 'utf8');
  const locs = [...sitemap.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  if (locs.length === 0) problems.push('sitemap.xml lists no URLs');
  notes.push(`${locs.length} URLs in sitemap.xml`);
}

/* 5. Fonts: the editor promises a self-hosted set, so an empty file is a bug. */
const fontDir = join(ROOT, 'fonts');
if (!existsSync(fontDir)) {
  problems.push('fonts/ is missing');
} else {
  const fonts = readdirSync(fontDir).filter((f) => f.endsWith('.woff2'));
  for (const font of fonts) {
    if (statSync(join(fontDir, font)).size === 0) problems.push(`empty font file: fonts/${font}`);
  }
  notes.push(`${fonts.length} woff2 fonts`);
}

/* 6. Nothing that looks like a committed secret. */
const secretPatterns = [
  [/AIza[0-9A-Za-z_-]{35}/, 'Google API key'],
  [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, 'private key'],
  [/\bsk-[A-Za-z0-9]{32,}\b/, 'OpenAI-style secret key'],
];
for (const file of files) {
  if (/\.(png|jpg|jpeg|webp|gif|ico|woff2?|ttf|otf|zip|gz)$/i.test(file)) continue;
  const text = readFileSync(file, 'utf8');
  for (const [pattern, label] of secretPatterns) {
    if (pattern.test(text)) problems.push(`${rel(file)} looks like it contains a ${label}`);
  }
}

console.log(notes.join('\n'));
if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error(` - ${p}`);
  process.exit(1);
}
console.log('weekly audit: clean');
