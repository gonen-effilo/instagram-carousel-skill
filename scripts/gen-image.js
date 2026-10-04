// OPTIONAL and PAID: generate one illustration for a slide with OpenAI images.
// If assets/me/ has 1-2 photos of you, they are sent as identity references (a 3D/illustrated "you").
// Usage: node gen-image.js <out.png> "<scene in English>" [--text top|bottom|none] [--quality low|medium|high]
// Needs OPENAI_API_KEY in a .env file in the current folder (or the skill folder). Costs money per image.
const fs = require('fs');
const path = require('path');

const SKILL = path.resolve(__dirname, '..');
const BRAND = JSON.parse(fs.readFileSync(path.join(SKILL, 'brand.json'), 'utf8'));
const envFile = [path.join(process.cwd(), '.env'), path.join(SKILL, '.env')].find(f => fs.existsSync(f));
const env = { ...process.env, ...(envFile ? Object.fromEntries(fs.readFileSync(envFile, 'utf8').split(/\r?\n/)
  .filter(l => l.includes('=') && !l.trim().startsWith('#'))
  .map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])) : {}) };

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args.splice(i, 2)[1] : d; };
const TEXT_ZONE = flag('text', 'top');
const QUALITY = flag('quality', 'medium');
const [outArg, sceneText] = args;
if (!outArg || !sceneText) { console.error('Usage: node gen-image.js <out.png> "<scene>" [--text top|bottom|none] [--quality medium]'); process.exit(1); }
if (!env.OPENAI_API_KEY) { console.error('Missing OPENAI_API_KEY in .env'); process.exit(1); }

const meDir = path.join(SKILL, 'assets', 'me');
const refs = fs.existsSync(meDir) ? fs.readdirSync(meDir).filter(f => /\.(png|jpe?g|webp)$/i.test(f)).slice(0, 2).map(f => path.join(meDir, f)) : [];
const style = (BRAND.image_style || 'high-quality 3D animated film render (Pixar-like), soft cinematic lighting');
const dark = (BRAND.theme || 'dark') === 'dark';
const prompt = (refs.length ? `Use the reference photos ONLY for the person's identity (face, hair, beard, skin tone). Create a completely new image as a stylized character of this person. ` : '') +
  `Scene: ${sceneText}. Style: ${style}. Single main character. No text, no letters, no logos, no watermarks.` +
  ` Palette: ${dark ? 'dark, moody background' : 'light, clean background'} with accents in ${BRAND.colors?.accent || '#3B9EFF'} and ${BRAND.colors?.accent2 || '#8B5CF6'}.` +
  (TEXT_ZONE === 'top' ? ' Composition: subject in the LOWER 60% of the frame; the upper 40% is calm empty background for a headline.'
    : TEXT_ZONE === 'bottom' ? ' Composition: subject in the UPPER 60%; the lower 40% is calm empty background for text.' : '');

(async () => {
  const model = env.OPENAI_IMAGE_MODEL || 'gpt-image-1';
  let res;
  if (refs.length) {
    const fd = new FormData();
    fd.append('model', model); fd.append('prompt', prompt); fd.append('size', '1024x1536'); fd.append('quality', QUALITY); fd.append('n', '1');
    for (const r of refs) fd.append('image[]', new Blob([fs.readFileSync(r)], { type: /\.png$/i.test(r) ? 'image/png' : 'image/jpeg' }), path.basename(r));
    res = await fetch('https://api.openai.com/v1/images/edits', { method: 'POST', headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}` }, body: fd });
  } else {
    res = await fetch('https://api.openai.com/v1/images/generations', { method: 'POST',
      headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, size: '1024x1536', quality: QUALITY, n: 1 }) });
  }
  const json = await res.json();
  if (!res.ok) { console.error('OpenAI error:', res.status, JSON.stringify(json.error || json)); process.exit(1); }
  const out = path.resolve(outArg);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.from(json.data[0].b64_json, 'base64'));
  fs.appendFileSync(path.join(SKILL, 'generation-log.csv'), `${new Date().toISOString()},${model},${QUALITY},${out}\n`);
  console.log('Saved', out);
})().catch(e => { console.error(e); process.exit(1); });
