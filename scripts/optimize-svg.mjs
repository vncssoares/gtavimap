import fs from 'node:fs';
import path from 'node:path';

function optimizeSvg(svg) {
  // Strip comments
  let s = svg.replace(/<!--[\s\S]*?-->/g, '');
  // Collapse whitespace between tags
  s = s.replace(/>\s+</g, '><');
  // Optimize path d attributes
  s = s.replace(/\bd="([^"]+)"/g, (_, d) => {
    let optD = d.replace(/\s+/g, ' ')
      .replace(/\s*([MLCHVZSQTAmlchvzsqta,])\s*/g, '$1')
      .replace(/, /g, ',')
      .replace(/ ,/g, ',')
      .trim();
    // Reduce floating point numbers to max 1 decimal
    optD = optD.replace(/(\d+\.\d{2,})/g, (m) => Number(m).toFixed(1).replace(/\.0$/, ''));
    return `d="${optD}"`;
  });
  return s.trim();
}

const mapDir = path.resolve('public', 'map');

const files = [
  { src: 'leonida-vibrant-map.svg', versioned: 'leonida-vibrant-map.v1.svg' },
  { src: 'leonida-demo-map.svg', versioned: 'leonida-demo-map.v1.svg' },
];

for (const { src, versioned } of files) {
  const srcPath = path.join(mapDir, src);
  if (!fs.existsSync(srcPath)) continue;
  const original = fs.readFileSync(srcPath, 'utf8');
  const optimized = optimizeSvg(original);

  // Write optimized versioned file
  const versionedPath = path.join(mapDir, versioned);
  fs.writeFileSync(versionedPath, optimized, 'utf8');

  // Also update unversioned file with optimized content for backward compatibility
  fs.writeFileSync(srcPath, optimized, 'utf8');

  const reduction = Math.round((1 - optimized.length / original.length) * 100);
  console.log(`✓ ${src} (${original.length} B) -> ${versioned} (${optimized.length} B) [${reduction}% menor]`);
}
