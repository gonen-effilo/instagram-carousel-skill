// Export every slide of a carousel HTML to 1080x1350 PNG (archive) + JPEG (Instagram).
// Usage: node export.js <path/to/carousel.html> [outDir]
// One-time setup in the skill folder:  npm install  &&  npx playwright install chromium
const path = require('path');
const fs = require('fs');
const SKILL = path.resolve(__dirname, '..');
let chromium;
try { ({ chromium } = require(require.resolve('playwright', { paths: [SKILL, process.cwd()] }))); }
catch { console.error(`Playwright is missing. Run once:\n  cd "${SKILL}"\n  npm install\n  npx playwright install chromium`); process.exit(1); }

const INPUT = path.resolve(process.argv[2] || '');
if (!process.argv[2] || !fs.existsSync(INPUT)) { console.error('Usage: node export.js <carousel.html> [outDir]'); process.exit(1); }
const OUTDIR = path.resolve(process.argv[3] || path.join(path.dirname(INPUT), 'slides'));
fs.mkdirSync(OUTDIR, { recursive: true });

const VIEW_W = 420, VIEW_H = 525, SCALE = 1080 / 420;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: VIEW_W, height: VIEW_H }, deviceScaleFactor: SCALE });
  await page.goto('file:///' + INPUT.replace(/\\/g, '/'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);

  const total = await page.evaluate(() => document.querySelectorAll('.carousel-track > .slide').length);
  if (total < 2 || total > 10) console.warn(`WARNING: ${total} slides. Instagram accepts 2 to 10.`);

  await page.evaluate(() => {
    document.querySelectorAll('.ig-header,.ig-dots,.ig-caption').forEach(el => el.style.display = 'none');
    document.querySelector('.ig-frame').style.cssText = 'width:420px;height:525px;border-radius:0;box-shadow:none;border:0;overflow:hidden;margin:0;';
    document.querySelector('.carousel-viewport').style.cssText = 'width:420px;height:525px;overflow:hidden;position:relative;direction:ltr;';
    document.body.style.cssText = 'padding:0;margin:0;display:block;overflow:hidden;background:#000;';
  });

  // Overflow report: text that sticks out of its slide
  const overflow = await page.evaluate(() => [...document.querySelectorAll('.carousel-track > .slide')].map((s, i) => {
    const r = s.getBoundingClientRect(); let worst = 0;
    s.querySelectorAll('h2,p,span,div').forEach(el => {
      const b = el.getBoundingClientRect(); if (!b.width || !el.textContent.trim()) return;
      const over = Math.max(r.top - b.top, b.bottom - r.bottom, 0);
      if (over > worst && getComputedStyle(el).position !== 'absolute') worst = over;
    });
    return { slide: i + 1, overflowPx: Math.round(worst) };
  }).filter(o => o.overflowPx > 0));
  if (overflow.length) console.warn('OVERFLOW:', JSON.stringify(overflow));

  for (let i = 0; i < total; i++) {
    await page.evaluate(idx => { const t = document.querySelector('.carousel-track'); t.style.transition = 'none'; t.style.transform = `translateX(${-idx * 420}px)`; }, i);
    await page.waitForTimeout(250);
    const clip = { x: 0, y: 0, width: VIEW_W, height: VIEW_H };
    await page.screenshot({ path: path.join(OUTDIR, `slide_${i + 1}.png`), clip });
    const jpg = path.join(OUTDIR, `slide_${i + 1}.jpg`);
    await page.screenshot({ path: jpg, clip, type: 'jpeg', quality: 92 });
    console.log(`slide ${i + 1}/${total}  ${(fs.statSync(jpg).size / 1024).toFixed(0)}KB jpg`);
  }
  await browser.close();
  console.log('Done ->', OUTDIR);
})().catch(e => { console.error(e); process.exit(1); });
