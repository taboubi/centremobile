// scripts/inject-firebase-config.js
// Writes android/app/google-services.json from an Appflow environment variable at build time.
// This lets @capacitor/push-notifications (FCM) work without committing the config file.
//
// Provide the file content via ONE of these env vars:
//   GOOGLE_SERVICES_JSON_B64 : base64-encoded google-services.json (recommended for Appflow)
//   GOOGLE_SERVICES_JSON     : raw JSON content (fallback)
//
// If neither is set, the script is a no-op (local builds keep working; push stays disabled).
const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '..', 'android', 'app', 'google-services.json');
const b64 = process.env.GOOGLE_SERVICES_JSON_B64;
const raw = process.env.GOOGLE_SERVICES_JSON;

let content = null;
if (b64 && b64.trim().length) {
  content = Buffer.from(b64, 'base64').toString('utf8');
} else if (raw && raw.trim().length) {
  content = raw;
}

if (!content || !content.trim().length) {
  console.log('[inject-firebase-config] No GOOGLE_SERVICES_JSON_B64 / GOOGLE_SERVICES_JSON env var set. Skipping (push config not written).');
  process.exit(0);
}

try {
  const parsed = JSON.parse(content);
  if (!parsed.client) {
    console.warn('[inject-firebase-config] JSON parsed but has no "client" key - may not be a valid google-services.json.');
  }
} catch (e) {
  console.error('[inject-firebase-config] Provided content is NOT valid JSON: ' + e.message);
  process.exit(1);
}

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, content, 'utf8');
console.log('[inject-firebase-config] Wrote ' + target + ' (' + content.length + ' bytes).');
