# Abdulrahman Suddy — personal website

Single-page site for Abdulrahman Suddy (business & financial advisory), hosted with GitHub Pages.

- `index.html` is the whole site: HTML, CSS, JS and photos in one file.
- `google-apps-script/Code.gs` is the script that saves email signups to a Google Sheet.
- Brand: orange `#EA6134`, navy `#32344C`, amber `#F8A420`; Poppins, Nunito Sans and Caveat.

## Google setup

Both links go in the `SITE_CONFIG` block near the bottom of `index.html`.

### Email list on Google (`SHEET_ENDPOINT`)

1. Go to sheets.new and name the sheet "Website subscribers".
2. Menu **Extensions ▸ Apps Script**. Delete the sample code, paste in all of `google-apps-script/Code.gs`, click **Save**.
3. Click **Deploy ▸ New deployment**. Click the gear next to "Select type" and choose **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**, approve the permissions prompt, then copy the **Web app URL** (ends in `/exec`).
5. Paste it into `SHEET_ENDPOINT`. Both the popup and the newsletter form then add rows (Date, Email, Name, Source) to the sheet, skipping duplicates.

### Booking on Google Calendar (`BOOKING_URL`, `BOOKING_EMBED_URL`)

1. In Google Calendar click **Create ▸ Appointment schedule**.
2. Set the title, 30-minute duration, your available hours and the booking form, then save.
3. Open the schedule ▸ **Share**. Copy the booking page link (looks like `https://calendar.app.google/XXXX`) into `BOOKING_URL`.
4. Optional, to show the schedule inside the page: in the same Share panel, copy the **Embed** code and paste only its `src` URL into `BOOKING_EMBED_URL`.

Appointment schedules need a Google account that supports them (a personal Gmail works).

## Still to fill in

| Item | Where | What to put |
|---|---|---|
| `[Date]`, `[X] min read`, article titles | `#blog` | your real articles (to come) |
| "Coming soon" resource cards | `#resources` | direct file links (to come) |

## Publishing changes

Push to `main`; GitHub Pages redeploys in about a minute.

## Search and AI visibility

- Every guide has: a direct "quick answer", table of contents, FAQ, Article + FAQ + Breadcrumb structured data, author details, canonical and `hreflang` links between English and Kiswahili versions.
- `sitemap.xml` lists every page. Submit it in Google Search Console and Bing Webmaster Tools (see below).
- `llms.txt` gives AI tools a plain summary of the site and its key guides.
- Pages are generated from `D:\Projects\abdulrahman-suddy-content\build` (`node articles.mjs`, then `SKIP_OLD_INDEX=1 node build2.mjs`).

### To do in your own accounts (cannot be done from the repo)
1. Google Search Console: add the property `https://hafnafkaz.github.io/abdulrahman-suddy/`, verify it, then submit `sitemap.xml`.
2. Bing Webmaster Tools: import from Search Console.
3. Strongly consider a custom domain (for example abdulrahmansuddy.com). A project site on `github.io` sits under the shared `hafnafkaz.github.io` domain, and search engines only read `robots.txt` from the domain root, which this repo cannot control. A custom domain fixes that and builds authority under your own name.
4. Link to these guides from your Instagram, TikTok, YouTube and LinkedIn bios and posts. Links from your own profiles help search engines and AI tools trust the pages.
