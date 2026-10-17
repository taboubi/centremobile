// scripts/inject-firebase-config.js
// Writes android/app/google-services.json from an Appflow environment variable at build time.
// This lets @capacitor/push-notifications (FCM) work without committing the config file.
//
// Provide the file content via EITHER env var (format is auto-detected):
//   GOOGLE_SERVICES_JSON_B64 : base64-encoded google-services.json (recommended)
//   GOOGLE_SERVICES_JSON     : raw JSON content
// The value is accepted as raw JSON or base64 regardless of which var name is used
// (base64 is decoded only if the text is not already JSON).
//
// If neither var is set, the script is a no-op (local builds keep working; push stays disabled).
const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '..', 'android', 'app', 'google-services.json');
const value = (process.env.GOOGLE_SERVICES_JSON_B64 || process.env.GOOGLE_SERVICES_JSON || '').trim();

if (!value) {
  console.log('[inject-firebase-config] No GOOGLE_SERVICES_JSON_B64 / GOOGLE_SERVICES_JSON env var set. Skipping (push config not written).');
  process.exit(0);
}

// Strip UTF-8 BOM if present.
const cleaned = value.replace(/^\uFEFF/, '');

function looksLikeJson(s) {
  const t = s.trimStart();
  return t.startsWith('{') || t.startsWith('[');
}

function tryBase64Decode(s) {
  // Remove whitespace/newlines, then decode. Node ignores invalid chars by default.
  const compact = s.replace(/\s+/g, '');
  const decoded = Buffer.from(compact, 'base64').toString('utf8');
  return decoded;
}

let content = null;
if (looksLikeJson(cleaned)) {
  // Already raw JSON.
  content = cleaned;
} else {
  // Assume base64 and decode, then re-check (base64 of JSON starts with 'eyJ').
  const decoded = tryBase64Decode(cleaned);
  if (looksLikeJson(decoded)) {
    content = decoded;
  } else {
    // Last resort: maybe it was raw but with leading junk; keep decoded for error message.
    content = decoded;
  }
}

try {
  const parsed = JSON.parse(content);
  if (!parsed.client) {
    console.warn('[inject-firebase-config] JSON parsed but has no "client" key - may not be a valid google-services.json.');
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, 'utf8');
  console.log('[inject-firebase-config] Wrote ' + target + ' (' + content.length + ' bytes).');
} catch (e) {
  console.error('[inject-firebase-config] Could not resolve a valid google-services.json from the env var.');
  console.error('[inject-firebase-config] Detected as raw-JSON=' + looksLikeJson(cleaned) + ', length=' + cleaned.length + '. Parse error: ' + e.message);
  console.error('[inject-firebase-config] Fix: set GOOGLE_SERVICES_JSON_B64 to `base64 -w0 google-services.json`, or GOOGLE_SERVICES_JSON to the raw JSON.');
  process.exit(1);
}
