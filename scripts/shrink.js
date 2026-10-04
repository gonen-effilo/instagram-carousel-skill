// Shrink a photo before embedding it in a carousel (keeps carousel.html small).
// Usage: node shrink.js <in.jpg|png> <out.jpg> [width=900]
const path = require('path');
const SKILL = path.resolve(__dirname, '..');
const sharp = require(require.resolve('sharp', { paths: [SKILL, process.cwd()] }));
const [inp, out, w = '900'] = process.argv.slice(2);
if (!inp || !out) { console.error('Usage: node shrink.js <in> <out.jpg> [width]'); process.exit(1); }
sharp(inp).rotate().resize({ width: +w, withoutEnlargement: true }).jpeg({ quality: 84 }).toFile(out)
  .then(i => console.log(`Saved ${out} ${i.width}x${i.height} ${(i.size / 1024).toFixed(0)}KB`))
  .catch(e => { console.error(e.message); process.exit(1); });
