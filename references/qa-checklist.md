# QA checklist (after export, before showing the final slides)

Look at every exported PNG (read the image files). Don't approve from the HTML alone.

## Files
- [ ] `slides/slide_1..N.jpg` exist, 1080×1350, each under 8MB.
- [ ] N is between 2 and 10 and matches `TOTAL`. The last slide shows `N/N`.
- [ ] `caption.txt` exists, under 2,200 characters, at most 30 hashtags.

## Text
- [ ] Nothing overflows, touches an edge, or collides with the progress bar, swipe hint or top bar.
- [ ] The headline is readable when the slide is shrunk to about 360px wide (thumbnail test).
- [ ] Hebrew punctuation is on the correct side; Latin words and handles are not scrambled.
- [ ] No leftover placeholders (`[לאמת]`, `{...}`, "השם שלך").
- [ ] Product names are spelled correctly.

## Story
- [ ] Slide 1 opens a question. Slide 2 also works as a second hook.
- [ ] Read every `cliff` line out loud. Would a person say it? Each one is answered at the top of the next slide.
- [ ] No section labels ("הבעיה:"). At most one card or list.
- [ ] Every fact, story and number comes from story-bank.md or from the user.
- [ ] The keyword on the last slide equals the keyword in the caption.

## Layout
- [ ] One focal point per slide; consecutive slides don't all look the same.
- [ ] No unexplained empty band larger than 25% of the slide height.
- [ ] Faces in photos are not covered by text. Images are not stretched.
- [ ] The last slide has no swipe hint and a full progress bar.

## Overflow fixes
- Small (under 20px at 420 scale): tighten a gap or margin.
- Medium: reduce the body by 1px or cut a few words.
- Large: split into two slides. Don't go below 14px for body text.
