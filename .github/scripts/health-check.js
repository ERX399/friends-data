#!/usr/bin/env node
/**
 * Daily friend-link health check.
 *
 * Scans data/friends/*.json, checks each `url` reachability via the
 * shared Playwright checker (check-url.js), and updates each entry's
 * optional `status` field:
 *   - unreachable -> status: "down"
 *   - reachable   -> remove status
 *
 * Exits 0 always (the workflow commits any file changes afterward).
 * Usage: node .github/scripts/health-check.js
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.join(ROOT, 'data', 'friends');
const CHECK_SCRIPT = path.join(__dirname, 'check-url.js');
const TIMEOUT_MS = 120000;
const MAX_BUFFER = 10 * 1024 * 1024;

function checkUrl(url) {
  try {
    const out = execFileSync('node', [CHECK_SCRIPT, url], {
      encoding: 'utf8',
      timeout: TIMEOUT_MS,
      maxBuffer: MAX_BUFFER,
    }).trim();
    if (!out) return false;
    return !!JSON.parse(out).ok;
  } catch (e) {
    return false;
  }
}

function main() {
  if (!fs.existsSync(DATA_DIR)) {
    console.log('data/friends not found');
    return;
  }
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'));
  let changed = false;

  for (const f of files) {
    const filePath = path.join(DATA_DIR, f);
    let data;
    try {
      data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      console.log(`⚠️  ${f}: parse error, skip`);
      continue;
    }
    if (!data.url) {
      console.log(`⚠️  ${f}: no url, skip`);
      continue;
    }

    const ok = checkUrl(data.url);
    if (!ok) {
      if (data.status !== 'down') {
        data.status = 'down';
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        changed = true;
        console.log(`🔴 ${f}: DOWN -> ${data.url}`);
      } else {
        console.log(`🔴 ${f}: still down`);
      }
    } else {
      if (data.status === 'down') {
        delete data.status;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        changed = true;
        console.log(`🟢 ${f}: recovered`);
      } else {
        console.log(`🟢 ${f}: ok`);
      }
    }
  }

  console.log(changed ? 'CHANGED=true' : 'CHANGED=false');
}

main();
