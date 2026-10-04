# Optional: automatic publishing to Instagram (via Make.com)

Manual upload works fine. Use this only if the user wants Claude to publish for them.

## Why it looks like this
- Instagram's API publishes only images that sit at a **public URL** (no file upload, no Google Drive links).
  So each slide is first uploaded to Cloudinary (free tier is enough), and the URLs go to Instagram.
- Instagram's API has **no drafts**. Whatever is sent is published. That's why `publish.js` runs as a dry run
  by default, and Claude must get an explicit yes before `--yes`.
- Two small Make scenarios, so each request stays small (one slide per upload request).

## Requirements (the user does these; Claude guides)
1. Instagram **professional** account (Business or Creator), connected to a Facebook Page.
2. Free accounts at make.com and cloudinary.com.
3. A long random secret. Claude generates it and saves it in `.env` as `CAROUSEL_SECRET`.

## Scenario 1 — "Carousel: upload slide"
1. **Webhooks → Custom webhook.** Create a new webhook and copy its URL.
2. **Cloudinary → Upload a Resource.** Connect the Cloudinary account.
   - Add a filter on the link before it: `secret` *Equal to* the value of `CAROUSEL_SECRET`.
   - File type: data. File: `{{toBinary(1.image; "base64")}}`. Resource type: image. Type: `upload`.
   - Folder: `instagram-carousels`. Public ID: `{{1.name}}`.
3. **Webhooks → Webhook response.** Status 200, body `{"url":"{{2.secure_url}}"}`,
   header `Content-Type: application/json`.
4. Scheduling: Immediately. Turn the scenario ON. (Teach the webhook its fields first, see below.)

## Scenario 2 — "Carousel: publish"
1. **Webhooks → Custom webhook.** New webhook, copy its URL.
2. **Instagram for Business → Create a Carousel Post.** Connect the account and pick the Instagram account.
   - Filter before it: `secret` equal to `CAROUSEL_SECRET`.
   - Files: map `{{1.files}}` (each item: `media_type` = IMAGE, `image_url`). Caption: `{{1.caption}}`.
3. **Instagram for Business → Get a Media.** Media ID: `{{2.id}}` (this returns the permalink).
4. **Webhooks → Webhook response.** Body `{"id":"{{2.id}}","permalink":"{{3.permalink}}"}`, JSON header.
5. Scheduling: Immediately. ON.

## .env (in the user's working folder, never shared or committed)
```
CAROUSEL_UPLOAD_WEBHOOK=https://hook.eu1.make.com/...
CAROUSEL_PUBLISH_WEBHOOK=https://hook.eu1.make.com/...
CAROUSEL_SECRET=<long random string>
```

## Teaching the webhooks their structure
Make learns a webhook's fields from the first request. Before connecting the modules, click "Redetermine data structure"
on each webhook and send it a sample:
- Upload: `{"secret":"x","name":"test","image":"<short base64>"}`
- Publish: `{"secret":"x","caption":"test","files":[{"media_type":"IMAGE","image_url":"https://..."}]}`
Claude can send these with `fetch` from Node. The wrong secret makes sure nothing is uploaded or published.

## Troubleshooting
- Cloudinary `Invalid image file` → the File field must be binary: `toBinary(1.image; "base64")`, not a data URI.
- Cloudinary `Type is not a valid type directive` → set Type to `upload`.
- Instagram `aspect ratio` error → slides must be 4:5 JPEG. Re-export.
- `OAuthException` / token expired → reconnect the Instagram connection in Make.
- The upload webhook answers `Accepted` instead of JSON → the scenario is OFF or the response module failed. Check Make history.
- Uploads worked but publishing failed → the URLs are in `uploaded_urls.json`; only scenario 2 needs to run again.
