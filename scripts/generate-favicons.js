/**
 * Generate PNG favicons from SVG
 * Run: node scripts/generate-favicons.js
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '../src/favicon.svg');
const outDir = path.join(__dirname, '../src');

const sizes = [
  { name: 'favicon-16.png', size: 16 },
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon-192.png', size: 192 },
  { name: 'favicon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
];

async function generate() {
  const svgBuffer = fs.readFileSync(svgPath);
  
  for (const { name, size } of sizes) {
    const outPath = path.join(outDir, name);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outPath);
    console.log(`Generated ${name} (${size}x${size})`);
  }
  
  // Generate ICO (multi-size)
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(outDir, 'favicon.ico'));
  console.log('Generated favicon.ico (32x32)');
  
  console.log('\nAll favicons generated successfully!');
}

generate().catch(console.error);