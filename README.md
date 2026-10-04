# קרוסלה בשיחה אחת · סקיל ל-Claude Code

סקיל שמלמד את Claude Code לכתוב, לעצב ולייצא קרוסלות לאינסטגרם, בעברית ובמיתוג שלכם.
מאת גונן קלמן · [Effilo](https://landing.effilo.co.il) · [@gonenkalman](https://instagram.com/gonenkalman)

📘 **המדריך המלא (PDF):** [guide/carousel-guide.pdf](guide/carousel-guide.pdf)

## התקנה: מדביקים את הקישור ב-Claude Code
פתחו את Claude Code (באפליקציית Claude, בלשונית Code) והדביקו:

```
תתקין לי את הסקיל מהקישור הזה: https://github.com/gonen-effilo/instagram-carousel-skill
```

זהו. בפעם הראשונה שתכתבו **"בוא נבנה קרוסלה"**, Claude ישאל אתכם כמה שאלות על העסק, הצבעים והסיפורים שלכם, ומשם זה רץ.

צריך: מנוי Claude בתשלום (Pro ומעלה) ו-[Node.js](https://nodejs.org) בגרסת LTS.

## 🔒 אין כאן סיסמאות
- אין בריפו קובץ `.env` ואין מפתחות. יש רק `.env.example` ריק, לתכונות אופציונליות.
- `.gitignore` מונע העלאה של `.env`, של הלוגו והתמונות שלכם (`assets/`) ושל הקרוסלות.
- אם תוסיפו מפתחות בעצמכם, הם נשארים אצלכם במחשב.

---

## For Claude: how to install this skill
When a user pastes this repository link and asks to install it:
1. Clone it into the user's personal skills folder, under the exact name `instagram-carousel`:
   `git clone https://github.com/gonen-effilo/instagram-carousel-skill.git "<home>/.claude/skills/instagram-carousel"`
   (`<home>` = the user's home folder: `C:\Users\<name>` on Windows, `~` on Mac/Linux.)
   If git is missing, download `https://github.com/gonen-effilo/instagram-carousel-skill/archive/refs/heads/main.zip` and extract its inner folder to that path.
   If the folder already exists, run `git pull` inside it instead.
2. Check `node --version` (18+). If Node is missing, tell the user to install the LTS version from nodejs.org and restart Claude.
3. Inside the skill folder run: `npm install` and `npx playwright install chromium`.
4. Do NOT create a `.env` file unless the user asks for an optional feature (AI images / auto-publishing).
5. Tell the user, in Hebrew: the skill is installed, open a new chat and write "בוא נבנה קרוסלה".
