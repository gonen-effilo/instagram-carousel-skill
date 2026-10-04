// Carousel design kit. Every visual decision lives here; a carousel's generate.js only composes helpers.
// Colors, fonts, handle and logo come from ../brand.json, so the same kit fits any brand.
// Usage in generate.js (inside the carousel folder):
//   const K = require('<skill>/scripts/kit.js');
//   const S = []; S.push(K.slide(0, TOTAL, K.column(K.h1('...'))));  K.write(__dirname, S, { caption })
const fs = require('fs');
const path = require('path');

const SKILL = path.resolve(__dirname, '..');
const BRAND = JSON.parse(fs.readFileSync(path.join(SKILL, 'brand.json'), 'utf8'));
const C = BRAND.colors || {};
const DARK = (BRAND.theme || 'dark') === 'dark';

// ---------- tokens ----------
const T = {
  base: C.background || (DARK ? '#0B0B12' : '#F7F5F0'),
  ink: C.text || (DARK ? '#F2F2F7' : '#15151C'),
  muted: C.muted || (DARK ? '#A3A3B5' : '#5C5C6B'),
  a1: C.accent || '#3B9EFF',
  a2: C.accent2 || C.accent || '#8B5CF6',
  warn: C.warning || '#F5A742',
  HEAD: `'${(BRAND.fonts || {}).heading || 'Heebo'}', sans-serif`,
  BODY: `'${(BRAND.fonts || {}).body || 'Rubik'}', sans-serif`,
  HANDLE: BRAND.handle || 'yourhandle',
  DIR: BRAND.direction || 'rtl',
};
T.grad = `linear-gradient(100deg, ${T.a1} 0%, ${T.a2} 100%)`;
const hexA = (hex, a) => { const h = hex.replace('#', ''); const n = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h, 16);
  return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };

// ---------- images (always embedded as base64 so the HTML is one portable file) ----------
const cache = {};
function dataUri(file) {
  const f = path.isAbsolute(file) ? file : fs.existsSync(path.resolve(file)) ? path.resolve(file) : path.join(SKILL, file);
  if (cache[f]) return cache[f];
  const mime = /\.jpe?g$/i.test(f) ? 'image/jpeg' : /\.webp$/i.test(f) ? 'image/webp' : /\.svg$/i.test(f) ? 'image/svg+xml' : 'image/png';
  return (cache[f] = `data:${mime};base64,` + fs.readFileSync(f).toString('base64'));
}
const has = rel => rel && fs.existsSync(path.isAbsolute(rel) ? rel : path.join(SKILL, rel));

// ---------- building blocks ----------
function bg(variant = 'glow') {
  const glows = {
    glow: `radial-gradient(60% 45% at 78% 15%, ${hexA(T.a2, DARK ? 0.32 : 0.16)}, transparent 70%),
           radial-gradient(55% 40% at 15% 88%, ${hexA(T.a1, DARK ? 0.22 : 0.12)}, transparent 70%)`,
    warm: `radial-gradient(55% 40% at 50% 70%, ${hexA(T.warn, DARK ? 0.22 : 0.14)}, transparent 70%),
           radial-gradient(60% 45% at 80% 15%, ${hexA(T.a2, DARK ? 0.25 : 0.12)}, transparent 70%)`,
    plain: `radial-gradient(70% 50% at 50% 0%, ${hexA(T.a2, DARK ? 0.16 : 0.08)}, transparent 70%)`,
  }[variant];
  const grid = DARK ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.035)';
  return `<div style="position:absolute;inset:0;background:${glows};z-index:1;"></div>
  <div style="position:absolute;inset:0;background-image:linear-gradient(${grid} 1px,transparent 1px),linear-gradient(90deg,${grid} 1px,transparent 1px);background-size:28px 28px;z-index:1;"></div>`;
}

const gradText = t => `<span style="background:${T.grad};-webkit-background-clip:text;background-clip:text;color:transparent;">${t}</span>`;
const underline = t => `<span style="position:relative;display:inline-block;white-space:nowrap;">${t}<span style="position:absolute;left:-2px;right:-2px;bottom:-3px;height:3px;border-radius:3px;background:${T.grad};"></span></span>`;

const h1 = (html, size = 30, align = 'center') =>
  `<h2 style="font-family:${T.HEAD};font-weight:800;font-size:${size}px;letter-spacing:-0.6px;line-height:1.14;color:${T.ink};text-align:${align};">${html}</h2>`;
const body = (html, size = 15.5, align = 'center', color = T.muted) =>
  `<p style="font-family:${T.BODY};font-weight:400;font-size:${size}px;line-height:1.6;color:${color};text-align:${align};">${html}</p>`;
// A short line that makes people swipe ("ואז הוא אמר משהו ששינה הכל."). Use 2-3 per carousel, max.
const cliff = t => `<p style="font-family:${T.HEAD};font-weight:700;font-size:17px;line-height:1.35;text-align:center;">${gradText(t)}</p>`;

const card = (inner, pad = '16px 18px') =>
  `<div style="border-radius:18px;padding:${pad};background:linear-gradient(180deg, ${hexA(T.a2, 0.13)}, ${hexA(T.a1, 0.05)});border:1px solid ${hexA(T.a2, 0.35)};">${inner}</div>`;

// List rows: kind = 'minus' (problem) | 'check' (good) | a number string ('01')
function row(kind, text, sub) {
  let icon;
  if (kind === 'minus') icon = `<span style="flex:0 0 20px;height:20px;border-radius:50%;background:${hexA(T.warn, 0.16)};border:1px solid ${hexA(T.warn, 0.45)};display:flex;align-items:center;justify-content:center;"><span style="width:8px;height:2px;border-radius:2px;background:${T.warn};"></span></span>`;
  else if (kind === 'check') icon = `<span style="flex:0 0 20px;height:20px;border-radius:50%;background:${T.grad};display:flex;align-items:center;justify-content:center;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
  else icon = `<span style="flex:0 0 30px;font-family:${T.HEAD};font-weight:800;font-size:17px;line-height:1.25;">${gradText(kind)}</span>`;
  return `<div style="display:flex;align-items:flex-start;gap:11px;padding:7px 0;">${icon}<div style="flex:1;">
    <div style="font-family:${T.BODY};font-weight:500;font-size:14.5px;line-height:1.45;color:${T.ink};">${text}</div>
    ${sub ? `<div style="font-family:${T.BODY};font-size:12.5px;line-height:1.45;color:${T.muted};margin-top:2px;">${sub}</div>` : ''}</div></div>`;
}

const callout = html => `<div style="position:relative;border-radius:14px;padding:14px 18px;background:${hexA(T.warn, 0.1)};border:1px solid ${hexA(T.warn, 0.3)};">
  <p style="font-family:${T.BODY};font-weight:500;font-size:14.5px;line-height:1.55;color:${T.ink};">${html}</p></div>`;

// Comment-CTA bubble: commentBubble('מדריך')
const commentBubble = (keyword, label = 'כתבו בתגובות:') => `<div style="display:inline-flex;align-items:center;gap:10px;padding:10px 16px 10px 12px;border-radius:16px;background:${hexA(T.ink, 0.06)};border:1px solid ${hexA(T.ink, 0.16)};">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${T.ink}" stroke-width="1.9"><path d="M21 11.5a8.4 8.4 0 01-9 8.4 9 9 0 01-3.9-.9L3 20l1.1-3.8A8.4 8.4 0 1121 11.5z"/></svg>
  <span style="font-family:${T.BODY};font-size:14px;color:${T.muted};">${label}</span>
  <span style="font-family:${T.HEAD};font-weight:800;font-size:18px;">${gradText('"' + keyword + '"')}</span></div>`;

// Image that fills part of the slide and fades into the background.
// scene('img/s1.jpg', { zone:'bottom', height:62 }) → image in the lower 62%, text goes above it.
function scene(src, { zone = 'bottom', height = 62, pos = 'center' } = {}) {
  const fade = zone === 'bottom' ? 'linear-gradient(180deg, transparent 0%, #000 30%, #000 100%)' : 'linear-gradient(0deg, transparent 0%, #000 30%, #000 100%)';
  return `<img src="${dataUri(src)}" style="position:absolute;left:0;right:0;${zone === 'bottom' ? 'bottom:0' : 'top:0'};width:100%;height:${height}%;object-fit:cover;object-position:${pos};z-index:2;-webkit-mask-image:${fade};mask-image:${fade};"/>`;
}

// Single-photo mode: one real photo behind the whole slide, darkened on the text side.
function photoBg({ src, pos = '50% 50%', zoom = 1, text = 'top' }) {
  const b = T.base;
  const shade = {
    top: `linear-gradient(180deg, ${hexA(b, 0.93)} 0%, ${hexA(b, 0.7)} 38%, ${hexA(b, 0.12)} 66%, ${hexA(b, 0.5)} 100%)`,
    bottom: `linear-gradient(0deg, ${hexA(b, 0.95)} 0%, ${hexA(b, 0.75)} 42%, ${hexA(b, 0.12)} 70%, ${hexA(b, 0.45)} 100%)`,
    center: `linear-gradient(180deg, ${hexA(b, 0.55)} 0%, ${hexA(b, 0.85)} 50%, ${hexA(b, 0.55)} 100%)`,
  }[text];
  return `<img src="${dataUri(src)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${pos};transform:scale(${zoom});transform-origin:${pos};z-index:0;"/>
  <div style="position:absolute;inset:0;background:${shade};z-index:1;"></div>`;
}

// ---------- chrome on every slide ----------
const topBar = () => {
  const logo = has(BRAND.logo) ? `<img src="${dataUri(BRAND.logo)}" style="height:18px;opacity:0.92;"/>`
    : `<span style="font-family:${T.HEAD};font-weight:800;font-size:13px;color:${hexA(T.ink, 0.8)};">${BRAND.business || ''}</span>`;
  return `<div style="position:absolute;top:22px;right:24px;left:24px;z-index:9;display:flex;align-items:center;justify-content:space-between;direction:ltr;">
  <span style="font-family:${T.BODY};font-weight:600;font-size:11.5px;color:${hexA(T.ink, 0.55)};">@${T.HANDLE}</span>${logo}</div>`;
};

function footer(i, total, teaser) {
  const last = i === total - 1;
  const arrow = T.DIR === 'rtl' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6';   // swipe hint points toward the next slide
  const side = T.DIR === 'rtl' ? 'left' : 'right';
  return `${!last ? `<div style="position:absolute;bottom:42px;${side}:24px;z-index:11;display:flex;align-items:center;gap:7px;direction:${T.DIR === 'rtl' ? 'ltr' : 'rtl'};">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="${arrow}" stroke="${T.ink}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      ${teaser ? `<span style="font-family:${T.BODY};font-weight:500;font-size:12px;color:${hexA(T.ink, 0.72)};direction:${T.DIR};">${teaser}</span>` : ''}</div>` : ''}
  <div style="position:absolute;bottom:0;left:0;right:0;padding:14px 24px 18px;z-index:10;display:flex;align-items:center;gap:10px;direction:${T.DIR};">
    <div style="flex:1;height:3px;background:${hexA(T.ink, 0.12)};border-radius:2px;overflow:hidden;"><div style="height:100%;width:${((i + 1) / total) * 100}%;background:${T.grad};border-radius:2px;"></div></div>
    <span style="font-family:${T.BODY};font-size:11px;font-weight:600;color:${hexA(T.ink, 0.45)};direction:ltr;">${i + 1}/${total}</span></div>`;
}

// slide(i, total, inner, { bg:'glow'|'warm'|'plain', teaser:'...', photo:{src,pos,zoom,text} })
function slide(i, total, inner, opt = {}) {
  const back = opt.photo ? photoBg(opt.photo) : bg(opt.bg);
  return `<div class="slide" dir="${T.DIR}" style="background:${T.base};">${back}${topBar()}${inner}${footer(i, total, opt.teaser)}</div>`;
}

// Content column. Text on top of an image: column(html, { top:60, bottom:300, justify:'flex-start' })
const column = (html, { top = 70, bottom = 92, justify = 'center', gap = 14, side = 28 } = {}) =>
  `<div style="position:absolute;top:${top}px;bottom:${bottom}px;left:${side}px;right:${side}px;z-index:6;display:flex;flex-direction:column;justify-content:${justify};gap:${gap}px;">${html}</div>`;

// ---------- page: an Instagram-like swipeable preview; export.js screenshots each .slide ----------
function write(dir, slides, { caption = '', title = 'Carousel' } = {}) {
  const N = slides.length;
  const fonts = [...new Set([(BRAND.fonts || {}).heading || 'Heebo', (BRAND.fonts || {}).body || 'Rubik'])]
    .map(f => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700;800`).join('&');
  const avatar = has(BRAND.profile_photo) ? `<img src="${dataUri(BRAND.profile_photo)}"/>` : '';
  const html = `<!DOCTYPE html><html lang="${BRAND.language || 'he'}"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${title}</title>
<link href="https://fonts.googleapis.com/css2?${fonts}&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#111;display:flex;justify-content:center;align-items:flex-start;padding:24px;min-height:100vh;font-family:${T.BODY}}
.ig-frame{width:420px;background:#000;border-radius:14px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.5);border:1px solid #222}
.ig-header{display:flex;align-items:center;gap:10px;padding:12px 14px;color:#fff;direction:${T.DIR}}
.ig-header .av{width:36px;height:36px;border-radius:50%;padding:2px;background:${T.grad}}
.ig-header .av img{width:100%;height:100%;border-radius:50%;object-fit:cover;object-position:top;background:#222}
.ig-header .name{font-weight:600;font-size:13px}
.carousel-viewport{width:420px;height:525px;overflow:hidden;position:relative;cursor:grab;direction:ltr;touch-action:pan-y}
.carousel-track{display:flex;height:100%;transition:transform .35s cubic-bezier(.4,0,.2,1);direction:ltr}
.slide{width:420px;height:525px;flex:0 0 420px;position:relative;overflow:hidden}
.ig-dots{display:flex;justify-content:center;gap:6px;padding:12px 0 6px}
.ig-dots span{width:6px;height:6px;border-radius:50%;background:#3a3a46;transition:.2s}.ig-dots span.on{background:${T.a2};width:18px;border-radius:3px}
.ig-caption{padding:6px 14px 16px;font-size:13px;color:#e8e8ee;line-height:1.5;direction:${T.DIR};white-space:pre-line}
</style></head><body>
<div class="ig-frame">
  <div class="ig-header"><div class="av">${avatar}</div><div class="name">${T.HANDLE}</div></div>
  <div class="carousel-viewport"><div class="carousel-track">${slides.join('\n')}</div></div>
  <div class="ig-dots">${slides.map((_, i) => `<span class="${i ? '' : 'on'}"></span>`).join('')}</div>
  <div class="ig-caption"><b>${T.HANDLE}</b> ${caption.replace(/</g, '&lt;')}</div>
</div>
<script>
const track=document.querySelector('.carousel-track'),dots=[...document.querySelectorAll('.ig-dots span')],N=${N},W=420,RTL=${T.DIR === 'rtl'};let idx=0,sx=0,cx=0,drag=false;
function go(i){idx=Math.max(0,Math.min(N-1,i));track.style.transform='translateX('+(-idx*W)+'px)';dots.forEach((d,j)=>d.classList.toggle('on',j===idx))}
const vp=document.querySelector('.carousel-viewport');
vp.addEventListener('pointerdown',e=>{drag=true;sx=cx=e.clientX;track.style.transition='none'});
addEventListener('pointermove',e=>{if(!drag)return;cx=e.clientX;track.style.transform='translateX('+(-idx*W+cx-sx)+'px)'});
addEventListener('pointerup',()=>{if(!drag)return;drag=false;track.style.transition='';const d=cx-sx;go(d<-50?idx+1:d>50?idx-1:idx)});
addEventListener('keydown',e=>{if(e.key==='ArrowLeft')go(idx+1);if(e.key==='ArrowRight')go(idx-1)});
</script></body></html>`;
  fs.writeFileSync(path.join(dir, 'carousel.html'), html, 'utf-8');
  console.log('Wrote carousel.html', (html.length / 1024).toFixed(0) + 'KB,', N, 'slides');
}

module.exports = { T, BRAND, dataUri, scene, photoBg, bg, gradText, underline, h1, body, cliff, card, row, callout, commentBubble, slide, column, write };
