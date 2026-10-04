// Demo carousel: structure 4 ("method in three steps"). Copy this file into carousels/<date-slug>/,
// set SKILL to the skill folder, and change only the slide contents.
// Run: node generate.js
const fs = require('fs');
const path = require('path');
process.chdir(__dirname);
const SKILL = path.resolve(__dirname, '..', '..');   // <- in a real carousel: the absolute path of the skill folder
const K = require(path.join(SKILL, 'scripts', 'kit.js'));
const { T, gradText, h1, body, cliff, card, row, commentBubble, slide, column } = K;

const TOTAL = 6;
const S = [];

// 1 — Hook
S.push(slide(0, TOTAL, column(`
  ${h1(`פעם קרוסלה לקחה לי<br/>${gradText('חצי יום.')}`, 33)}
  ${body('היום זה שיחה אחת עם Claude.<br/>ככה זה עובד.', 16.5, 'center', T.ink)}
`), { teaser: 'החליקו' }));

// 2 — The pain, as a moment
S.push(slide(1, TOTAL, column(`
  ${h1('פותחים Canva.<br/>מזיזים טקסט. מחליפים צבע.', 26)}
  ${body('ואז שקף 4 יוצא מהמסגרת,<br/>ומתחילים מההתחלה.', 16, 'center', T.ink)}
  ${cliff('והבעיה בכלל לא הייתה העיצוב.')}
`), { bg: 'warm' }));

// 3 — The "aha"
S.push(slide(2, TOTAL, column(`
  ${body('הבעיה הייתה שכל פעם', 16, 'center', T.ink)}
  ${h1(`התחלתי ${gradText('מדף ריק.')}`, 32)}
`)));

// 4 — The method (the one list in the carousel)
S.push(slide(3, TOTAL, column(`
  ${h1('מה שעשיתי במקום:', 26)}
  ${card(`${row('01', 'לימדתי את Claude את המותג שלי פעם אחת', 'צבעים, לוגו, הקהל והטון')}
          ${row('02', 'אני כותב רעיון במשפט', 'הוא מחזיר תסריט שקף אחרי שקף')}
          ${row('03', 'מאשר, והוא מייצא תמונות מוכנות', '<span dir="ltr">1080×1350</span>, ישר לאינסטגרם')}`)}
`, { gap: 16 }), { bg: 'plain' }));

// 5 — What changed
S.push(slide(4, TOTAL, column(`
  ${h1(`הזמן הולך ${gradText('לסיפור')},<br/>לא לגרירת תיבות טקסט.`, 27)}
  ${body('ואם שקף לא יושב טוב, אני כותב "תתקן את 3".', 16, 'center', T.ink)}
`)));

// 6 — CTA
S.push(slide(5, TOTAL, column(`
  ${body('כל אחד יכול לעבוד ככה.', 15.5, 'center', T.ink)}
  ${h1(`רוצים את ${gradText('המדריך?')}`, 30)}
  <div style="display:flex;flex-direction:column;align-items:center;gap:8px;margin-top:6px;">
    ${commentBubble('קרוסלה')}
    <span style="font-family:${T.BODY};font-size:12.5px;color:${T.ink};">ואשלח לכם את המדריך המלא</span>
  </div>
`)));

K.write(__dirname, S, { caption: fs.readFileSync('caption.txt', 'utf8'), title: 'Demo carousel' });
