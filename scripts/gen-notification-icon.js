// scripts/gen-notification-icon.js
// Generates a monochrome (white silhouette) Android status-bar notification icon
// from the brand logo (assets/icon.png) and points the FCM default_notification_icon
// meta-data to it. Re-run any time the brand logo changes.
//   usage: node scripts/gen-notification-icon.js
//
// Note: assets/icon.png is a magenta logo on an OPAQUE white background (no alpha),
// so the silhouette is derived by treating non-white pixels as the glyph:
//   alpha = 255 - luminance(pixel); RGB forced to white.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..');
const src = path.join(root, 'assets', 'icon.png');
const resDir = path.join(root, 'android', 'app', 'src', 'main', 'res');
const manifest = path.join(root, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');

// Standard Android small-icon sizes (density -> px)
const densities = { mdpi: 24, hdpi: 36, xhdpi: 48, xxhdpi: 72, xxxhdpi: 96 };

(async () => {
  const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    let a = 255 - lum;
    a = a < 0 ? 0 : a > 255 ? 255 : Math.round(a);
    out[j] = 255; out[j + 1] = 255; out[j + 2] = 255; out[j + 3] = a; // white glyph
  }
  const white = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer();

  for (const [dir, px] of Object.entries(densities)) {
    const outDir = path.join(resDir, `drawable-${dir}`);
    fs.mkdirSync(outDir, { recursive: true });
    await sharp(white)
      .trim()
      .resize(px, px, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(outDir, 'ic_notification.png'));
    console.log(`wrote drawable-${dir}/ic_notification.png (${px}px)`);
  }

  // Point the FCM default_notification_icon to the new drawable.
  let m = fs.readFileSync(manifest, 'utf8');
  const re = /(default_notification_icon"\s*\n\s*android:resource=")[^"]*(")/;
  if (re.test(m)) {
    m = m.replace(re, '$1@drawable/ic_notification$2');
    fs.writeFileSync(manifest, m);
    console.log('manifest: default_notification_icon -> @drawable/ic_notification');
  } else if (m.includes('@drawable/ic_notification')) {
    console.log('manifest already references @drawable/ic_notification.');
  } else {
    console.error('WARNING: default_notification_icon meta-data not found in manifest.');
  }
})().catch((e) => { console.error('FAILED: ' + e.message); process.exit(1); });
