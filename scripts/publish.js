// OPTIONAL: publish a finished carousel to Instagram through two Make.com webhooks (see references/publishing.md).
//   1) CAROUSEL_UPLOAD_WEBHOOK  : {secret, name, image(base64 jpeg)} -> {"url": "<public image url>"}
//   2) CAROUSEL_PUBLISH_WEBHOOK : {secret, caption, files:[{media_type:"IMAGE", image_url}]} -> {"id","permalink"}
// Usage: node publish.js <carousel folder>          -> dry run, checks everything, uploads nothing
//        node publish.js <carousel folder> --yes    -> really publishes
// Settings are read from a .env file in the current folder (or the skill folder):
//   CAROUSEL_UPLOAD_WEBHOOK=...  CAROUSEL_PUBLISH_WEBHOOK=...  CAROUSEL_SECRET=...
const fs = require('fs');
const path = require('path');

const SKILL = path.resolve(__dirname, '..');
const envFile = [path.join(process.cwd(), '.env'), path.join(SKILL, '.env')].find(f => fs.existsSync(f));
const env = { ...process.env, ...(envFile ? Object.fromEntries(fs.readFileSync(envFile, 'utf8').split(/\r?\n/)
  .filter(l => l.includes('=') && !l.trim().startsWith('#'))
  .map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])) : {}) };

const dir = path.resolve(process.argv[2] || '');
const YES = process.argv.includes('--yes');
const slidesDir = path.join(dir, 'slides');
if (!process.argv[2] || !fs.existsSync(slidesDir)) { console.error('Usage: node publish.js <carousel folder> [--yes]'); process.exit(1); }

const files = fs.readdirSync(slidesDir).filter(f => /^slide_\d+\.jpg$/.test(f))
  .sort((a, b) => parseInt(a.match(/\d+/)) - parseInt(b.match(/\d+/)));
const captionPath = path.join(dir, 'caption.txt');
const caption = fs.existsSync(captionPath) ? fs.readFileSync(captionPath, 'utf8').trim() : '';

const problems = [];
if (files.length < 2 || files.length > 10) problems.push(`${files.length} slides (need 2 to 10)`);
files.forEach(f => { if (fs.statSync(path.join(slidesDir, f)).size > 8 * 1024 * 1024) problems.push(`${f} is over 8MB`); });
if (!caption) problems.push('caption.txt is missing or empty');
if (caption.length > 2200) problems.push(`caption has ${caption.length} chars (max 2200)`);
if ((caption.match(/#/g) || []).length > 30) problems.push('more than 30 hashtags');
for (const k of ['CAROUSEL_UPLOAD_WEBHOOK', 'CAROUSEL_PUBLISH_WEBHOOK', 'CAROUSEL_SECRET']) if (!env[k]) problems.push(`.env is missing ${k}`);

console.log(`Carousel: ${dir}\nSlides: ${files.join(', ')}\nCaption (${caption.length} chars):\n${caption}\n`);
if (problems.length) { console.error('BLOCKED:\n - ' + problems.join('\n - ')); process.exit(1); }
if (!YES) { console.log('Dry run OK. Run again with --yes to publish.'); process.exit(0); }

async function post(url, body) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${text}`);
  try { return JSON.parse(text); } catch { throw new Error(`The webhook did not answer with JSON: ${text}`); }
}

(async () => {
  const stamp = path.basename(dir).replace(/[^\w-]/g, '').slice(0, 40) || 'carousel';
  const urls = [];
  for (const f of files) {
    const image = fs.readFileSync(path.join(slidesDir, f)).toString('base64');
    const r = await post(env.CAROUSEL_UPLOAD_WEBHOOK, { secret: env.CAROUSEL_SECRET, name: `${stamp}_${f.replace('.jpg', '')}_${Date.now()}`, image });
    if (!r.url) throw new Error(`Upload of ${f} returned no url: ${JSON.stringify(r)}`);
    urls.push(r.url); console.log('uploaded', f, '->', r.url);
  }
  fs.writeFileSync(path.join(dir, 'uploaded_urls.json'), JSON.stringify(urls, null, 2));
  const r = await post(env.CAROUSEL_PUBLISH_WEBHOOK, { secret: env.CAROUSEL_SECRET, caption, files: urls.map(u => ({ media_type: 'IMAGE', image_url: u })) });
  fs.writeFileSync(path.join(dir, 'published.json'), JSON.stringify({ ...r, at: new Date().toISOString() }, null, 2));
  console.log('\nPUBLISHED:', r.permalink || r.id);
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
